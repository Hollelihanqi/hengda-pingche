'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Car, 
  MapPin, 
  Users, 
  FileText, 
  Bell, 
  QrCode, 
  ChevronRight, 
  HeartHandshake, 
  Sparkles, 
  Award, 
  Smartphone, 
  Share2, 
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { UserProfile, CarpoolTrip } from '@/types/carpool';

interface WeChatProfileViewProps {
  currentUser: UserProfile;
  trips: CarpoolTrip[];
  onOpenVerify: () => void;
  onOpenCharter: () => void;
  onOpenAi: () => void;
  onOpenShare: () => void;
  onSelectTab: (tab: 'hall' | 'map' | 'my_trips' | 'profile') => void;
  onResetData: () => void;
}

export default function WeChatProfileView({
  currentUser,
  trips,
  onOpenVerify,
  onOpenCharter,
  onOpenAi,
  onOpenShare,
  onSelectTab,
  onResetData,
}: WeChatProfileViewProps) {
  const [isNoticeEnabled, setIsNoticeEnabled] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // User stats
  const myPublishedCount = trips.filter((t) => t.publisher.id === currentUser.id).length;
  const myBookedCount = trips.filter((t) => t.bookings.some((b) => b.passengerId === currentUser.id)).length;

  return (
    <div className="space-y-3 pb-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-slate-900/90 text-white text-xs px-4 py-2.5 shadow-xl flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-150">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* WeChat Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-5 text-white shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-14 w-14 rounded-2xl border-2 border-white/80 object-cover shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                <ShieldCheck className="h-3 w-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black tracking-tight">{currentUser.name}</h3>
                <span className="rounded-full bg-emerald-400/30 px-2 py-0.5 text-[10px] font-bold text-emerald-200 backdrop-blur-xs">
                  已认证业主
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {currentUser.communityPhase}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-200/80 mt-1">
                <span>微信号：hd_owner_{currentUser.id.slice(-4)}</span>
                <span>•</span>
                <span>{currentUser.phone}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenVerify}
            className="rounded-xl border border-white/30 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md hover:bg-white/20 active:scale-95 transition"
          >
            编辑资料
          </button>
        </div>

        {/* Resident Verification Badge Bar */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-black/25 px-3.5 py-2.5 backdrop-blur-md text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <div>
              <span className="font-bold text-white">房号与身份核实</span>
              <span className="text-emerald-300 ml-1.5">{currentUser.roomNumber}</span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
            文旅城专属身份
          </span>
        </div>
      </div>

      {/* Credit & Impact Stats Bar */}
      <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-3 border border-slate-200/80 shadow-xs text-center">
        <div className="space-y-0.5">
          <div className="text-base font-black text-emerald-600">100%</div>
          <div className="text-[10px] text-slate-400">守时率</div>
        </div>
        <div className="space-y-0.5 border-l border-slate-100">
          <div className="text-base font-black text-slate-900">{currentUser.completedTripsCount}次</div>
          <div className="text-[10px] text-slate-400">互助出行</div>
        </div>
        <div className="space-y-0.5 border-l border-slate-100">
          <div className="text-base font-black text-blue-600">58.4kg</div>
          <div className="text-[10px] text-slate-400">减碳排放</div>
        </div>
        <div className="space-y-0.5 border-l border-slate-100">
          <div className="text-base font-black text-amber-600">0元</div>
          <div className="text-[10px] text-slate-400">公益互助</div>
        </div>
      </div>

      {/* Quick Action Matrix (WeChat Services Grid) */}
      <div className="rounded-3xl bg-white p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-800">我的通勤服务</div>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onSelectTab('my_trips')}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
          >
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
              <Car className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-800">我的发布</span>
            {myPublishedCount > 0 && (
              <span className="text-[9px] text-emerald-600 font-bold -mt-1">({myPublishedCount}条)</span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('my_trips')}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
          >
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-800">我的预约</span>
            {myBookedCount > 0 && (
              <span className="text-[9px] text-blue-600 font-bold -mt-1">({myBookedCount}个)</span>
            )}
          </button>

          <button
            onClick={onOpenShare}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
          >
            <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
              <Share2 className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-800">群拼车卡片</span>
          </button>

          <button
            onClick={onOpenAi}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
          >
            <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-800">AI 小恒助手</span>
          </button>
        </div>
      </div>

      {/* WeChat Cell Group: Account & Community Settings */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100 text-xs">
        {/* Verification Status */}
        <button
          onClick={onOpenVerify}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 text-left transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">恒大文旅城业主认证</div>
              <div className="text-[10px] text-slate-400">核验门岗、楼栋与车牌号</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[11px] font-semibold text-emerald-600">已认证</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>

        {/* Safety & Non-profit Charter */}
        <button
          onClick={onOpenCharter}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 text-left transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">0元公益互助公约与免责协议</div>
              <div className="text-[10px] text-slate-400">非营运合乘准则与安全守则</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[11px] text-slate-400">已签署</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>

        {/* WeChat Service Notification Subscription Switch */}
        <div className="flex items-center justify-between p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">微信服务通知 (出行与预约提醒)</div>
              <div className="text-[10px] text-slate-400">发车前15分钟微信弹窗、邻居预约提醒</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isNoticeEnabled}
              onChange={() => {
                const next = !isNoticeEnabled;
                setIsNoticeEnabled(next);
                showToast(next ? '已开启微信出行提醒服务通知' : '已关闭服务通知提醒');
              }}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* WeChat Community Group & QR */}
        <button
          onClick={() => setShowQrModal(true)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 text-left transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">恒大文旅城业主微信拼车群</div>
              <div className="text-[10px] text-slate-400">加入500人文旅城早晚高峰互助群</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[11px] text-amber-600 font-semibold">扫码进群</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>

        {/* Reset mock data */}
        <button
          onClick={() => {
            onResetData();
            showToast('已重置为文旅城默认示范数据');
          }}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 text-left transition text-slate-600"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-slate-700">重置示例拼车数据</div>
              <div className="text-[10px] text-slate-400">恢复初始行程与预约样例</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      {/* Bottom WeChat Applet Info */}
      <div className="text-center space-y-1 pt-2">
        <p className="text-[11px] text-slate-400 font-medium">
          恒大文化旅游城业主自发共建 · 0元公益非营运互助
        </p>
        <p className="text-[10px] text-slate-300">
          微信小程序 AppID: wx8f9a21d4c78b · v1.2.0 (Build 2026.08)
        </p>
      </div>

      {/* WeChat Group QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <QrCode className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">恒大文旅城业主通勤拼车群</h3>
              <p className="text-xs text-slate-500 mt-1">
                仅限文旅城1/2/3/4期业主及常住通勤邻居加入
              </p>
            </div>

            {/* QR Code Container */}
            <div className="rounded-2xl border-2 border-dashed border-emerald-300/80 bg-emerald-50/40 p-5 inline-block mx-auto">
              <div className="h-44 w-44 bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center justify-center relative">
                {/* SVG styled QR representation */}
                <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h-2v2h-2v2h4v-4zm-4 4h-2v2h2v-2zm4 2h2v-2h-2v2zm2-4h2v-2h-2v2zm-2-2h2v-2h-2v2zM6 6h2v2H6V6zm12 0h2v2h-2V6zM6 18h2v2H6v-2zm7-9h2v2h-2V9zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2z"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-9 w-9 rounded-xl bg-white shadow-md border border-slate-200 flex items-center justify-center">
                    <span className="text-xs font-black text-emerald-700">恒大</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-emerald-800 font-bold mt-2">
                群管理员微信：hd_wlc_admin
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              微信扫一扫上方二维码进群，或点击下方按钮复制管理员微信进群
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('hd_wlc_admin');
                  showToast('已复制管理员微信：hd_wlc_admin');
                }}
                className="flex-1 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition"
              >
                复制管理员微信号
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 active:scale-95 transition"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
