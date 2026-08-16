import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/wechat - WeChat Mini-Program wx.login code2Session
export async function POST(req: NextRequest) {
  try {
    const { code, userInfo } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: '缺少微信登录凭证 code' },
        { status: 400 }
      );
    }

    const appId = process.env.WECHAT_APPID;
    const appSecret = process.env.WECHAT_APP_SECRET;

    // Real WeChat code2session if credentials exist
    if (appId && appSecret) {
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.errcode && data.errcode !== 0) {
        console.error('WeChat code2Session error:', data);
        return NextResponse.json(
          {
            success: false,
            error: data.errmsg || '微信鉴权失败',
            errcode: data.errcode,
          },
          { status: 400 }
        );
      }

      // Successful WeChat authentication
      const openid = data.openid;
      const sessionKey = data.session_key;
      const unionid = data.unionid || '';

      return NextResponse.json({
        success: true,
        openid,
        unionid,
        token: `wx_token_${openid.slice(-8)}_${Date.now()}`,
        user: {
          id: `usr_${openid.slice(-8)}`,
          name: userInfo?.nickName || '文旅城邻居',
          avatar: userInfo?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          isVerifiedOwner: true,
        },
      });
    }

    // Compliant development mock response when env secrets are pending user setup
    const simulatedOpenId = `wx_openid_hd_${code.slice(0, 8)}_${Math.random().toString(36).substring(2, 6)}`;
    return NextResponse.json({
      success: true,
      openid: simulatedOpenId,
      token: `dev_token_${Date.now()}`,
      isMock: true,
      message: '开发环境模拟登录成功 (配置 WECHAT_APPID 及 SECRET 后自动直连腾讯云)',
      user: {
        id: 'usr_owner_001',
        name: userInfo?.nickName || '林远',
        avatar: userInfo?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        phone: '18729391167',
        isVerifiedOwner: true,
        communityPhase: '恒大文旅城·1期星空',
        roomNumber: '12栋1单元1802',
      },
    });
  } catch (error) {
    console.error('Error in WeChat authentication:', error);
    return NextResponse.json(
      { success: false, error: '微信登录处理异常' },
      { status: 500 }
    );
  }
}
