'use client';

import React, { useState, useEffect } from 'react';
import { Car, Clock, Navigation, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { CarpoolTrip } from '@/types/carpool';

interface DynamicIslandAlertProps {
  activeTrip?: CarpoolTrip | null;
  onOpenTrip?: (trip: CarpoolTrip) => void;
}

export default function DynamicIslandAlert({
  activeTrip,
  onOpenTrip,
}: DynamicIslandAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!activeTrip) return null;

  return (
    <div className="mx-auto my-2 flex justify-center px-4 transition-all duration-300">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group cursor-pointer overflow-hidden rounded-3xl bg-black text-white shadow-xl transition-all duration-300 ease-out border border-white/10 ${
          isExpanded ? 'w-full max-w-md p-4' : 'w-auto px-4 py-2'
        }`}
      >
        {/* Collapsed State */}
        {!isExpanded ? (
          <div className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-black">
              <Car className="h-3 w-3" />
            </div>
            <span className="text-xs font-semibold tracking-tight text-white">
              已预约 {activeTrip.departureTime} 出发
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-zinc-400 font-mono">
              {activeTrip.destination.name.split('·')[1] || activeTrip.destination.name}
            </span>
          </div>
        ) : (
          /* Expanded State (iOS Dynamic Island Live Activity) */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black">
                  <Car className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  实时行程 · 即将发车
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {activeTrip.departureDate} {activeTrip.departureTime}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-y border-zinc-800 py-2">
              <div>
                <div className="text-[10px] text-zinc-400">文旅城上车点</div>
                <div className="font-semibold text-white mt-0.5 truncate max-w-[140px]">
                  {activeTrip.origin.name}
                </div>
              </div>
              <span className="text-zinc-600">➔</span>
              <div className="text-right">
                <div className="text-[10px] text-zinc-400">市区下客点</div>
                <div className="font-semibold text-white mt-0.5 truncate max-w-[140px]">
                  {activeTrip.destination.name}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <img
                  src={activeTrip.publisher.avatar}
                  alt={activeTrip.publisher.name}
                  className="h-5 w-5 rounded-full"
                />
                <span>车主：{activeTrip.publisher.name}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTrip?.(activeTrip);
                }}
                className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-black hover:bg-emerald-400 transition"
              >
                查看电子乘车码
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
