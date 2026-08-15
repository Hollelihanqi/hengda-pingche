'use client';

import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Sparkles, 
  Car, 
  MapPin, 
  Clock, 
  CheckCircle2,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { CarpoolTrip, UserProfile } from '@/types/carpool';

interface WeChatShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: CarpoolTrip[];
  currentUser: UserProfile;
}

export default function WeChatShareModal({
  isOpen,
  onClose,
  trips,
  currentUser,
}: WeChatShareModalProps) {
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState<'card' | 'text' | 'poster'>('card');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Generate WeChat group text
  const generateWeChatText = () => {
    if (!currentTrip) return '';
    const isOffer = currentTrip.type === 'driver_offer';
    return `🏰【恒大文旅城·邻里拼车】0元公益互助\n` +
      `🚗 类型：${isOffer ? '车找人 (车主发车)' : '人找车 (求拼车)'}\n` +
      `👤 发布：${currentTrip.publisher.name} (${currentTrip.publisher.communityPhase.split('·')[1] || currentTrip.publisher.communityPhase})\n` +
      `⏰ 时间：${currentTrip.departureDate} ${currentTrip.departureTime}\n` +
      `📍 出发：${currentTrip.origin.name}\n` +
      `🏁 目的：${currentTrip.destination.name}\n` +
      `🛣️ 路线：${currentTrip.routeHighway} (约${currentTrip.estimatedMinutes}分钟)\n` +
      `💺 剩余：${isOffer ? `${currentTrip.availableSeats} 个空位` : `需要 ${currentTrip.availableSeats} 个座位`}\n` +
      `🏷️ 偏好：${currentTrip.preferences.join(' / ')}\n` +
      `💬 微信小程序直达免费预约：#小程序://恒大文旅城拼车/${currentTrip.id}`;
  };

  const handleCopyText = () => {
    const text = generateWeChatText();
    navigator.clipboard?.writeText(text);
    setCopied(true);
    showToast('已复制微信群拼车文案！可直接粘贴至业主群');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-60 rounded-2xl bg-slate-900/90 text-white text-xs px-4 py-2.5 shadow-xl flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-150">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs font-bold text-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">分享至恒大文旅城业主微信群</h3>
              <p className="text-[10px] text-slate-500">一键生成微信群转发卡片与拼车文案</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Select which trip to share */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">选择要分享的拼车行程：</label>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.type === 'driver_offer' ? '🚗 [车找人]' : '🙋 [人找车]'} {t.departureTime} {t.origin.name.split('·')[1] || t.origin.name} ➔ {t.destination.name} (余{t.availableSeats}座)
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-2xl bg-slate-100 p-1 text-xs">
            <button
              onClick={() => setShareType('card')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition ${
                shareType === 'card' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              微信卡片预览
            </button>
            <button
              onClick={() => setShareType('text')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition ${
                shareType === 'text' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              微信群文案
            </button>
          </div>

          {/* Preview: WeChat Mini Program Chat Bubble Card */}
          {shareType === 'card' && currentTrip && (
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400">微信聊天界面卡片呈现效果：</div>
              
              {/* Simulated WeChat Chat Bubble */}
              <div className="rounded-2xl bg-slate-100 p-3 border border-slate-200/80">
                <div className="flex items-start gap-2.5 max-w-[340px] ml-auto">
                  {/* Mini-Program Share Card */}
                  <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden text-xs space-y-2">
                    {/* Card Header */}
                    <div className="flex items-center gap-1.5 px-3 pt-2.5 text-[10px] text-slate-400">
                      <div className="h-3.5 w-3.5 rounded bg-emerald-600 text-white flex items-center justify-center text-[8px] font-black">
                        恒
                      </div>
                      <span className="font-semibold text-slate-600">恒大文旅城邻里拼车</span>
                      <span className="ml-auto text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">0元公益</span>
                    </div>

                    {/* Card Body */}
                    <div className="px-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          currentTrip.type === 'driver_offer' ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                        }`}>
                          {currentTrip.type === 'driver_offer' ? '🚗 车找人 (有空位)' : '🙋 人找车 (求拼车)'}
                        </span>
                        <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-emerald-600" />
                          {currentTrip.departureTime}
                        </span>
                      </div>

                      <div className="font-bold text-slate-900 text-xs">
                        {currentTrip.origin.name.split('·')[1] || currentTrip.origin.name}
                        <span className="text-slate-400 mx-1">➔</span>
                        {currentTrip.destination.name}
                      </div>

                      <div className="text-[10px] text-slate-500 line-clamp-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        🛣️ 途经：{currentTrip.routeHighway} · 剩余 {currentTrip.availableSeats} 席
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>微信小程序</span>
                      <span className="text-emerald-700 font-bold">点击进入预约 ➔</span>
                    </div>
                  </div>

                  {/* User Avatar */}
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5 border border-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preview: Text format */}
          {shareType === 'text' && (
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400">微信群标准排版文案：</div>
              <pre className="rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed border border-slate-200 select-all">
                {generateWeChatText()}
              </pre>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <button
            onClick={handleCopyText}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? '已复制到剪贴板！' : '复制微信群转发文案'}
          </button>

          <button
            onClick={() => {
              showToast('已模拟唤起微信「发送给朋友/业主群」面板');
            }}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition"
          >
            <Users className="h-4 w-4 text-slate-600" />
            发给微信好友
          </button>
        </div>
      </div>
    </div>
  );
}
