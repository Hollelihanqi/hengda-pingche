'use client';

import React from 'react';
import { Signal, Wifi, Battery } from 'lucide-react';
import WeChatCapsule from '@/components/wechat/WeChatCapsule';
import WeChatTabBar, { WeChatTabType } from '@/components/wechat/WeChatTabBar';

interface WeChatAppContainerProps {
  children: React.ReactNode;
  activeTab: WeChatTabType;
  onChangeTab: (tab: WeChatTabType) => void;
  onOpenPublish: () => void;
  onOpenShare: () => void;
  onReload: () => void;
  onOpenAbout: () => void;
  bookingCount?: number;
  isVerified?: boolean;
}

export default function WeChatAppContainer({
  children,
  activeTab,
  onChangeTab,
  onOpenPublish,
  onOpenShare,
  onReload,
  onOpenAbout,
  bookingCount = 0,
  isVerified = true,
}: WeChatAppContainerProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center p-0 sm:p-4 selection:bg-emerald-500 selection:text-white">
      {/* Authentic WeChat Mobile App Viewport */}
      <div className="relative w-full max-w-md h-screen sm:h-[880px] sm:max-h-[96vh] sm:rounded-[44px] bg-[#F7F8FA] overflow-hidden flex flex-col shadow-2xl sm:border-[8px] sm:border-slate-800">
        
        {/* Mobile Status Bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold text-slate-900 select-none z-30 bg-white/95 backdrop-blur-md">
          <span className="font-mono text-[11px] font-bold">07:45</span>
          {/* Subtle speaker / camera sensor for authentic mobile feel */}
          <div className="h-4 w-20 rounded-full bg-black/90 hidden sm:flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-emerald-500 ml-auto mr-2 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-800">
            <Signal className="h-3 w-3" />
            <span className="text-[10px] font-bold">5G</span>
            <Wifi className="h-3 w-3" />
            <Battery className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* WeChat Mini Program Top Capsule Bar */}
        <WeChatCapsule
          title="恒大文旅城邻里拼车"
          onOpenShare={onOpenShare}
          onReload={onReload}
          onOpenAbout={onOpenAbout}
        />

        {/* Scrollable Mini-Program Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 bg-[#F7F8FA] scroll-smooth">
          {children}
        </div>

        {/* WeChat Mini-Program Bottom TabBar */}
        <WeChatTabBar
          activeTab={activeTab}
          onChangeTab={onChangeTab}
          onOpenPublish={onOpenPublish}
          bookingCount={bookingCount}
          isVerified={isVerified}
        />

        {/* Bottom Home Indicator */}
        <div className="w-full py-1.5 flex justify-center bg-white/95 border-t border-slate-100/50 backdrop-blur-md select-none">
          <div className="h-1 w-28 rounded-full bg-slate-300" />
        </div>
      </div>
    </div>
  );
}
