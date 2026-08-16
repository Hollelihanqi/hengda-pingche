/**
 * 微信小程序云开发调用封装 (Uni-app / 微信小程序)
 */

export interface CloudResponse<T = any> {
  success: boolean;
  data?: T;
  total?: number;
  message?: string;
  error?: string;
}

export async function callCloudFunction<T = any>(
  name: string,
  data: Record<string, any> = {}
): Promise<CloudResponse<T>> {
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud) {
    try {
      const res = await wx.cloud.callFunction({
        name,
        data,
      });
      return (res.result as CloudResponse<T>) || { success: false, error: '无返回值' };
    } catch (err: any) {
      console.error(`[wx.cloud.callFunction ${name} error]`, err);
      return { success: false, error: err.errMsg || err.message || '云函数调用失败' };
    }
  }
  // #endif

  // 非小程序环境或本地存储回退
  return { success: false, error: '当前环境非微信小程序或未开通云开发' };
}
