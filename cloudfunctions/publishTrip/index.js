// 云函数: publishTrip (发布拼车信息 - 车找人/人找车)
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID || 'user_unknown';

  const {
    type = 'driver_offer',         // 'driver_offer' (车找人) | 'passenger_request' (人找车)
    direction = 'into_city',       // 'into_city' (文旅城进城) | 'back_home' (返程文旅城)
    departureDate,                 // '2026-08-17'
    departureTime,                 // '07:30'
    origin,                        // { name, detail, zone }
    destination,                   // { name, detail, zone }
    routeHighway = '正阳大道 ➔ 西安绕城高速',
    totalSeats = 3,
    availableSeats,
    price = 0,                     // 拼车分摊油费/0元互助
    phone,                         // 必填联系电话
    publisherName = '拼车邻居',     // 称呼
    avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    gender = 'male',
    carInfo = null,                // 车辆信息 (可选，如: 白色比亚迪汉)
    remark = '',
    isRecurring = false,
    recurringDays = [],
  } = event;

  // 基础参数必填校验 (只验证拼车真实出行要素)
  if (!origin?.name || !destination?.name) {
    return { success: false, error: '出发地与目的地不能为空' };
  }
  if (!departureDate || !departureTime) {
    return { success: false, error: '出发日期与发车时间不能为空' };
  }
  if (!phone || !String(phone).trim()) {
    return { success: false, error: '请填写联系电话，方便邻友顺路联系' };
  }

  try {
    const seatsCount = Math.max(1, Number(totalSeats) || 3);
    const initialAvailable = availableSeats !== undefined ? Number(availableSeats) : seatsCount;

    const tripRecord = {
      _openid: openid,
      id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      direction,
      departureDate,
      departureTime,
      estimatedMinutes: 45,
      isRecurring: Boolean(isRecurring),
      recurringDays: recurringDays || [],
      status: 'active',
      origin: {
        name: origin.name,
        detail: origin.detail || '恒大文旅城',
        zone: origin.zone || '恒大文旅城',
      },
      destination: {
        name: destination.name,
        detail: destination.detail || '',
        zone: destination.zone || '西安主城',
      },
      routeHighway,
      estimatedDistanceKm: 38,
      totalSeats: seatsCount,
      availableSeats: initialAvailable,
      price: Number(price) || 0,
      publisher: {
        id: `usr_${openid.slice(-6)}`,
        name: String(publisherName).trim(),
        avatar,
        gender,
        phone: String(phone).trim(),
        creditScore: 100,
        completedTripsCount: 1,
      },
      carInfo: carInfo || undefined,
      bookings: [],
      remark: remark ? String(remark).slice(0, 200) : '',
      createdAt: db.serverDate(),
      viewCount: 1,
    };

    const addRes = await db.collection('carpool_trips').add({
      data: tripRecord,
    });

    return {
      success: true,
      data: {
        _id: addRes._id,
        ...tripRecord,
      },
      message: '拼车信息发布成功',
    };
  } catch (err) {
    console.error('[publishTrip error]', err);
    return {
      success: false,
      error: err.message || '发布拼车失败',
    };
  }
};
