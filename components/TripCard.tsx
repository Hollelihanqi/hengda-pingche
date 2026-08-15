'use client';

import React from 'react';
import {
  Car,
  Clock,
  MapPin,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Sparkles,
  Calendar,
  Users,
  Route,
  Zap,
} from 'lucide-react';
import { CarpoolTrip } from '@/types/carpool';

interface TripCardProps {
  trip: CarpoolTrip;
  onBook: (trip: CarpoolTrip) => void;
  onViewDetail: (trip: CarpoolTrip) => void;
  isSelected?: boolean;
}

export default function TripCard({
  trip,
  onBook,
  onViewDetail,
  isSelected = false,
}: TripCardProps) {
  const isDriverOffer = trip.type === 'driver_offer';
  const isFull = trip.availableSeats <= 0;

  // Direction format
  const getDirectionBadge = () => {
    switch (trip.direction) {
      case 'into_city':
        return {
          text: '进城通勤',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
          dot: 'bg-emerald-500',
        };
      case 'out_city':
        return {
          text: '晚峰返程',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
          dot: 'bg-indigo-500',
        };
      case 'metro_transfer':
        return {
          text: '地铁接驳',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
          dot: 'bg-amber-500',
        };
      default:
        return {
          text: '邻里顺路',
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-500',
        };
    }
  };

  const dirBadge = getDirectionBadge();

  return (
    <div
      id={`trip-card-${trip.id}`}
      onClick={() => onViewDetail(trip)}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300 hover:shadow-md ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md bg-emerald-50/10'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          {/* Role badge */}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isDriverOffer
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-purple-600 text-white shadow-xs'
            }`}
          >
            {isDriverOffer ? <Car className="h-3 w-3" /> : <Users className="h-3 w-3" />}
            {isDriverOffer ? '车找人 · 车主' : '人找车 · 乘客'}
          </span>

          {/* Direction Badge */}
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${dirBadge.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dirBadge.dot}`} />
            {dirBadge.text}
          </span>

          {trip.isRecurring && (
            <span className="hidden sm:inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              工作日固定
            </span>
          )}
        </div>

        {/* Departure Time (High Contrast Apple Typography) */}
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-400 font-medium">出发</span>
            <span className="text-lg font-bold tracking-tight text-slate-900 font-mono">
              {trip.departureTime}
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            {trip.departureDate === '2026-08-16' ? '明天 (周一)' : trip.departureDate}
          </div>
        </div>
      </div>

      {/* Origin & Destination Route Timeline */}
      <div className="my-3.5 space-y-2.5">
        {/* Origin */}
        <div className="flex items-start gap-2.5">
          <div className="mt-1 flex flex-col items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <div className="h-6 w-0.5 bg-slate-200" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 truncate">{trip.origin.name}</span>
              <span className="text-[11px] text-slate-400 shrink-0">{trip.origin.zone}</span>
            </div>
            {trip.origin.detail && (
              <p className="text-xs text-slate-500 truncate">{trip.origin.detail}</p>
            )}
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-2.5">
          <div className="mt-1 flex flex-col items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-sky-500 ring-2 ring-sky-100" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 truncate">
                {trip.destination.name}
              </span>
              <span className="text-[11px] text-slate-400 shrink-0">{trip.destination.zone}</span>
            </div>
            {trip.destination.detail && (
              <p className="text-xs text-slate-500 truncate">{trip.destination.detail}</p>
            )}
          </div>
        </div>
      </div>

      {/* Waypoints & Highway summary */}
      <div className="flex items-center gap-1.5 rounded-xl bg-slate-50/90 px-2.5 py-1.5 text-xs text-slate-600">
        <Route className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span className="truncate font-medium">{trip.routeHighway}</span>
        <span className="ml-auto shrink-0 text-[11px] font-semibold text-emerald-600">
          约{trip.estimatedMinutes}分 / {trip.estimatedDistanceKm}km
        </span>
      </div>

      {/* Preference Tags */}
      {trip.preferences.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {trip.preferences.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md bg-slate-100/80 px-2 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
          {trip.carInfo && (
            <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
              {trip.carInfo.brandModel.split(' ')[0]} ({trip.carInfo.plateMasked})
            </span>
          )}
        </div>
      )}

      {/* Driver / Publisher & Booking Action Footer */}
      <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-slate-100">
        {/* User Info */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative">
            <img
              src={trip.publisher.avatar}
              alt={trip.publisher.name}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
            />
            {trip.publisher.isVerifiedOwner && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-white ring-1 ring-white">
                <ShieldCheck className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-800 truncate">
                {trip.publisher.name}
              </span>
              <span className="rounded bg-emerald-50 px-1 py-0.2 text-[9px] font-semibold text-emerald-600">
                信用 {trip.publisher.creditScore}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {trip.publisher.communityPhase}
            </div>
          </div>
        </div>

        {/* Action Button / Seat info */}
        <div className="flex items-center gap-2 shrink-0">
          {isDriverOffer ? (
            <div className="text-right">
              <span
                className={`text-xs font-semibold ${
                  trip.availableSeats > 0 ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                余 {trip.availableSeats} / {trip.totalSeats} 座
              </span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-xs font-semibold text-purple-600">求 1 座</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook(trip);
            }}
            disabled={isFull && isDriverOffer}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all active:scale-95 ${
              isFull && isDriverOffer
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isDriverOffer
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isFull && isDriverOffer ? '已约满' : isDriverOffer ? '预约同行' : '提供顺风'}
          </button>
        </div>
      </div>
    </div>
  );
}
