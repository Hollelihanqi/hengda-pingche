import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server/db';
import { CarpoolTrip } from '@/types/carpool';

// GET /api/trips - Query list of trips
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || undefined;
    const direction = searchParams.get('direction') || undefined;
    const date = searchParams.get('date') || undefined;
    const keyword = searchParams.get('keyword') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '50', 10);

    const result = serverDb.getTrips({
      type,
      direction,
      date,
      keyword,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      data: result.trips,
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { success: false, error: '获取拼车列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/trips - Publish a new trip
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.origin?.name || !body.destination?.name) {
      return NextResponse.json(
        { success: false, error: '出发地与目的地不能为空' },
        { status: 400 }
      );
    }

    if (!body.departureDate || !body.departureTime) {
      return NextResponse.json(
        { success: false, error: '出发日期和时间不能为空' },
        { status: 400 }
      );
    }

    if (!body.publisher?.phone) {
      return NextResponse.json(
        { success: false, error: '联系电话不能为空' },
        { status: 400 }
      );
    }

    const cleanUserName = (body.publisher.name || '文旅城邻居')
      .replace(/[\(（].*?[\)）]/g, '')
      .trim();

    const newTrip: CarpoolTrip = {
      id: body.id || `trip_srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: body.type || 'driver_offer',
      direction: body.direction || 'into_city',
      departureDate: body.departureDate,
      departureTime: body.departureTime,
      estimatedMinutes: body.estimatedMinutes || 45,
      isRecurring: Boolean(body.isRecurring),
      recurringDays: body.recurringDays || ['周一', '周二', '周三', '周四', '周五'],
      status: 'active',
      origin: {
        name: body.origin.name,
        detail: body.origin.detail || '恒大文旅城',
        zone: body.origin.zone || '恒大文旅城',
        lat: body.origin.lat,
        lng: body.origin.lng,
      },
      destination: {
        name: body.destination.name,
        detail: body.destination.detail || '',
        zone: body.destination.zone || '高新区',
        lat: body.destination.lat,
        lng: body.destination.lng,
      },
      waypoints: body.waypoints || [],
      preferences: body.preferences || ['准时发车', '走正阳快速路'],
      routeHighway: body.routeHighway || '正阳大道 ➔ 西安绕城高速',
      estimatedDistanceKm: body.estimatedDistanceKm || 38,
      totalSeats: body.totalSeats || 3,
      availableSeats: body.availableSeats !== undefined ? body.availableSeats : body.totalSeats || 3,
      price: body.price || 0,
      publisher: {
        id: body.publisher.id || 'usr_pub_' + Date.now(),
        name: cleanUserName,
        avatar:
          body.publisher.avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        gender: body.publisher.gender || 'male',
        phone: body.publisher.phone.trim(),
        isVerifiedOwner: Boolean(body.publisher.isVerifiedOwner ?? true),
        communityPhase: body.publisher.communityPhase || '1期星空',
        roomNumber: body.publisher.roomNumber || '',
        creditScore: body.publisher.creditScore || 100,
        completedTripsCount: body.publisher.completedTripsCount || 1,
      },
      carInfo: body.carInfo || undefined,
      bookings: [],
      remark: body.remark ? body.remark.slice(0, 200) : '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      viewCount: 1,
    };

    const saved = serverDb.createTrip(newTrip);

    return NextResponse.json(
      {
        success: true,
        message: '拼车信息发布成功',
        data: saved,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { success: false, error: '发布拼车信息失败，请稍后重试' },
      { status: 500 }
    );
  }
}
