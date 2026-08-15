'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, Car, Clock, ChevronRight, Zap } from 'lucide-react';
import { CarpoolTrip } from '@/types/carpool';

interface MapViewProps {
  selectedTrip?: CarpoolTrip | null;
  allTrips?: CarpoolTrip[];
  onSelectTrip?: (trip: CarpoolTrip) => void;
  className?: string;
  isCompact?: boolean;
}

export default function MapView({
  selectedTrip,
  allTrips = [],
  onSelectTrip,
  className = '',
  isCompact = false,
}: MapViewProps) {
  const [carProgress, setCarProgress] = useState(0.35);
  const [isDriving, setIsDriving] = useState(true);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite' | 'traffic'>('traffic');
  const [activeTab, setActiveTab] = useState<'route' | 'overview'>('route');

  // Realistic vehicle animation along route
  useEffect(() => {
    if (!isDriving) return;
    const interval = setInterval(() => {
      setCarProgress((prev) => (prev >= 0.95 ? 0.05 : prev + 0.015));
    }, 400);
    return () => clearInterval(interval);
  }, [isDriving]);

  const originName = selectedTrip?.origin.name || '恒大文旅城·主会场';
  const destName = selectedTrip?.destination.name || '高新·软件新城 (环普科技园)';
  const distanceKm = selectedTrip?.estimatedDistanceKm || 46.5;
  const minutes = selectedTrip?.estimatedMinutes || 55;
  const highwayRoute = selectedTrip?.routeHighway || '正阳大道 ➔ 绕城高速 ➔ 丈八立交';

  return (
    <div
      id="map-container"
      className={`relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-b from-sky-50/70 via-slate-50/90 to-blue-50/50 shadow-sm backdrop-blur-xl transition-all ${className}`}
    >
      {/* Top Apple Style Glass Header */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-800">高德交通GIS · 实时路况畅通</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/70 bg-white/80 p-1 shadow-sm backdrop-blur-md">
          <button
            onClick={() => setMapMode('traffic')}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              mapMode === 'traffic' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            实时路况
          </button>
          <button
            onClick={() => setMapMode('standard')}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              mapMode === 'standard' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            通勤路线
          </button>
        </div>
      </div>

      {/* SVG GIS Vector Map */}
      <div className="relative w-full h-full min-h-[300px] select-none">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full object-cover"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.02))' }}
        >
          <defs>
            {/* Gradients for Apple-aesthetic map styling */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="85%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#059669" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Map Grid / Urban Blocks */}
          <rect width="800" height="500" fill="#f8fafc" />

          {/* North Zone: Jinghe River (泾河/渭河生态水系) */}
          <path
            d="M 0 160 Q 200 140 400 170 T 800 150 L 800 190 Q 600 200 400 190 T 0 180 Z"
            fill="url(#waterGrad)"
          />
          <text x="360" y="178" fill="#0284c7" fontSize="11" fontWeight="600" opacity="0.6">
            渭河生态廊道 / 泾渭分明水系
          </text>

          {/* Xi'an Beltway & Major Corridors (Road Network) */}
          {/* 绕城高速 G3002 (Xi'an Ring Expressway) */}
          <ellipse
            cx="400"
            cy="360"
            rx="320"
            ry="110"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="8"
            strokeDasharray="4 2"
          />
          <ellipse
            cx="400"
            cy="360"
            rx="320"
            ry="110"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="3"
            opacity="0.5"
          />
          <text x="630" y="320" fill="#64748b" fontSize="10" fontWeight="500">
            西安绕城高速 G3002 (ETC畅通)
          </text>

          {/* 正阳大道 (Zhengyang Avenue - Main route from Evergrande to City) */}
          <line x1="220" y1="60" x2="350" y2="300" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
          <line x1="220" y1="60" x2="350" y2="300" stroke="#10b981" strokeWidth="4" strokeOpacity="0.8" />
          <text x="250" y="140" fill="#047857" fontSize="10" fontWeight="600" transform="rotate(35 250 140)">
            正阳大道 (双向8车道快速路)
          </text>

          {/* 西铜快速干线 / 朱宏路高架 */}
          <line x1="380" y1="60" x2="400" y2="290" stroke="#e2e8f0" strokeWidth="10" />
          <line x1="380" y1="60" x2="400" y2="290" stroke="#f59e0b" strokeWidth="3" opacity="0.7" />
          <text x="405" y="120" fill="#b45309" fontSize="9">
            西铜干线 / 朱宏快速路
          </text>

          {/* 未央路中轴线 (Metro Line 2 Axis) */}
          <line x1="480" y1="180" x2="480" y2="470" stroke="#e2e8f0" strokeWidth="8" />
          <line x1="480" y1="180" x2="480" y2="470" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" />
          <text x="490" y="240" fill="#dc2626" fontSize="9" fontWeight="600">
            地铁2号线 (运动公园 ➔ 行政中心 ➔ 钟楼)
          </text>

          {/* 丈八北路 / 唐延路 / 锦业路 (Gaoxin Axis) */}
          <line x1="240" y1="350" x2="260" y2="480" stroke="#e2e8f0" strokeWidth="8" />
          <line x1="260" y1="430" x2="380" y2="430" stroke="#e2e8f0" strokeWidth="8" />
          <text x="210" y="475" fill="#475569" fontSize="10" fontWeight="600">
            高新锦业路 / 科技二路
          </text>

          {/* Primary Active Commute Route Path */}
          {/* From Evergrande Tourism City (210, 65) -> Zhengyang Ave -> Ring Expressway -> Gaoxin Software Park (210, 430) */}
          <path
            d="M 210 65 L 250 150 Q 300 230 350 285 Q 380 320 330 360 L 220 385 Q 190 400 210 435"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 210 65 L 250 150 Q 300 230 350 285 Q 380 320 330 360 L 220 385 Q 190 400 210 435"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeGlow)"
          />

          {/* Route Direction Arrows / Pulse dots */}
          <circle cx="250" cy="150" r="3" fill="#ffffff" />
          <circle cx="330" cy="270" r="3" fill="#ffffff" />
          <circle cx="270" cy="375" r="3" fill="#ffffff" />

          {/* Landmark Pins */}
          {/* Landmark 1: 恒大文旅城 (Origin) */}
          <g transform="translate(210, 65)">
            <circle r="22" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
            <circle r="14" fill="#10b981" />
            <circle r="6" fill="#ffffff" />
            {/* Label Card */}
            <rect x="-85" y="-42" width="170" height="28" rx="8" fill="#0f172a" fillOpacity="0.9" />
            <text x="0" y="-24" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
              🏰 西安恒大文化旅游城
            </text>
            <text x="0" y="-14" fill="#a7f3d0" fontSize="8" textAnchor="middle">
              1期/2期/3期/公馆集合上车
            </text>
          </g>

          {/* Landmark 2: 地铁2号线运动公园站 */}
          <g transform="translate(480, 220)">
            <circle r="8" fill="#ef4444" />
            <circle r="4" fill="#ffffff" />
            <rect x="12" y="-12" width="105" height="22" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <text x="18" y="3" fill="#1e293b" fontSize="9" fontWeight="600">
              🚇 运动公园地铁站
            </text>
          </g>

          {/* Landmark 3: 西安北客站 */}
          <g transform="translate(430, 190)">
            <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#3b82f6" />
            <text x="14" y="4" fill="#475569" fontSize="9">
              🚄 西安北站 (高铁枢纽)
            </text>
          </g>

          {/* Landmark 4: 经开行政中心 */}
          <g transform="translate(480, 275)">
            <circle r="6" fill="#64748b" />
            <text x="12" y="4" fill="#475569" fontSize="9">
              🏛️ 经开·行政中心
            </text>
          </g>

          {/* Landmark 5: 钟楼 / 钟楼盘道 */}
          <g transform="translate(480, 390)">
            <circle r="7" fill="#f59e0b" />
            <text x="14" y="4" fill="#78350f" fontSize="9" fontWeight="600">
              🔔 钟楼 / 小寨商圈
            </text>
          </g>

          {/* Landmark 6: 高新软件新城 / 环普 (Destination) */}
          <g transform="translate(210, 435)">
            <circle r="22" fill="#0284c7" fillOpacity="0.2" className="animate-ping" />
            <circle r="14" fill="#0284c7" />
            <circle r="6" fill="#ffffff" />
            {/* Label Card */}
            <rect x="-80" y="16" width="160" height="28" rx="8" fill="#0f172a" fillOpacity="0.9" />
            <text x="0" y="34" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
              🏢 高新·软件新城/环普
            </text>
            <text x="0" y="43" fill="#bae6fd" fontSize="8" textAnchor="middle">
              天谷八路/云水一路科技园
            </text>
          </g>

          {/* Animated Car Marker on the path */}
          {/* Interpolated position calculation */}
          {(() => {
            // Bezier approximate points
            const t = carProgress;
            let cx = 210 + (210 - 210) * t;
            let cy = 65 + (435 - 65) * t;
            if (t < 0.3) {
              cx = 210 + (250 - 210) * (t / 0.3);
              cy = 65 + (150 - 65) * (t / 0.3);
            } else if (t < 0.6) {
              const localT = (t - 0.3) / 0.3;
              cx = 250 + (350 - 250) * localT;
              cy = 150 + (285 - 150) * localT;
            } else if (t < 0.8) {
              const localT = (t - 0.6) / 0.2;
              cx = 350 + (220 - 350) * localT;
              cy = 285 + (385 - 285) * localT;
            } else {
              const localT = (t - 0.8) / 0.2;
              cx = 220 + (210 - 220) * localT;
              cy = 385 + (435 - 385) * localT;
            }

            return (
              <g transform={`translate(${cx}, ${cy})`}>
                <circle r="16" fill="#10b981" fillOpacity="0.3" className="animate-pulse" />
                <rect x="-12" y="-12" width="24" height="24" rx="12" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="11" textAnchor="middle">
                  🚗
                </text>
                {/* Speed tag */}
                <rect x="14" y="-10" width="48" height="18" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
                <text x="38" y="2" fill="#047857" fontSize="8" fontWeight="bold" textAnchor="middle">
                  78 km/h
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Bottom Floating Route Info Sheet (Apple Maps style) */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <div className="rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-lg backdrop-blur-xl transition hover:bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">{highwayRoute}</span>
                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                      避堵优选
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-0.5 font-medium text-slate-700">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      约 {minutes} 分钟
                    </span>
                    <span>•</span>
                    <span>全长 {distanceKm} 公里</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">92% 高速/快速路</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsDriving(!isDriving)}
                className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  isDriving
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isDriving ? '暂停轨迹' : '模拟巡航'}
              </button>
            </div>

            {/* Waypoint Steps preview */}
            {selectedTrip?.waypoints && selectedTrip.waypoints.length > 0 && (
              <div className="mt-2.5 flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100/80 text-[11px] text-slate-600 no-scrollbar">
                <span className="shrink-0 font-semibold text-slate-700">经停站：</span>
                {selectedTrip.waypoints.map((wp, idx) => (
                  <div key={wp.id} className="flex items-center gap-1 shrink-0">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                      {wp.name} {wp.estimatedTime ? `(${wp.estimatedTime})` : ''}
                    </span>
                    {idx < selectedTrip.waypoints.length - 1 && <span className="text-slate-300">➔</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
