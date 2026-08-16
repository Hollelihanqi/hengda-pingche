import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server/db';
import { currentUserProfile } from '@/lib/mockData';

// GET /api/user/profile - Get current user profile
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || currentUserProfile.id;

    const user = serverDb.getUser(userId) || currentUserProfile;

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json(
      { success: false, error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}

// POST /api/user/profile - Update user profile and verification
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.id || currentUserProfile.id;

    const existingUser = serverDb.getUser(userId) || currentUserProfile;
    const updatedUser = {
      ...existingUser,
      ...body,
      isVerifiedOwner: true, // Auto-mark verified when submitting community info
    };

    serverDb.saveUser(updatedUser);

    return NextResponse.json({
      success: true,
      message: '业主身份与个人信息已更新',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, error: '更新用户信息失败' },
      { status: 500 }
    );
  }
}
