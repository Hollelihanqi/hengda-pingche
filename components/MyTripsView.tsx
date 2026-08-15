'use client';

import React, { useState } from 'react';
import {
  Car,
  Clock,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Trash2,
  ChevronRight,
  ShieldCheck,
  QrCode,
  AlertCircle,
} from 'lucide-react';
import { CarpoolTrip, UserProfile, PassengerBooking } from '@/types/carpool';

interface MyTripsViewProps {
  trips: CarpoolTrip[];
  currentUser: UserProfile;
  onCancelBooking: (tripId: string, bookingId: string) => void;
  onCancelTrip: (tripId: string) => void;
  onSelectTrip: (trip: CarpoolTrip) => void;
  onOpenPublish: () => void;
}

export default function MyTripsView({
  trips,
  currentUser,
  onCancelBooking,
  onCancelTrip,
  onSelectTrip,
  onOpenPublish,
}: MyTripsViewProps) {
  const [activeTab, setActiveTab] = useState<'as_passenger' | 'as_driver'>('as_passenger');

  // Bookings where current user is passenger
  const myBookings: { trip: CarpoolTrip; booking: PassengerBooking }[] = [];
  trips.forEach((trip) => {
    trip.bookings.forEach((booking) => {
      if (booking.passengerId === currentUser.id) {
        myBookings.push({ trip, booking });
      }
    });
  });

  // Trips published by current user
  const myPublishedTrips = trips.filter((t) => t.publisher.id === currentUser.id);

  return (
    <div className="space-y-4">
      {/* Apple Segmented Switcher */}
      <div className="flex rounded-2xl bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab('as_passenger')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
            activeTab === 'as_passenger'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="h-3.5 w-3.5 text-purple-600" />
          我预约的行程 ({myBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('as_driver')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
            activeTab === 'as_driver'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Car className="h-3.5 w-3.5 text-emerald-600" />
          我发布的车次 ({myPublishedTrips.length})
        </button>
      </div>

      {/* Passenger View */}
      {activeTab === 'as_passenger' && (
        <div className="space-y-3">
          {myBookings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-slate-900">暂无预约的行程</h4>
              <p className="text-xs text-slate-400 mt-1">
                去拼车大厅看看文旅城邻居们的发车计划吧！
              </p>
            </div>
          ) : (
            myBookings.map(({ trip, booking }) => (
              <div
                key={booking.id}
                onClick={() => onSelectTrip(trip)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-emerald-300 hover:shadow-md"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                      预约成功
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {trip.departureDate} {trip.departureTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                      乘车码 {booking.boardingCode}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="my-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{booking.pickupPoint}</span>
                    <span className="text-slate-300">➔</span>
                    <span>{trip.destination.name}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 pt-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={trip.publisher.avatar}
                        alt={trip.publisher.name}
                        className="h-5 w-5 rounded-full"
                      />
                      <span>车主：{trip.publisher.name}</span>
                      <span>•</span>
                      <span>{trip.carInfo?.brandModel || '认证私家车'}</span>
                    </div>

                    <span className="font-semibold text-slate-700">
                      已约 {booking.seatsBooked} 座
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">
                    上车点：{booking.pickupPoint}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('确认取消此预约吗？')) {
                        onCancelBooking(trip.id, booking.id);
                      }
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-red-600 transition text-[11px]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    取消预约
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Driver View */}
      {activeTab === 'as_driver' && (
        <div className="space-y-3">
          {myPublishedTrips.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Car className="h-6 w-6" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-slate-900">您暂未发布任何车次</h4>
              <p className="text-xs text-slate-400 mt-1">
                每天进城上班有空位？快为同小区的邻居提供便利吧！
              </p>
              <button
                onClick={onOpenPublish}
                className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition"
              >
                发布车主发车
              </button>
            </div>
          ) : (
            myPublishedTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => onSelectTrip(trip)}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-emerald-300 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                      {trip.type === 'driver_offer' ? '车主空位' : '求车需求'}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {trip.departureDate} {trip.departureTime}
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      trip.availableSeats > 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    余 {trip.availableSeats} / {trip.totalSeats} 座
                  </span>
                </div>

                <div className="my-3 space-y-1 text-xs">
                  <div className="font-bold text-slate-900">
                    {trip.origin.name} ➔ {trip.destination.name}
                  </div>
                  <div className="text-slate-500">{trip.routeHighway}</div>
                </div>

                {/* Passenger list */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    已预约乘客：{trip.bookings.length} 位
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('确认取消此行程吗？')) {
                        onCancelTrip(trip.id);
                      }
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-red-600 transition text-[11px]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    取消发车
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
