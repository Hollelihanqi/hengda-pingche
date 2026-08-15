'use client';

import React, { useState } from 'react';
import {
  X,
  Car,
  Users,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
  Route,
  Check,
} from 'lucide-react';
import { CarpoolTrip, UserProfile, TripType, TripDirection } from '@/types/carpool';
import { EVERGRANDE_ORIGIN_SPOTS, XIAN_CITY_DESTINATIONS } from '@/lib/mockData';

interface PublishModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onPublish: (trip: CarpoolTrip) => void;
}

export default function PublishModal({
  currentUser,
  isOpen,
  onClose,
  onPublish,
}: PublishModalProps) {
  const [tripType, setTripType] = useState<TripType>('driver_offer');
  const [direction, setDirection] = useState<TripDirection>('into_city');

  // Origin & Destination
  const [originName, setOriginName] = useState(EVERGRANDE_ORIGIN_SPOTS[0].name);
  const [originDetail, setOriginDetail] = useState('东门保安岗亭处集合');
  const [destName, setDestName] = useState(XIAN_CITY_DESTINATIONS[0].name);
  const [destDetail, setDestDetail] = useState('天谷八路环普科技园落客');

  // Date & Time
  const [departureDate, setDepartureDate] = useState('2026-08-16');
  const [departureTime, setDepartureTime] = useState('07:30');
  const [isRecurring, setIsRecurring] = useState(true);

  // Capacity & Car
  const [seats, setSeats] = useState(3);
  const [brandModel, setBrandModel] = useState('比亚迪 汉EV 尊贵版');
  const [plateMasked, setPlateMasked] = useState('陕A·D***8');
  const [carColor, setCarColor] = useState('曜石黑');

  // Route & Tags
  const [highwayRoute, setHighwayRoute] = useState('正阳大道 ➔ 绕城高速 ➔ 丈八立交');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    '准时发车',
    '禁烟',
    '走绕城高速',
    '后排宽松',
  ]);
  const [remark, setRemark] = useState(
    '工作日固定发车，走正阳大道与绕城高速ETC，欢迎同在高新上班的文旅城邻居同行！'
  );

  if (!isOpen) return null;

  const togglePref = (tag: string) => {
    if (selectedPreferences.includes(tag)) {
      setSelectedPreferences(selectedPreferences.filter((t) => t !== tag));
    } else {
      setSelectedPreferences([...selectedPreferences, tag]);
    }
  };

  const handleQuickDirection = (dir: TripDirection) => {
    setDirection(dir);
    if (dir === 'into_city') {
      setOriginName(EVERGRANDE_ORIGIN_SPOTS[0].name);
      setDestName(XIAN_CITY_DESTINATIONS[0].name);
      setHighwayRoute('正阳大道 ➔ 绕城高速 ➔ 丈八立交');
    } else if (dir === 'out_city') {
      setOriginName(XIAN_CITY_DESTINATIONS[0].name);
      setDestName(EVERGRANDE_ORIGIN_SPOTS[1].name);
      setHighwayRoute('高新软件新城 ➔ 绕城高速 ➔ 正阳大道 ➔ 文旅城');
    } else if (dir === 'metro_transfer') {
      setOriginName(EVERGRANDE_ORIGIN_SPOTS[1].name);
      setDestName('地铁2号线·运动公园站 (D口)');
      setHighwayRoute('西铜快速干线 ➔ 未央立交 ➔ 运动公园站');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTrip: CarpoolTrip = {
      id: 'trip_' + Date.now(),
      type: tripType,
      direction,
      publisher: currentUser,
      origin: {
        name: originName,
        detail: originDetail,
        zone: originName.includes('恒大') ? '恒大文旅城' : '市区/园区',
      },
      destination: {
        name: destName,
        detail: destDetail,
        zone: destName.includes('恒大') ? '恒大文旅城' : destName.includes('高新') ? '高新区' : '市区/地铁',
      },
      waypoints: [
        { id: 'wp_1', name: originName.split('·')[1] || originName, estimatedTime: departureTime, isPickupAllowed: true },
        { id: 'wp_2', name: '正阳快速路/高速口', isPickupAllowed: false },
        { id: 'wp_3', name: destName.split('·')[1] || destName, isPickupAllowed: true },
      ],
      departureDate,
      departureTime,
      isRecurring,
      recurringDays: isRecurring ? ['周一', '周二', '周三', '周四', '周五'] : undefined,
      totalSeats: tripType === 'driver_offer' ? seats : 1,
      availableSeats: tripType === 'driver_offer' ? seats : 1,
      carInfo:
        tripType === 'driver_offer'
          ? {
              brandModel,
              color: carColor,
              plateMasked,
              energyType: 'ev',
            }
          : undefined,
      preferences: selectedPreferences,
      routeHighway: highwayRoute,
      estimatedMinutes: direction === 'metro_transfer' ? 35 : 55,
      estimatedDistanceKm: direction === 'metro_transfer' ? 28 : 46,
      remark,
      status: 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      bookings: [],
    };

    onPublish(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-6 overflow-hidden rounded-3xl border border-white/80 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">发布邻里拼车行程</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            西安恒大文化旅游城 · 业主公益通勤互助平台
          </p>
        </div>

        {/* Apple Segmented Control: Role Selector */}
        <div className="mt-4 flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTripType('driver_offer')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
              tripType === 'driver_offer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Car className="h-4 w-4 text-emerald-600" />
            我是车主 · 提供空位
          </button>
          <button
            type="button"
            onClick={() => setTripType('passenger_request')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
              tripType === 'passenger_request'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4 text-purple-600" />
            我是乘客 · 发布需求
          </button>
        </div>

        {/* Quick Commute Direction Presets */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => handleQuickDirection('into_city')}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition ${
              direction === 'into_city'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            🏙️ 进城通勤 (文旅城 ➔ 高新/市区)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDirection('metro_transfer')}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition ${
              direction === 'metro_transfer'
                ? 'border-amber-600 bg-amber-50 text-amber-700 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            🚇 地铁接驳 (文旅城 ➔ 运动公园站)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDirection('out_city')}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition ${
              direction === 'out_city'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            🏡 晚峰返程 (市区 ➔ 文旅城)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Origin & Destination Card */}
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 space-y-3">
            {/* Origin */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                出发地 (集合点)
              </label>
              <div className="flex gap-2">
                <select
                  value={originName}
                  onChange={(e) => setOriginName(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                >
                  <optgroup label="🏰 恒大文旅城社区各期">
                    {EVERGRANDE_ORIGIN_SPOTS.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏙️ 西安市区主要办公地">
                    {XIAN_CITY_DESTINATIONS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <input
                type="text"
                value={originDetail}
                onChange={(e) => setOriginDetail(e.target.value)}
                placeholder="具体集合位置（如：1期东门保安亭）"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                目的地 (下车点)
              </label>
              <div className="flex gap-2">
                <select
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                >
                  <optgroup label="🏙️ 西安市区热门通勤地">
                    {XIAN_CITY_DESTINATIONS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏰 恒大文旅城社区各期">
                    {EVERGRANDE_ORIGIN_SPOTS.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <input
                type="text"
                value={destDetail}
                onChange={(e) => setDestDetail(e.target.value)}
                placeholder="具体下客位置（如：环普科技园A座）"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700"
              />
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">出发日期</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">出发时间</label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-bold font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-800">工作日固定通勤发车</div>
              <div className="text-[11px] text-slate-500">周一至周五每个工作日自动循环挂牌</div>
            </div>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
          </div>

          {/* Driver Specific: Vehicle & Seats */}
          {tripType === 'driver_offer' && (
            <div className="space-y-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    提供空余座位
                  </label>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-semibold"
                  >
                    <option value={1}>1 个座位</option>
                    <option value={2}>2 个座位 (宽敞舒适)</option>
                    <option value={3}>3 个座位 (后排坐满)</option>
                    <option value={4}>4 个座位</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    车型品牌
                  </label>
                  <input
                    type="text"
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                    placeholder="如：特斯拉 Model Y / 理想L7"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  推荐高速通行干道
                </label>
                <input
                  type="text"
                  value={highwayRoute}
                  onChange={(e) => setHighwayRoute(e.target.value)}
                  placeholder="如：正阳大道 ➔ 绕城高速 ➔ 丈八立交"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-medium"
                />
              </div>
            </div>
          )}

          {/* Preference Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              行程偏好标签
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                '准时发车',
                '禁烟',
                '走绕城高速',
                '走西铜快速路',
                '后排宽松',
                '空调适宜',
                '安静车厢',
                '女士优先',
                '可放大行李',
              ].map((tag) => {
                const active = selectedPreferences.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => togglePref(tag)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      active
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remark */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">补充说明</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              placeholder="欢迎邻居拼车，准时出发..."
            />
          </div>

          {/* Non-profit Legal Notice */}
          <div className="rounded-xl bg-slate-100 p-3 text-[11px] text-slate-600 leading-normal">
            <span className="font-bold text-slate-900">🛡️ 西安恒大文旅城公益承诺：</span>
            本小程序仅为解决远郊小区日常通勤提供邻里撮合管理，严禁收取任何营运性费用。
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition shadow-md"
            >
              立即发布行程
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
