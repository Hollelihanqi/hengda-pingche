// 云函数: getStats (拼车大厅动态与统计)
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const tripsRes = await db.collection('carpool_trips').limit(100).get();
    const allTrips = tripsRes.data || [];

    const activeTrips = allTrips.filter((t) => t.status === 'active' || t.status === 'full');
    const driverTrips = activeTrips.filter((t) => t.type === 'driver_offer');
    const passengerTrips = activeTrips.filter((t) => t.type === 'passenger_request');

    const totalSeatsOffered = driverTrips.reduce((acc, t) => acc + (t.totalSeats || 3), 0);
    const totalSeatsBooked = driverTrips.reduce(
      (acc, t) => acc + ((t.totalSeats || 3) - (t.availableSeats || 0)),
      0
    );

    // 预估减碳量: 单程约减少 1.5kg CO2
    const co2SavedKg = Math.round(totalSeatsBooked * 1.5 * 10) / 10;

    return {
      success: true,
      data: {
        totalTrips: allTrips.length,
        activeTrips: activeTrips.length,
        driverOffers: driverTrips.length,
        passengerRequests: passengerTrips.length,
        totalSeatsOffered,
        totalSeatsBooked,
        co2SavedKg,
      },
    };
  } catch (err) {
    console.error('[getStats error]', err);
    return {
      success: false,
      error: err.message,
      data: {
        totalTrips: 0,
        activeTrips: 0,
        driverOffers: 0,
        passengerRequests: 0,
        totalSeatsOffered: 0,
        totalSeatsBooked: 0,
        co2SavedKg: 0,
      },
    };
  }
};
