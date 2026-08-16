import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/trips/[id] - Get trip details
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const trip = serverDb.getTripById(id);

    if (!trip) {
      return NextResponse.json(
        { success: false, error: '未找到该拼车信息' },
        { status: 404 }
      );
    }

    // Increment view count
    serverDb.updateTrip(id, { viewCount: (trip.viewCount || 0) + 1 });

    return NextResponse.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error('Error fetching trip detail:', error);
    return NextResponse.json(
      { success: false, error: '获取拼车详情失败' },
      { status: 500 }
    );
  }
}

// PUT /api/trips/[id] - Update trip details
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const updates = await req.json();

    const updated = serverDb.updateTrip(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: '未找到该拼车信息进行更新' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json(
      { success: false, error: '更新拼车信息失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/trips/[id] - Delete or cancel a trip
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const success = serverDb.deleteTrip(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: '未找到该拼车信息或已删除' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '拼车信息已成功下架/删除',
    });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json(
      { success: false, error: '删除拼车信息失败' },
      { status: 500 }
    );
  }
}
