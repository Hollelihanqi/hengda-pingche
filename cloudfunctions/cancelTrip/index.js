// 云函数: cancelTrip (下架/取消拼车行程)
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  const { tripId } = event;

  if (!tripId) {
    return { success: false, error: '缺少行程 ID' };
  }

  try {
    let tripDoc;
    let docId = tripId;

    if (tripId.startsWith('trip_')) {
      const q = await db.collection('carpool_trips').where({ id: tripId }).get();
      if (q.data && q.data.length > 0) {
        tripDoc = q.data[0];
        docId = tripDoc._id;
      }
    } else {
      const doc = await db.collection('carpool_trips').doc(tripId).get();
      tripDoc = doc.data;
    }

    if (!tripDoc) {
      return { success: false, error: '未找到该行程' };
    }

    // 校验权限 (只有发布者自身可以下架)
    if (openid && tripDoc._openid && tripDoc._openid !== openid) {
      return { success: false, error: '只能下架您本人发布的拼车信息' };
    }

    await db.collection('carpool_trips').doc(docId).update({
      data: {
        status: 'cancelled',
        updatedAt: db.serverDate(),
      },
    });

    return {
      success: true,
      message: '拼车信息已成功下架',
    };
  } catch (err) {
    console.error('[cancelTrip error]', err);
    return {
      success: false,
      error: err.message || '下架失败',
    };
  }
};
