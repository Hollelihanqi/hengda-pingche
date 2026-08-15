'use client';

import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  CircleDot, 
  Share2, 
  Users, 
  BookmarkPlus, 
  RotateCw, 
  Info, 
  Settings, 
  ShieldCheck, 
  X,
  MessageSquare,
  QrCode,
  CheckCircle2
} from 'lucide-react';

interface WeChatCapsuleProps {
  title?: string;
  onOpenShare?: () => void;
  onReload?: () => void;
  onOpenAbout?: () => void;
}

export default function WeChatCapsule({
  title = '恒大文旅城邻里拼车',
  onOpenShare,
  onReload,
  onOpenAbout,
}: WeChatCapsuleProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showMiniToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleAddToFavorites = () => {
    setIsMenuOpen(false);
    showMiniToast('已添加到「我的小程序」');
  };

  const handleReload = () => {
    setIsMenuOpen(false);
    showMiniToast('正在重新加载小程序...');
    if (onReload) {
      setTimeout(onReload, 400);
    }
  };

  return (
    <>
      {/* Top Mini Program Header Bar */}
      <div className="relative flex items-center justify-between px-3.5 py-2.5 bg-white/95 border-b border-slate-200/80 backdrop-blur-md z-30 select-none">
        {/* Applet Title */}
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          <div className="h-5 w-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black shrink-0 shadow-2xs">
            恒
          </div>
          <span className="text-xs font-bold text-slate-900 truncate">
            {title}
          </span>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded px-1 shrink-0">
            0元公益
          </span>
        </div>

        {/* Authentic WeChat Mini Program Capsule Button */}
        <div 
          id="wechat-capsule-button"
          className="flex items-center rounded-full border border-slate-300/80 bg-white/90 px-2.5 py-1 shadow-2xs shrink-0"
        >
          {/* Menu Button (...) */}
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="小程序菜单"
            className="flex items-center justify-center p-0.5 text-slate-700 hover:text-slate-900 active:scale-90 transition"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {/* Capsule Divider */}
          <div className="h-3 w-px bg-slate-200 mx-2" />

          {/* Exit/Minimize Button (Circle Dot) */}
          <button
            onClick={() => showMiniToast('已将小程序切换至微信浮窗')}
            aria-label="最小化小程序"
            className="flex items-center justify-center p-0.5 text-slate-700 hover:text-slate-900 active:scale-90 transition"
          >
            <CircleDot className="h-4 w-4 text-slate-800" />
          </button>
        </div>
      </div>

      {/* Mini Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-slate-900/90 text-white text-xs px-4 py-2.5 shadow-xl flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-150">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* WeChat Native ActionSheet Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Backdrop click to dismiss */}
          <div 
            className="flex-1 w-full"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* ActionSheet Card */}
          <div className="w-full max-w-lg mx-auto bg-slate-100 rounded-t-3xl p-4 shadow-2xl border-t border-white/40 space-y-3 animate-in slide-in-from-bottom duration-250">
            {/* Header info */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 px-1">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  恒
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">恒大文旅城邻里拼车</h4>
                  <p className="text-[10px] text-slate-500">微信小程序 · 西安文旅城业主互助通勤</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="h-7 w-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Grid action buttons (Authentic WeChat Style) */}
            <div className="grid grid-cols-4 gap-2.5 py-1">
              {/* Share to friend / group */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onOpenShare) onOpenShare();
                }}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-white text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
              >
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-medium">转发业主群</span>
              </button>

              {/* Share poster */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onOpenShare) onOpenShare();
                }}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-white text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
              >
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                  <Share2 className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-medium">生成拼车海报</span>
              </button>

              {/* Add to favorites */}
              <button
                onClick={handleAddToFavorites}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-white text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
              >
                <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
                  <BookmarkPlus className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-medium">添加到小程序</span>
              </button>

              {/* Reload */}
              <button
                onClick={handleReload}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-white text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
              >
                <div className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs">
                  <RotateCw className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-medium">重新加载</span>
              </button>
            </div>

            {/* List action items */}
            <div className="rounded-2xl bg-white overflow-hidden divide-y divide-slate-100 text-xs text-slate-800">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onOpenAbout) onOpenAbout();
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 text-left"
              >
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-slate-500" />
                  <span>关于恒大文旅城邻里拼车 (v1.2.0)</span>
                </div>
                <span className="text-[10px] text-slate-400">0元公益互助</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  showMiniToast('已开启定位与微信服务通知权限');
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 text-left"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span>小程序设置与权限管理</span>
                </div>
                <span className="text-[10px] text-emerald-600">已授权</span>
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-white text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </>
  );
}
