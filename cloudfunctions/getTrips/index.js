// 云函数: getTrips (查询拼车行程列表)
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const {
    type,        // 'driver_offer' | 'passenger_request' | 'all'
    direction,   // 'into_city' | 'back_home' | 'all'
    date,        // 'YYYY-MM-DD'
    keyword,     // 目的地/路线/姓名/电话模糊搜索
    page = 1,
    pageSize = 30,
  } = event;

  try {
    // 默认查询有效或已满的拼车
    let query = db.collection('carpool_trips').where({
      status: _.in(['active', 'full']),
    });

    if (type && type !== 'all') {
      query = query.where({ type });
    }

    if (direction && direction !== 'all') {
      query = query.where({ direction });
    }

    if (date) {
      query = query.where({ departureDate: date });
    }

    // 统计总数
    const countResult = await query.count();
    const total = countResult.total;

    // 分页查询并按出发日期、时间升序排序
    const res = await query
      .orderBy('departureDate', 'asc')
      .orderBy('departureTime', 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();

    let trips = res.data;

    // 如果有关键字搜索，支持对出发地、目的地、路线、发布人等模糊过滤
    if (keyword && keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      trips = trips.filter((t) => {
        return (
          (t.origin && t.origin.name && t.origin.name.toLowerCase().includes(kw)) ||
          (t.destination && t.destination.name && t.destination.name.toLowerCase().includes(kw)) ||
          (t.routeHighway && t.routeHighway.toLowerCase().includes(kw)) ||
          (t.publisher && t.publisher.name && t.publisher.name.toLowerCase().includes(kw)) ||
          (t.publisher && t.publisher.phone && t.publisher.phone.includes(kw)) ||
          (t.remark && t.remark.toLowerCase().includes(kw))
        );
      });
    }

    return {
      success: true,
      data: trips,
      total,
      page,
      pageSize,
    };
  } catch (err) {
    console.error('[getTrips error]', err);
    return {
      success: false,
      error: err.message || '获取拼车列表失败',
    };
  }
};
