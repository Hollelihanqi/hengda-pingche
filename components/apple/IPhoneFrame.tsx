'use client';

import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal, MoreHorizontal, CircleDot } from 'lucide-react';

interface IPhoneFrameProps {
  children: React.ReactNode;
  activeTripSnippet?: React.ReactNode;
}

export default function IPhoneFrame({ children, activeTripSnippet }: IPhoneFrameProps) {
  const [isMobileMode, setIsMobileMode] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center">
      {/* Top Floating Device Switcher Pill */}
      <header className="w-full max-w-7xl px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
            <span className="text-sm font-black">恒</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-slate-900">恒大文旅城邻里拼车</h1>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                0元公益互助
              </span>
            </div>
            <p className="text-[11px] text-slate-500">西安恒大文化旅游城业主日常通勤专属撮合</p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-xs backdrop-blur-md">
          <button
            onClick={() => setIsMobileMode(false)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              !isMobileMode
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>宽屏视图</span>
          </button>
          <button
            onClick={() => setIsMobileMode(true)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              isMobileMode
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>微信小程序预览</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex justify-center pb-8 px-2 sm:px-4">
        {isMobileMode ? (
          /* iPhone 16 Pro WeChat Mini-Program Shell */
          <div className="relative w-full max-w-[420px] rounded-[48px] border-[10px] border-slate-900 bg-slate-950 p-2 shadow-2xl ring-1 ring-slate-800/20 my-2">
            {/* Inner Phone Screen */}
            <div className="relative h-[840px] w-full overflow-hidden rounded-[38px] bg-slate-50 flex flex-col">
              {/* iOS Status Bar */}
              <div className="flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold text-slate-900 select-none z-20">
                <span>08:15</span>
                {/* Dynamic Island Pill */}
                <div className="h-5 w-24 rounded-full bg-black flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 ml-auto mr-2" />
                </div>
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Signal className="h-3.5 w-3.5" />
                  <Wifi className="h-3.5 w-3.5" />
                  <Battery className="h-4 w-4" />
                </div>
              </div>

              {/* WeChat Mini Program Top Capsule Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-white/80 border-b border-slate-100 backdrop-blur-md z-20">
                <span className="text-xs font-bold text-slate-900 truncate">恒大文旅城拼车</span>
                {/* Mini Program Capsule Button */}
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 shadow-2xs">
                  <MoreHorizontal className="h-3.5 w-3.5 text-slate-700" />
                  <div className="h-3 w-px bg-slate-200" />
                  <CircleDot className="h-3.5 w-3.5 text-slate-700" />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-3">{children}</div>

              {/* iOS Bottom Home Indicator Bar */}
              <div className="w-full py-2 flex justify-center bg-white/80 border-t border-slate-100 backdrop-blur-md">
                <div className="h-1 w-32 rounded-full bg-slate-400" />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop / Wide App Shell */
          <div className="w-full max-w-6xl">{children}</div>
        )}
      </main>
    </div>
  );
}
