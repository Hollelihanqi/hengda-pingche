// 云函数: bookTrip (预约拼车座位)
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID || 'user_unknown';

  const {
    tripId,
    passengerName,
    passengerPhone,
    passengerAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    seatsBooked = 1,
    pickupPoint = '恒大文旅城大门口',
    dropoffPoint = '目的地附近',
    notes = '',
  } = event;

  if (!tripId) {
    return { success: false, error: '缺少拼车行程 ID' };
  }
  if (!passengerName || !passengerPhone) {
    return { success: false, error: '乘车人姓名和电话不能为空' };
  }

  const seatsNum = Math.max(1, Number(seatsBooked) || 1);

  try {
    // 1. 查询该行程
    let tripDoc;
    if (tripId.startsWith('trip_')) {
      const q = await db.collection('carpool_trips').where({ id: tripId }).get();
      if (q.data && q.data.length > 0) {
        tripDoc = q.data[0];
      }
    } else {
      const doc = await db.collection('carpool_trips').doc(tripId).get();
      tripDoc = doc.data;
    }

    if (!tripDoc) {
      return { success: false, error: '未找到该拼车行程或已被取消' };
    }

    if (tripDoc.availableSeats < seatsNum) {
      return { success: false, error: `剩余座位不足 (仅剩 ${tripDoc.availableSeats} 个座位)` };
    }

    // 2. 生成 6 位乘车核销码
    const boardingCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newBooking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tripId: tripDoc.id || tripId,
      passengerId: `usr_${openid.slice(-6)}`,
      passengerName: String(passengerName).trim(),
      passengerPhone: String(passengerPhone).trim(),
      passengerAvatar,
      seatsBooked: seatsNum,
      pickupPoint,
      dropoffPoint,
      notes: String(notes || '').slice(0, 100),
      status: 'confirmed',
      boardingCode,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const remainingSeats = Math.max(0, tripDoc.availableSeats - seatsNum);
    const newStatus = remainingSeats === 0 ? 'full' : tripDoc.status;

    // 3. 更新数据库记录
    const docId = tripDoc._id || tripId;
    await db.collection('carpool_trips').doc(docId).update({
      data: {
        availableSeats: remainingSeats,
        status: newStatus,
        bookings: _.push(newBooking),
        updatedAt: db.serverDate(),
      },
    });

    return {
      success: true,
      message: '拼车预约成功',
      data: {
        booking: newBooking,
        remainingSeats,
        status: newStatus,
      },
    };
  } catch (err) {
    console.error('[bookTrip error]', err);
    return {
      success: false,
      error: err.message || '预约拼车失败',
    };
  }
};
