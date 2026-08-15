'use client';

import React from 'react';
import { X, ShieldCheck, HeartHandshake, AlertCircle, CheckCircle2, Award } from 'lucide-react';

interface SafetyCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SafetyCharterModal({ isOpen, onClose }: SafetyCharterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg my-6 overflow-hidden rounded-3xl border border-white/80 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">恒大文旅城邻里拼车公约</h3>
            <p className="text-xs text-slate-500">公益非营运 · 互助同行 · 文明守信</p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-xs text-slate-700 max-h-[60vh] overflow-y-auto pr-1">
          {/* Article 1 */}
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                1
              </span>
              零费用公益互助原则
            </div>
            <p className="text-slate-600 leading-relaxed pl-6">
              本小程序专为西安恒大文化旅游城业主日常远郊通勤设立，<strong>不设任何支付、打赏、抽成及算费功能</strong>
              。严禁利用本平台从事非法客运或变相营运行为。
            </p>
          </div>

          {/* Article 2 */}
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                2
              </span>
              守时与诚信准则
            </div>
            <p className="text-slate-600 leading-relaxed pl-6">
              文旅城进城早高峰时间宝贵，拼车乘客应提前5分钟在指定门岗等候；车主如遇突发情况请至少提前30分钟在平台告知，杜绝无故爽约。
            </p>
          </div>

          {/* Article 3 */}
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                3
              </span>
              安全驾驶与文明乘车
            </div>
            <p className="text-slate-600 leading-relaxed pl-6">
              车主走绕城高速/正阳大道须系好安全带、不疲劳驾驶、不超速；车内全面禁烟，共同维护干净舒适的乘车环境。
            </p>
          </div>

          {/* Article 4 */}
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                4
              </span>
              免责声明与风险自担
            </div>
            <p className="text-slate-600 leading-relaxed pl-6">
              平台仅提供同小区邻里出行信息撮合与预约记录，双方基于自愿互助原则同行，各方应自行购买人身意外出行保险。
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition"
        >
          我已阅读并同意遵守公约
        </button>
      </div>
    </div>
  );
}
