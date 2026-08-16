'use client';

import React from 'react';
import { 
  Car, 
  Map, 
  Plus, 
  ClipboardList, 
  User,
} from 'lucide-react';

export type WeChatTabType = 'hall' | 'map' | 'publish' | 'my_trips' | 'profile';

interface WeChatTabBarProps {
  activeTab: WeChatTabType;
  onChangeTab: (tab: WeChatTabType) => void;
  onOpenPublish: () => void;
  bookingCount?: number;
  myPostCount?: number;
  isVerified?: boolean;
}

export default function WeChatTabBar({
  activeTab,
  onChangeTab,
  onOpenPublish,
  bookingCount = 0,
  isVerified = true,
}: WeChatTabBarProps) {
  return (
    <div 
      id="wechat-bottom-tabbar"
      className="sticky bottom-0 left-0 right-0 w-full bg-white/95 border-t border-slate-200/80 backdrop-blur-lg z-30 select-none pb-safe"
    >
      <div className="flex items-center justify-around h-14 px-2 max-w-lg mx-auto">
        {/* Tab 1: 拼车大厅 */}
        <button
          onClick={() => onChangeTab('hall')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition active:scale-90 ${
            activeTab === 'hall' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Car className={`h-5 w-5 ${activeTab === 'hall' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
          </div>
          <span className={`text-[10px] mt-0.5 ${activeTab === 'hall' ? 'font-bold' : 'font-medium'}`}>
            拼车大厅
          </span>
        </button>

        {/* Tab 2: 路线地图 */}
        <button
          onClick={() => onChangeTab('map')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition active:scale-90 ${
            activeTab === 'map' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Map className={`h-5 w-5 ${activeTab === 'map' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
          </div>
          <span className={`text-[10px] mt-0.5 ${activeTab === 'map' ? 'font-bold' : 'font-medium'}`}>
            路线地图
          </span>
        </button>

        {/* Tab 3: Center Elevated Publish Button */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-4">
          <button
            onClick={onOpenPublish}
            aria-label="发布拼车"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 active:scale-95 transition"
          >
            <Plus className="h-6 w-6 stroke-[2.8px]" />
          </button>
          <span className="text-[10px] font-bold text-slate-800 mt-0.5">
            发布信息
          </span>
        </div>

        {/* Tab 4: 我的发布 */}
        <button
          onClick={() => onChangeTab('my_trips')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition active:scale-90 ${
            activeTab === 'my_trips' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <ClipboardList className={`h-5 w-5 ${activeTab === 'my_trips' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
          </div>
          <span className={`text-[10px] mt-0.5 ${activeTab === 'my_trips' ? 'font-bold' : 'font-medium'}`}>
            我的发布
          </span>
        </button>

        {/* Tab 5: 个人中心 */}
        <button
          onClick={() => onChangeTab('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition active:scale-90 ${
            activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <User className={`h-5 w-5 ${activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            {isVerified && (
              <div className="absolute -bottom-0.5 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>
          <span className={`text-[10px] mt-0.5 ${activeTab === 'profile' ? 'font-bold' : 'font-medium'}`}>
            个人中心
          </span>
        </button>
      </div>
    </div>
  );
}
