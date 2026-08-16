'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Car,
  Users,
  ArrowUpDown,
  CheckCircle2,
  ChevronLeft,
  Signal,
  Wifi,
  Battery,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import WeChatCapsule from '@/components/wechat/WeChatCapsule';
import WeChatTimePicker from '@/components/WeChatTimePicker';
import { useCarpoolStore } from '@/lib/storage';
import { CarpoolTrip, TripType, TripDirection } from '@/types/carpool';

export default function PublishPage() {
  const router = useRouter();
  const { currentUser, addTrip, updateUser } = useCarpoolStore();

  const [tripType, setTripType] = useState<TripType>('driver_offer');
  const [direction, setDirection] = useState<TripDirection>('into_city');

  // Origin & Destination
  const [originName, setOriginName] = useState('恒大文旅城');
  const [destName, setDestName] = useState('高新·软件新城');

  // Date & Time
  const [departureDate, setDepartureDate] = useState('2026-08-16');
  const [departureTime, setDepartureTime] = useState('07:30');

  // Contact Info
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '18729391167');

  // Driver Seats only
  const [seats, setSeats] = useState(3);

  // UI publishing state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDirectionChange = (newDir: TripDirection) => {
    setDirection(newDir);
    if (newDir === 'into_city') {
      setOriginName('恒大文旅城');
      setDestName('高新·软件新城');
      setDepartureTime('07:30');
    } else if (newDir === 'out_city') {
      setOriginName('高新·软件新城');
      setDestName('恒大文旅城');
      setDepartureTime('18:30');
    } else {
      setOriginName('恒大文旅城');
      setDestName('地铁2号线·运动公园站');
      setDepartureTime('07:15');
    }
  };

  const handleSwapRoute = () => {
    const temp = originName;
    setOriginName(destName);
    setDestName(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!originName.trim() || !destName.trim()) {
      alert('请填写完整的出发地与目的地');
      return;
    }

    if (!contactPhone.trim()) {
      alert('请填写您的联系电话，方便邻里在发车前与您联系！');
      return;
    }

    setIsSubmitting(true);

    const cleanUserName = currentUser.name.replace(/[\(（].*?[\)）]/g, '').trim();

    const newTrip: CarpoolTrip = {
      id: `trip_pub_${Date.now()}`,
      type: tripType,
      direction: direction,
      publisher: {
        id: currentUser.id,
        name: cleanUserName,
        avatar: currentUser.avatar,
        gender: currentUser.gender,
        phone: contactPhone.trim(),
        isVerifiedOwner: true,
        communityPhase: '恒大文旅城',
        roomNumber: '',
        creditScore: 100,
        completedTripsCount: (currentUser.completedTripsCount || 0) + 1,
        identityTag: '文旅城邻里',
      },
      origin: {
        name: originName.trim(),
        detail: '集合点',
        zone: originName.includes('文旅城') ? '恒大文旅城' : '西安市区',
      },
      destination: {
        name: destName.trim(),
        detail: '落客区',
        zone: destName.includes('文旅城') ? '恒大文旅城' : '西安市区',
      },
      waypoints: [],
      departureDate,
      departureTime,
      isRecurring: true,
      recurringDays: ['周一', '周二', '周三', '周四', '周五'],
      totalSeats: tripType === 'driver_offer' ? seats : 1,
      availableSeats: tripType === 'driver_offer' ? seats : 1,
      price: 0,
      carInfo:
        tripType === 'driver_offer'
          ? {
              brandModel: '私家车',
              plateMasked: '私家车',
              color: '白色',
              energyType: 'ev',
            }
          : undefined,
      preferences: ['准时发车', '禁烟'],
      routeHighway: '正阳大道 ➔ 快速干线',
      estimatedMinutes: direction === 'metro_transfer' ? 35 : 55,
      estimatedDistanceKm: direction === 'metro_transfer' ? 28.5 : 46.8,
      remark: tripType === 'driver_offer' ? '顺路发车，邻里互助，准时出发！' : '求顺路车主，非常准时！',
      status: 'active',
      createdAt: '刚刚',
      bookings: [],
    };

    setTimeout(() => {
      addTrip(newTrip);
      router.push('/');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center p-0 sm:p-4 selection:bg-emerald-500 selection:text-white">
      {/* Authentic WeChat Mobile App Viewport */}
      <div className="relative w-full max-w-md h-screen sm:h-[880px] sm:max-h-[96vh] sm:rounded-[44px] bg-[#F7F8FA] overflow-hidden flex flex-col shadow-2xl sm:border-[8px] sm:border-slate-800">
        
        {/* Mobile Status Bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold text-slate-900 select-none z-30 bg-white/95 backdrop-blur-md">
          <span className="font-mono text-[11px] font-bold">07:45</span>
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

        {/* Sub-page Navigation Header Bar with Back Button + Title + WeChat Capsule */}
        <div className="relative flex items-center justify-between px-3 py-2.5 bg-white/95 border-b border-slate-200/80 backdrop-blur-md z-30 select-none">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-0.5 text-xs font-bold text-slate-800 hover:text-emerald-700 active:scale-95 transition py-1 pr-2"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5px] text-slate-700" />
            <span>返回</span>
          </button>

          {/* Center Page Title */}
          <div className="text-xs font-black text-slate-900">
            发布拼车信息
          </div>

          {/* Mini Capsule Placeholder */}
          <div className="w-16 flex justify-end">
            <div className="h-6 w-12 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center gap-1 opacity-70">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            </div>
          </div>
        </div>

        {/* Scrollable Form Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3.5 bg-[#F7F8FA]">
          <form id="publish-trip-form" onSubmit={handleSubmit} className="space-y-3.5 pb-2">
            {/* 1. Role Switcher */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-2.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                选择拼车身份
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTripType('driver_offer')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 transition-all active:scale-98 ${
                    tripType === 'driver_offer'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-2xs font-bold'
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200 text-xs'
                  }`}
                >
                  <div className={`p-1.5 rounded-full ${tripType === 'driver_offer' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <Car className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight">我是车主</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">有车顺路找人</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTripType('passenger_request')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 transition-all active:scale-98 ${
                    tripType === 'passenger_request'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-2xs font-bold'
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200 text-xs'
                  }`}
                >
                  <div className={`p-1.5 rounded-full ${tripType === 'passenger_request' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight">我是乘客</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">求顺路车拼</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Commute Direction Switcher */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-2.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                通勤方向
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'into_city', label: '☀️ 早峰进城', desc: '文旅城 ➔ 市区' },
                  { key: 'out_city', label: '🌙 晚峰返程', desc: '市区 ➔ 文旅城' },
                  { key: 'metro_transfer', label: '🚇 地铁接驳', desc: '文旅城 ➔ 2号线' },
                ].map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => handleDirectionChange(d.key as TripDirection)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all active:scale-95 ${
                      direction === d.key
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-2xs'
                        : 'border-slate-100 bg-slate-50/70 text-slate-600 hover:border-slate-200 text-xs'
                    }`}
                  >
                    <div className="text-xs font-bold">{d.label}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Origin & Destination Route Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  出发地与目的地
                </label>
                <button
                  type="button"
                  onClick={handleSwapRoute}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:scale-95 px-2.5 py-1 rounded-lg border border-emerald-200/80 transition"
                  title="互换起终点"
                >
                  <ArrowUpDown className="h-3 w-3" />
                  <span>互换起止</span>
                </button>
              </div>

              <div className="relative rounded-xl bg-slate-50 border border-slate-200/70 p-3 space-y-3">
                {/* Origin Input */}
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={originName}
                      onChange={(e) => setOriginName(e.target.value)}
                      placeholder="出发地（如：恒大文旅城）"
                      required
                      className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none transition shadow-2xs"
                    />
                  </div>
                </div>

                {/* Connecting line */}
                <div className="ml-1 border-l-2 border-dashed border-slate-300 h-2" />

                {/* Destination Input */}
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 ring-4 ring-red-100" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={destName}
                      onChange={(e) => setDestName(e.target.value)}
                      placeholder="目的地（如：高新软件新城）"
                      required
                      className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none transition shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Departure Time & Seats Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                出发时间
              </label>

              {/* Date Quick Choice */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDepartureDate('2026-08-15')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition ${
                    departureDate === '2026-08-15'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/70 text-slate-600'
                  }`}
                >
                  今天 (8月15日)
                </button>
                <button
                  type="button"
                  onClick={() => setDepartureDate('2026-08-16')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition ${
                    departureDate === '2026-08-16'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/70 text-slate-600'
                  }`}
                >
                  明天 (8月16日)
                </button>
              </div>

              {/* Departure Time Picker (no redundant text label) */}
              <WeChatTimePicker
                value={departureTime}
                onChange={(newTime) => setDepartureTime(newTime)}
              />

              {/* Driver Seats Only (Hidden for Passenger, NO Passenger Seat Selection) */}
              {tripType === 'driver_offer' && (
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">提供空位</span>
                    <span className="text-[10px] text-slate-400">车上富余的座位数</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSeats(num)}
                        className={`h-8 w-12 rounded-xl border text-xs font-bold transition active:scale-95 ${
                          seats === num
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {num}座
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Contact Information Card (联系方式填写) */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  联系方式（电话沟通）
                </label>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  <ShieldCheck className="h-3 w-3" />
                  <span>隐私保护</span>
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                  <span>手机号码 <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-slate-400">用于发车前邻里电话联系</span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4 text-emerald-600" />
                  </div>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="请输入11位手机号码"
                    required
                    maxLength={11}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition shadow-2xs"
                  />
                </div>
              </div>

              {/* Neighborhood Privacy Note */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-2 text-[10px] text-slate-500 leading-relaxed flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>发布的手机号仅用于邻里顺路沟通联系，方便一键呼叫与预约。</span>
              </div>
            </div>
          </form>
        </div>

        {/* FIXED BOTTOM CTA BAR (发布按钮 固定底部显示) */}
        <div className="sticky bottom-0 left-0 right-0 w-full bg-white/95 border-t border-slate-200/80 backdrop-blur-lg p-3.5 z-30 select-none pb-safe">
          <button
            type="submit"
            form="publish-trip-form"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-98 transition flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <CheckCircle2 className="h-4 w-4 animate-bounce" />
                <span>发布成功，正在同步...</span>
              </>
            ) : (
              <span>确认发布拼车信息</span>
            )}
          </button>
        </div>

        {/* Bottom Home Indicator */}
        <div className="w-full py-1.5 flex justify-center bg-white/95 border-t border-slate-100/50 backdrop-blur-md select-none">
          <div className="h-1 w-28 rounded-full bg-slate-300" />
        </div>
      </div>
    </div>
  );
}
