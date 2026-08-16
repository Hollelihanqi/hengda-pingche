'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Car,
  CheckCircle2,
  Users,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CarpoolTrip, UserProfile } from '@/types/carpool';
import { EVERGRANDE_ORIGIN_SPOTS } from '@/lib/mockData';

interface BookingModalProps {
  trip: CarpoolTrip | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (tripId: string, bookingData: any) => void;
}

export default function BookingModal({
  trip,
  currentUser,
  isOpen,
  onClose,
  onConfirmBooking,
}: BookingModalProps) {
  const [seats, setSeats] = useState(1);
  const [pickupSpot, setPickupSpot] = useState(
    trip?.origin.name || EVERGRANDE_ORIGIN_SPOTS[0].name
  );
  const [dropoffSpot, setDropoffSpot] = useState(trip?.destination.name || '');
  const [notes, setNotes] = useState('准时到达，随身携带轻便背包。');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedCode, setBookedCode] = useState('');

  if (!isOpen || !trip) return null;

  const isDriverOffer = trip.type === 'driver_offer';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert('请先同意邻里公益拼车公约与免责声明');
      return;
    }

    const bookingResult = onConfirmBooking(trip.id, {
      tripId: trip.id,
      passengerId: currentUser.id,
      passengerName: currentUser.name,
      passengerAvatar: currentUser.avatar,
      passengerPhone: currentUser.phone,
      communityPhase: currentUser.communityPhase,
      seatsBooked: seats,
      pickupPoint: pickupSpot,
      dropoffPoint: dropoffSpot || trip.destination.name,
      notes,
    });

    const generatedCode = (bookingResult as any)?.boardingCode || Math.floor(100000 + Math.random() * 900000).toString();
    setBookedCode(generatedCode);

    // Confetti effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsSuccess(true);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/80 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  isDriverOffer ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'
                }`}
              >
                {isDriverOffer ? <Car className="h-6 w-6" /> : <Users className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isDriverOffer ? '预约车主同行' : '响应乘客拼车需求'}
                </h3>
                <p className="text-xs text-slate-500">恒大文旅城邻里顺路拼车</p>
              </div>
            </div>

            {/* Trip Brief Card */}
            <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-emerald-600" />
                  {trip.departureDate} {trip.departureTime}
                </span>
                <span className="font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                  {isDriverOffer ? `余 ${trip.availableSeats} 座` : '求 1 座'}
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-800">
                {trip.origin.name} ➔ {trip.destination.name}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                <img
                  src={trip.publisher.avatar}
                  alt={trip.publisher.name}
                  className="h-5 w-5 rounded-full"
                />
                <span>{trip.publisher.name}</span>
                <span>•</span>
                <span>{trip.publisher.communityPhase}</span>
                {trip.carInfo && (
                  <>
                    <span>•</span>
                    <span>{trip.carInfo.brandModel}</span>
                  </>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Seat selection */}
              {isDriverOffer && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    预约座位数
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((num) => {
                      const disabled = num > trip.availableSeats;
                      return (
                        <button
                          key={num}
                          type="button"
                          disabled={disabled}
                          onClick={() => setSeats(num)}
                          className={`flex-1 rounded-xl py-2 text-xs font-semibold border transition ${
                            seats === num
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
                              : disabled
                              ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {num} 位乘客
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pickup location picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  您在恒大文旅城的上车点
                </label>
                <select
                  value={pickupSpot}
                  onChange={(e) => setPickupSpot(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  {EVERGRANDE_ORIGIN_SPOTS.map((spot) => (
                    <option key={spot.name} value={spot.name}>
                      {spot.name} ({spot.detail})
                    </option>
                  ))}
                </select>
              </div>

              {/* Passenger remark */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  给车主留言 / 行李说明
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="例如：带一台轻便电脑包，会准时在门岗等"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Safe Carpool Check */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="text-[11px] text-slate-700 leading-tight">
                    <span className="font-bold">邻里拼车互助约定：</span>
                    双方自愿顺路同行，准时在指定门岗等候，文明礼让，共同维护良好乘车环境。
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
                >
                  确认预约同行
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen with Boarding QR & Code */
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">拼车预约成功！</h3>
              <p className="text-xs text-slate-500 mt-1">
                已将您的乘车信息通知车主 {trip.publisher.name}，请提前5分钟到达上车点
              </p>
            </div>

            {/* Electronic Boarding Pass Card */}
            <div className="mx-auto max-w-sm rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4 text-left">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                <span className="text-xs font-bold text-emerald-900">邻里乘车电子凭证</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  已确认
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">出发时间：</span>
                  <span className="font-semibold text-slate-900">
                    {trip.departureDate} {trip.departureTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">上车地点：</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                    {pickupSpot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">同行人数：</span>
                  <span className="font-semibold text-slate-900">{seats} 人</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">车主车辆：</span>
                  <span className="font-semibold text-slate-900">
                    {trip.carInfo?.brandModel || '业主私家车'} ({trip.carInfo?.plateMasked || '已认证'})
                  </span>
                </div>
              </div>

              {/* Digital Check-in Code */}
              <div className="mt-4 rounded-xl bg-white p-3 text-center border border-emerald-100 shadow-xs">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  乘车核验码
                </div>
                <div className="text-2xl font-black font-mono tracking-widest text-emerald-700 mt-0.5">
                  {bookedCode || '852914'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">上车时出示给车主核验</div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              查看我的行程
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
