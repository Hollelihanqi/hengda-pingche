import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/trips/[id]/book - Reserve seats
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!body.passengerName || !body.phone) {
      return NextResponse.json(
        { success: false, error: '乘车人姓名与联系电话不能为空' },
        { status: 400 }
      );
    }

    const seatsBooked = Number(body.seatsBooked) || 1;

    const result = serverDb.bookTrip(id, {
      tripId: id,
      passengerId: body.passengerId || 'usr_' + Date.now(),
      passengerName: body.passengerName,
      passengerAvatar:
        body.passengerAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      passengerPhone: body.phone,
      communityPhase: body.communityPhase || '文旅城',
      seatsBooked,
      pickupPoint: body.pickupPoint || '恒大文旅城大门口',
      dropoffPoint: body.dropoffPoint || '目的地附近',
      notes: body.notes || body.note || '',
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: '预约失败，未找到该拼车或座位不足' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '拼车预约成功',
      data: result,
    });
  } catch (error: any) {
    console.error('Error booking trip:', error);
    return NextResponse.json(
      { success: false, error: error.message || '预约拼车失败' },
      { status: 400 }
    );
  }
}
