'use client';

import React from 'react';
import {
  Car,
  Clock,
  MapPin,
  Users,
  Trash2,
  Phone,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { CarpoolTrip, UserProfile } from '@/types/carpool';

interface MyTripsViewProps {
  trips: CarpoolTrip[];
  currentUser: UserProfile;
  onCancelTrip: (tripId: string) => void;
  onSelectTrip: (trip: CarpoolTrip) => void;
  onOpenPublish: () => void;
}

export default function MyTripsView({
  trips,
  currentUser,
  onCancelTrip,
  onSelectTrip,
  onOpenPublish,
}: MyTripsViewProps) {
  // Trips published by current user
  const myPublishedTrips = trips.filter((t) => t.publisher.id === currentUser.id);

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">我发布的拼车信息</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            共发布 {myPublishedTrips.length} 条信息 · 邻里随时可电话联系您
          </p>
        </div>
        <button
          onClick={onOpenPublish}
          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>新发布</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {myPublishedTrips.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Car className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">暂无发布的拼车信息</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              您是有车车主还是求拼乘客？点击下方按钮即可一键发布通勤信息！
            </p>
            <button
              onClick={onOpenPublish}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>立即发布拼车</span>
            </button>
          </div>
        ) : (
          myPublishedTrips.map((trip) => {
            const isDriver = trip.type === 'driver_offer';
            return (
              <div
                key={trip.id}
                onClick={() => onSelectTrip(trip)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition hover:border-emerald-300 hover:shadow-md"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold ${
                        isDriver
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                      }`}
                    >
                      {isDriver ? <Car className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                      {isDriver ? '车找人' : '人找车'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {trip.departureDate} {trip.departureTime}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {isDriver ? `余 ${trip.availableSeats || trip.totalSeats} 席` : `求 ${trip.totalSeats || 1} 人`}
                  </span>
                </div>

                {/* Route */}
                <div className="py-2.5 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800 truncate">{trip.origin.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                    <span className="font-bold text-slate-900 truncate">{trip.destination.name}</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>发布于 {trip.createdAt || '近期'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('确定要下架/删除该条发布信息吗？')) {
                          onCancelTrip(trip.id);
                        }
                      }}
                      className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>下架</span>
                    </button>
                    <span className="text-xs font-bold text-emerald-600 flex items-center">
                      查看详情 <ArrowRight className="h-3 w-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
