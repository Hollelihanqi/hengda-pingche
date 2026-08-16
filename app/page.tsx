'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Car,
  Users,
  Search,
  Plus,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  HeartHandshake,
  Calendar,
  Filter,
  Navigation,
  FileText,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Info,
  Share2,
  X
} from 'lucide-react';
import WeChatAppContainer from '@/components/wechat/WeChatAppContainer';
import WeChatProfileView from '@/components/wechat/WeChatProfileView';
import WeChatShareModal from '@/components/wechat/WeChatShareModal';
import type { WeChatTabType } from '@/components/wechat/WeChatTabBar';
import MapView from '@/components/MapView';
import TripCard from '@/components/TripCard';
import TripDetailModal from '@/components/TripDetailModal';
import AiAssistantDrawer from '@/components/AiAssistantDrawer';
import NeighborVerifyModal from '@/components/NeighborVerifyModal';
import SafetyCharterModal from '@/components/SafetyCharterModal';
import MyTripsView from '@/components/MyTripsView';
import { useCarpoolStore } from '@/lib/storage';
import { CarpoolTrip } from '@/types/carpool';
import { COMMUNITY_COMMUTE_TIPS } from '@/lib/mockData';

export default function CarpoolHomePage() {
  const router = useRouter();
  const {
    trips,
    currentUser,
    addTrip,
    cancelTrip,
    updateUser,
    resetToSampleData,
  } = useCarpoolStore();

  // Navigation tab for WeChat Mini Program
  const [activeTab, setActiveTab] = useState<WeChatTabType>('hall');

  // Filters
  const [filterType, setFilterType] = useState<'all' | 'driver_offer' | 'passenger_request'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modal States
  const [selectedTripForDetail, setSelectedTripForDetail] = useState<CarpoolTrip | null>(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isCharterModalOpen, setIsCharterModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Filtered trips logic
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (trip.status === 'cancelled') return false;

      // Filter by role type (车找人 vs 人找车)
      if (filterType !== 'all' && trip.type !== filterType) return false;

      // Filter by search keyword
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const match =
          trip.origin.name.toLowerCase().includes(kw) ||
          trip.destination.name.toLowerCase().includes(kw) ||
          trip.publisher.name.toLowerCase().includes(kw) ||
          trip.routeHighway.toLowerCase().includes(kw) ||
          trip.publisher.communityPhase.toLowerCase().includes(kw);
        if (!match) return false;
      }

      return true;
    });
  }, [trips, filterType, searchKeyword]);

  const myPublishedCount = useMemo(() => {
    return trips.filter((t) => t.publisher.id === currentUser.id).length;
  }, [trips, currentUser]);

  return (
    <WeChatAppContainer
      activeTab={activeTab}
      onChangeTab={(tab) => setActiveTab(tab)}
      onOpenPublish={() => router.push('/publish')}
      onOpenShare={() => setIsShareModalOpen(true)}
      onReload={() => resetToSampleData()}
      onOpenAbout={() => setIsAboutModalOpen(true)}
      bookingCount={myPublishedCount}
      isVerified={currentUser.isVerifiedOwner}
    >
      <div className="space-y-3.5">
        {/* TAB 1: 拼车大厅 (FEED VIEW) */}
        {activeTab === 'hall' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Search & Filter Bar */}
            <div className="rounded-2xl bg-white p-3 border border-slate-200/80 shadow-xs space-y-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索目的地（如：软件新城、绿地双子塔、华为...）"
                  className="w-full rounded-xl bg-slate-100/80 py-2 pl-9 pr-8 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
                {searchKeyword && (
                  <button
                    onClick={() => setSearchKeyword('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Segmented Type Switcher: 全部 / 🚗 车找人 / 🙋 人找车 */}
              <div className="flex bg-slate-100/90 p-1 rounded-xl gap-1">
                {[
                  { id: 'all', label: '全部' },
                  { id: 'driver_offer', label: '🚗 车找人' },
                  { id: 'passenger_request', label: '🙋 人找车' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilterType(item.id as any)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                      filterType === item.id
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed Header */}
            <div className="flex items-center justify-between px-1">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>实时拼车列表</span>
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800 font-bold">
                  {filteredTrips.length}条有效
                </span>
              </div>
              <button
                onClick={resetToSampleData}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600"
              >
                <RotateCcw className="h-3 w-3" />
                重置示范
              </button>
            </div>

            {/* Trip Cards Feed */}
            {filteredTrips.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">未找到匹配的拼车行程</h4>
                <p className="text-[11px] text-slate-400">
                  您可以尝试更换搜索词，或自己发布一条信息让邻居看到！
                </p>
                <button
                  onClick={() => router.push('/publish')}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  立即发布发车/求车
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    isSelected={selectedTripForDetail?.id === trip.id}
                    onViewDetail={(t) => setSelectedTripForDetail(t)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: 路线地图 (MAP ROUTE) */}
        {activeTab === 'map' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
              <MapView
                selectedTrip={selectedTripForDetail || filteredTrips[0] || trips[0]}
                allTrips={trips}
                onSelectTrip={(trip) => setSelectedTripForDetail(trip)}
              />
            </div>

            {/* Commute Corridor Tips Card */}
            <div className="rounded-3xl bg-white p-4 border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-emerald-600" />
                  恒大文旅城 进城快速通道走廊
                </span>
                <span className="text-[10px] text-slate-400">避堵指南</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="rounded-2xl bg-emerald-50/70 p-3 border border-emerald-100 space-y-1">
                  <div className="font-bold text-emerald-900">① 正阳大道 ➔ 绕城高速 (高新通道)</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    文旅城直通北三环的主干道，双向8车道无红绿灯，经正阳立交上G3002绕城高速直达锦业路/软件新城。
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50/70 p-3 border border-amber-100 space-y-1">
                  <div className="font-bold text-amber-900">② 西铜快速路 ➔ 地铁2号线 (运动公园)</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    经开区接驳主通道，35分钟可达运动公园/北客站地铁站，适合地铁换乘一族。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 我的发布 (MY PUBLISHED POSTS) */}
        {activeTab === 'my_trips' && (
          <div className="animate-in fade-in duration-200">
            <MyTripsView
              trips={trips}
              currentUser={currentUser}
              onCancelTrip={(tripId) => cancelTrip(tripId)}
              onSelectTrip={(t) => setSelectedTripForDetail(t)}
              onOpenPublish={() => router.push('/publish')}
            />
          </div>
        )}

        {/* TAB 4: 业主中心 (WECHAT PROFILE & SETTINGS) */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-200">
            <WeChatProfileView
              currentUser={currentUser}
              trips={trips}
              onOpenVerify={() => setIsVerifyModalOpen(true)}
              onOpenCharter={() => setIsCharterModalOpen(true)}
              onOpenAi={() => setIsAiDrawerOpen(true)}
              onOpenShare={() => setIsShareModalOpen(true)}
              onSelectTab={(tab) => setActiveTab(tab)}
              onResetData={resetToSampleData}
            />
          </div>
        )}

        {/* MODALS */}
        {/* Trip Detail Modal */}
        <TripDetailModal
          trip={selectedTripForDetail}
          currentUser={currentUser}
          isOpen={!!selectedTripForDetail}
          onClose={() => setSelectedTripForDetail(null)}
          onCancelTrip={(tripId) => cancelTrip(tripId)}
        />

        {/* AI Commute Assistant Drawer */}
        <AiAssistantDrawer
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
          trips={trips}
          onApplyRecommendation={({ keyword }) => {
            if (keyword) setSearchKeyword(keyword);
            setActiveTab('hall');
          }}
        />

        {/* Neighbor Verification Modal */}
        <NeighborVerifyModal
          currentUser={currentUser}
          isOpen={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          onUpdateUser={(updated) => updateUser(updated)}
        />

        {/* Safety & Non-profit Charter Modal */}
        <SafetyCharterModal
          isOpen={isCharterModalOpen}
          onClose={() => setIsCharterModalOpen(false)}
        />

        {/* WeChat Share Card Modal */}
        <WeChatShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          trips={trips}
          currentUser={currentUser}
        />

        {/* WeChat About Modal */}
        {isAboutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-200">
              <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md font-black text-xl">
                恒
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">恒大文旅城邻里拼车</h3>
                <p className="text-xs text-slate-500 mt-1">
                  西安恒大文化旅游城业主专属通勤互助信息平台
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 text-left text-xs text-slate-600 space-y-1.5 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">服务区域</span>
                  <span className="font-bold text-slate-800">西安恒大文化旅游城 (1~5期)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">定位</span>
                  <span className="font-bold text-emerald-700">纯公益 · 邻里信息板</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">联系方式</span>
                  <span className="font-bold text-slate-800">一键直接电话呼叫</span>
                </div>
              </div>

              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
              >
                我知道了
              </button>
            </div>
          </div>
        )}
      </div>
    </WeChatAppContainer>
  );
}
