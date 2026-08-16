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
  Sparkles, 
  Share2, 
  CheckCircle2,
  Phone,
  MessageCircle,
  RotateCcw
} from 'lucide-react';
import { UserProfile, CarpoolTrip } from '@/types/carpool';
import { WeChatTabType } from '@/components/wechat/WeChatTabBar';

interface WeChatProfileViewProps {
  currentUser: UserProfile;
  trips: CarpoolTrip[];
  onOpenVerify: () => void;
  onOpenCharter: () => void;
  onOpenAi: () => void;
  onOpenShare: () => void;
  onSelectTab: (tab: WeChatTabType) => void;
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

      {/* Simplified WeChat Header Card (Clean, elegant, no redundant buttons or micro-signals) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-5 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-14 w-14 rounded-2xl border-2 border-white/80 object-cover shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight truncate">{currentUser.name}</h3>
              <span className="shrink-0 rounded-full bg-emerald-400/30 px-2 py-0.5 text-[10px] font-bold text-emerald-200 backdrop-blur-xs">
                文旅城邻居
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1 truncate">
              {currentUser.communityPhase || '恒大文旅城·邻里通勤'}
            </p>
          </div>
        </div>

        {/* Quick Location info */}
        <div className="mt-3.5 flex items-center justify-between rounded-2xl bg-black/25 px-3.5 py-2.5 backdrop-blur-md text-xs">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 text-emerald-300 shrink-0" />
            <span className="text-white truncate">
              常用门岗：<span className="text-emerald-300 font-medium">{currentUser.roomNumber ? currentUser.roomNumber : '星空门岗 / 童梦汇'}</span>
            </span>
          </div>
          <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30 shrink-0">
            开放互助
          </span>
        </div>
      </div>

      {/* Credit & Activity Stats Bar */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-3 border border-slate-200/80 shadow-xs text-center">
        <div className="space-y-0.5">
          <div className="text-base font-black text-emerald-600">100%</div>
          <div className="text-[10px] text-slate-400">守时率</div>
        </div>
        <div className="space-y-0.5 border-l border-slate-100">
          <div className="text-base font-black text-slate-900">{currentUser.completedTripsCount}次</div>
          <div className="text-[10px] text-slate-400">顺路拼车</div>
        </div>
        <div className="space-y-0.5 border-l border-slate-100">
          <div className="text-base font-black text-blue-600">58.4kg</div>
          <div className="text-[10px] text-slate-400">绿色减排</div>
        </div>
      </div>

      {/* Quick Action Matrix (WeChat Services Grid) */}
      <div className="rounded-3xl bg-white p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-800">快捷服务</div>
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
            onClick={() => onSelectTab('publish')}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
          >
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-800">发布信息</span>
          </button>

          <button
            onClick={onOpenShare}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
          >
            <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
              <Share2 className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-800">分享大厅</span>
          </button>

          <button
            onClick={onOpenCharter}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
          >
            <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-2xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-800">邻里公约</span>
          </button>
        </div>
      </div>

      {/* WeChat Cell Group: Account & Community Settings */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100 text-xs">
        {/* User Profile & Car Settings */}
        <button
          onClick={onOpenVerify}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 text-left transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Car className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">个人资料与车辆设置 (选填)</div>
              <div className="text-[10px] text-slate-400">设置昵称、常用门岗及车牌信息</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[11px] font-semibold text-emerald-600">设置</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>

        {/* Safety Charter */}
        <button
          onClick={onOpenCharter}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 text-left transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">邻里拼车互助公约与安全守则</div>
              <div className="text-[10px] text-slate-400">文明合乘准则与准时守则</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[11px] text-slate-400">查看</span>
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
              <div className="font-bold text-slate-900">微信服务通知 (发车与预约提醒)</div>
              <div className="text-[10px] text-slate-400">发车前15分钟微信提醒、邻居预约提醒</div>
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
              <div className="font-bold text-slate-900">恒大文旅城邻里微信拼车群</div>
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
          恒大文化旅游城 · 邻里通勤顺路拼车信息平台
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
              <h3 className="text-base font-black text-slate-900">恒大文旅城邻里拼车群</h3>
              <p className="text-xs text-slate-500 mt-1">
                文旅城及周边通勤邻里互助群
              </p>
            </div>

            {/* QR Code Container */}
            <div className="rounded-2xl border-2 border-dashed border-emerald-300/80 bg-emerald-50/40 p-5 inline-block mx-auto">
              <div className="h-44 w-44 bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center justify-center relative">
                <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h-2v2h-2v2h4v-4zm-4 4h-2v2h2v-2zm4 2h2v-2h-2v2zm2-4h2v-2h-2v2zm-2-2h2v-2h-2v2zM6 6h2v2H6V6zm12 0h2v2h-2V6zM6 18h2v2H6v-2zm7-9h2v2h-2V9zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2z"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-9 w-9 rounded-xl bg-white shadow-md border border-slate-200 flex items-center justify-center">
                    <span className="text-xs font-black text-emerald-700">恒大</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('hd_wlc_admin');
                  showToast('已复制微信：hd_wlc_admin');
                }}
                className="flex-1 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition"
              >
                复制群管理员微信
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
