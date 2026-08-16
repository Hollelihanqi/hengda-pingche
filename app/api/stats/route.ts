import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server/db';

// GET /api/stats - Community Carpool Overview Statistics
export async function GET() {
  try {
    const stats = serverDb.getStats();
    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
