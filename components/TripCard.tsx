'use client';

import React from 'react';
import {
  Car,
  Users,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { CarpoolTrip } from '@/types/carpool';

interface TripCardProps {
  trip: CarpoolTrip;
  onViewDetail: (trip: CarpoolTrip) => void;
  isSelected?: boolean;
}

export default function TripCard({
  trip,
  onViewDetail,
  isSelected = false,
}: TripCardProps) {
  const isDriverOffer = trip.type === 'driver_offer';

  // Clean name by stripping all parentheses
  const cleanName = trip.publisher.name.replace(/[\(（].*?[\)）]/g, '').trim();
  const phone = trip.publisher.phone || '18729391167';

  // Format date display (e.g., 明天 / 今天 / 8月16日)
  const getDateDisplay = () => {
    if (trip.departureDate === '2026-08-16') return '明天';
    if (trip.departureDate === '2026-08-15') return '今天';
    return trip.departureDate;
  };

  return (
    <div
      id={`trip-card-${trip.id}`}
      onClick={() => onViewDetail(trip)}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-3.5 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md bg-emerald-50/5'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* 1. Top Header: Role & Time + Seats */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {/* Role badge */}
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold ${
              isDriverOffer
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                : 'bg-purple-50 text-purple-700 border border-purple-200/60'
            }`}
          >
            {isDriverOffer ? <Car className="h-3 w-3" /> : <Users className="h-3 w-3" />}
            {isDriverOffer ? '车找人' : '人找车'}
          </span>

          {/* Departure Date & Time */}
          <div className="flex items-center gap-1 text-slate-900 font-bold text-sm">
            <span className="text-xs font-medium text-slate-500">{getDateDisplay()}</span>
            <span className="font-mono text-base font-bold text-slate-900">{trip.departureTime}</span>
            <span className="text-xs font-normal text-slate-400">出发</span>
          </div>
        </div>

        {/* Seat / Capacity info */}
        <div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-lg">
            {isDriverOffer ? `余 ${trip.availableSeats || trip.totalSeats} 座` : `求 ${trip.totalSeats || 1} 人`}
          </span>
        </div>
      </div>

      {/* 2. Route Display (Clean 2-point vertical line) */}
      <div className="py-2.5 space-y-2">
        {/* Origin */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-100" />
          <span className="text-sm font-bold text-slate-800 truncate">
            {trip.origin.name}
          </span>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 ring-2 ring-red-100" />
          <span className="text-sm font-bold text-slate-900 truncate">
            {trip.destination.name}
          </span>
        </div>
      </div>

      {/* 3. Sub-route info (Highway / Route summary) */}
      {trip.routeHighway && (
        <div className="mb-2.5 rounded-lg bg-slate-50/90 px-2.5 py-1.5 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="truncate">🛣️ 途经：{trip.routeHighway}</span>
          {trip.estimatedDistanceKm && (
            <span className="shrink-0 font-medium text-slate-400 ml-2">
              约{trip.estimatedDistanceKm}km
            </span>
          )}
        </div>
      )}

      {/* 4. Bottom Footer: Publisher Info + Direct Call Button */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
        {/* Publisher (Clean name with NO parentheses) */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <img
              src={trip.publisher.avatar}
              alt={cleanName}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
            />
          </div>
          <div className="flex items-center min-w-0 truncate">
            <span className="text-xs font-bold text-slate-800 truncate">
              {cleanName}
            </span>
          </div>
        </div>

        {/* Direct Phone Call Button (Native dialer directly like Meituan) */}
        <a
          href={`tel:${phone}`}
          onClick={(e) => e.stopPropagation()}
          title={`拨打 ${cleanName} 电话`}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-400 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 active:scale-95 transition shadow-2xs shrink-0"
        >
          <Phone className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600/20" />
          <span>电话联系</span>
        </a>
      </div>
    </div>
  );
}
