'use client';

import React, { useState, useMemo } from 'react';
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
import { WeChatTabType } from '@/components/wechat/WeChatTabBar';
import DynamicIslandAlert from '@/components/DynamicIslandAlert';
import MapView from '@/components/MapView';
import TripCard from '@/components/TripCard';
import BookingModal from '@/components/BookingModal';
import PublishModal from '@/components/PublishModal';
import TripDetailModal from '@/components/TripDetailModal';
import AiAssistantDrawer from '@/components/AiAssistantDrawer';
import NeighborVerifyModal from '@/components/NeighborVerifyModal';
import SafetyCharterModal from '@/components/SafetyCharterModal';
import MyTripsView from '@/components/MyTripsView';
import { useCarpoolStore } from '@/lib/storage';
import { CarpoolTrip } from '@/types/carpool';
import { COMMUNITY_COMMUTE_TIPS } from '@/lib/mockData';

export default function CarpoolHomePage() {
  const {
    trips,
    currentUser,
    addTrip,
    cancelTrip,
    bookSeat,
    cancelBooking,
    updateUser,
    resetToSampleData,
  } = useCarpoolStore();

  // Navigation tab for WeChat Mini Program
  const [activeTab, setActiveTab] = useState<WeChatTabType>('hall');

  // Filters
  const [filterType, setFilterType] = useState<'all' | 'driver_offer' | 'passenger_request'>('all');
  const [filterDirection, setFilterDirection] = useState<'all' | 'into_city' | 'out_city' | 'metro_transfer'>('all');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTimeSlot, setFilterTimeSlot] = useState<'all' | 'morning_peak' | 'evening_peak'>('all');

  // Modal States
  const [selectedTripForDetail, setSelectedTripForDetail] = useState<CarpoolTrip | null>(null);
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<CarpoolTrip | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
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

      // Filter by direction
      if (filterDirection !== 'all' && trip.direction !== filterDirection) return false;

      // Filter by destination zone
      if (filterZone !== 'all') {
        const destZoneMatch =
          trip.destination.zone.includes(filterZone) ||
          trip.destination.name.includes(filterZone) ||
          trip.origin.name.includes(filterZone);
        if (!destZoneMatch) return false;
      }

      // Filter by time slot
      if (filterTimeSlot === 'morning_peak') {
        const hour = parseInt(trip.departureTime.split(':')[0], 10);
        if (hour < 6 || hour > 9) return false;
      } else if (filterTimeSlot === 'evening_peak') {
        const hour = parseInt(trip.departureTime.split(':')[0], 10);
        if (hour < 17 || hour > 21) return false;
      }

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
  }, [trips, filterType, filterDirection, filterZone, filterTimeSlot, searchKeyword]);

  // Active upcoming trip for Dynamic Island
  const activeUpcomingTrip = useMemo(() => {
    const booked = trips.find((t) => t.bookings.some((b) => b.passengerId === currentUser.id));
    return booked || trips[0];
  }, [trips, currentUser]);

  // Active booking count for badge
  const activeBookingCount = useMemo(() => {
    return trips.filter((t) => t.bookings.some((b) => b.passengerId === currentUser.id)).length;
  }, [trips, currentUser]);

  return (
    <WeChatAppContainer
      activeTab={activeTab}
      onChangeTab={(tab) => setActiveTab(tab)}
      onOpenPublish={() => setIsPublishModalOpen(true)}
      onOpenShare={() => setIsShareModalOpen(true)}
      onReload={() => resetToSampleData()}
      onOpenAbout={() => setIsAboutModalOpen(true)}
      bookingCount={activeBookingCount}
      isVerified={currentUser.isVerifiedOwner}
    >
      <div className="space-y-3.5">
        {/* Apple Dynamic Island / Top Quick Action */}
        <DynamicIslandAlert
          activeTrip={activeUpcomingTrip}
          onOpenTrip={(t) => setSelectedTripForDetail(t)}
        />

        {/* TAB 1: 拼车大厅 (HALL / FEED) */}
        {activeTab === 'hall' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* WeChat Banner Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 p-4 text-white shadow-md">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md">
                    🏰 恒大文旅城业主专线
                  </span>
                  <span className="rounded-full bg-emerald-400/30 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                    0元公益互助
                  </span>
                </div>
                <h2 className="text-lg font-black tracking-tight pt-1">
                  早高峰快速进城 · 邻里拼车
                </h2>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                  专为文旅城1~4期业主打造，解决未通地铁通勤难，邻里互助走正阳大道与绕城高速。
                </p>
              </div>

              {/* Quick Action Matrix in Banner */}
              <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/15 text-xs">
                <button
                  onClick={() => setIsPublishModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-white py-2 font-bold text-slate-900 shadow-sm active:scale-95 transition"
                >
                  <Plus className="h-4 w-4 text-emerald-600 stroke-[2.5px]" />
                  发车 / 求拼
                </button>
                <button
                  onClick={() => setIsAiDrawerOpen(true)}
                  className="flex items-center gap-1 rounded-2xl border border-white/30 bg-white/15 px-3 py-2 font-bold text-white backdrop-blur-md active:scale-95 transition"
                >
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                  AI 匹配
                </button>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-1 rounded-2xl border border-white/30 bg-white/15 px-3 py-2 font-bold text-white backdrop-blur-md active:scale-95 transition"
                >
                  <Share2 className="h-4 w-4 text-white" />
                  发群
                </button>
              </div>
            </div>

            {/* WeChat Search & Filter Capsule */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-2.5">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索目的地（如：软件新城 / 运动公园 / 绿地）"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
                {searchKeyword && (
                  <button
                    onClick={() => setSearchKeyword('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-600"
                  >
                    清空
                  </button>
                )}
              </div>

              {/* Filter Tabs: All vs Driver vs Passenger */}
              <div className="flex gap-1.5">
                {[
                  { id: 'all', label: '全部' },
                  { id: 'driver_offer', label: '🚗 车找人' },
                  { id: 'passenger_request', label: '🙋 人找车' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilterType(item.id as any)}
                    className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition ${
                      filterType === item.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Zone Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {[
                  { id: 'all', label: '全部路线' },
                  { id: '高新区', label: '🏢 高新/软件新城' },
                  { id: '地铁接驳', label: '🚇 地铁2号线运动公园' },
                  { id: '经开区', label: '🏛️ 经开行政中心' },
                  { id: '钟楼小寨', label: '🔔 钟楼小寨' },
                ].map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => setFilterZone(zone.id)}
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                      filterZone === zone.id
                        ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {zone.label}
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-400 font-semibold">时段：</span>
                <button
                  onClick={() => setFilterTimeSlot('all')}
                  className={`rounded-lg px-2 py-0.5 transition ${
                    filterTimeSlot === 'all'
                      ? 'bg-slate-200 font-bold text-slate-900'
                      : 'text-slate-500'
                  }`}
                >
                  全天
                </button>
                <button
                  onClick={() => setFilterTimeSlot('morning_peak')}
                  className={`rounded-lg px-2 py-0.5 transition ${
                    filterTimeSlot === 'morning_peak'
                      ? 'bg-emerald-100 font-bold text-emerald-900'
                      : 'text-slate-500'
                  }`}
                >
                  🌅 早高峰 (06:30-09:00)
                </button>
                <button
                  onClick={() => setFilterTimeSlot('evening_peak')}
                  className={`rounded-lg px-2 py-0.5 transition ${
                    filterTimeSlot === 'evening_peak'
                      ? 'bg-indigo-100 font-bold text-indigo-900'
                      : 'text-slate-500'
                  }`}
                >
                  🌃 晚高峰
                </button>
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
                  您可以尝试更换搜索词，或自己发布一条行程让邻居看到！
                </p>
                <button
                  onClick={() => setIsPublishModalOpen(true)}
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
                    onBook={(t) => setSelectedTripForBooking(t)}
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
                className="h-[380px] sm:h-[480px] w-full"
              />
            </div>

            {/* Commute Guide Cards */}
            <div className="rounded-3xl bg-white p-4 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
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

        {/* TAB 3: 我的行程 (MY TRIPS / BOOKINGS) */}
        {activeTab === 'my_trips' && (
          <div className="animate-in fade-in duration-200">
            <MyTripsView
              trips={trips}
              currentUser={currentUser}
              onCancelBooking={(tripId, bookingId) => cancelBooking(tripId, bookingId)}
              onCancelTrip={(tripId) => cancelTrip(tripId)}
              onSelectTrip={(t) => setSelectedTripForDetail(t)}
              onOpenPublish={() => setIsPublishModalOpen(true)}
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
        {/* Booking Sheet Modal */}
        <BookingModal
          trip={selectedTripForBooking}
          currentUser={currentUser}
          isOpen={!!selectedTripForBooking}
          onClose={() => setSelectedTripForBooking(null)}
          onConfirmBooking={(tripId, bookingData) => {
            return bookSeat(tripId, bookingData);
          }}
        />

        {/* Publish Trip Modal */}
        <PublishModal
          currentUser={currentUser}
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          onPublish={(newTrip) => {
            addTrip(newTrip);
          }}
        />

        {/* Trip Detail Modal */}
        <TripDetailModal
          trip={selectedTripForDetail}
          currentUser={currentUser}
          isOpen={!!selectedTripForDetail}
          onClose={() => setSelectedTripForDetail(null)}
          onBook={(t) => setSelectedTripForBooking(t)}
          onCancelTrip={(tripId) => cancelTrip(tripId)}
        />

        {/* AI Commute Assistant Drawer */}
        <AiAssistantDrawer
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
          trips={trips}
          onApplyRecommendation={({ keyword, timeSlot }) => {
            if (keyword) setSearchKeyword(keyword);
            if (timeSlot) setFilterTimeSlot(timeSlot as any);
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
                  西安恒大文化旅游城业主专属通勤互助小程序
                </p>
                <div className="inline-block mt-2 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  v1.2.0 · 0元公益非营运
                </div>
              </div>

              <div className="text-left bg-slate-50 rounded-2xl p-3.5 text-xs text-slate-600 space-y-1.5 border border-slate-100">
                <div className="font-bold text-slate-800">📌 小程序发起宗旨：</div>
                <p className="text-[11px] leading-relaxed">
                  本小程序由文旅城业主自发共建，致力于解决社区距离市区远、地铁未接驳的通勤痛点。通过邻里合乘分担出行，全程0元互助，严禁任何形式非法营运。
                </p>
              </div>

              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 active:scale-95 transition"
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
