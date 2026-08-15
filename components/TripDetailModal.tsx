'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Car,
  ShieldCheck,
  Phone,
  MessageCircle,
  Share2,
  Users,
  Route,
  CheckCircle2,
  AlertTriangle,
  QrCode,
} from 'lucide-react';
import { CarpoolTrip, UserProfile } from '@/types/carpool';
import MapView from './MapView';

interface TripDetailModalProps {
  trip: CarpoolTrip | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onBook: (trip: CarpoolTrip) => void;
  onCancelTrip?: (tripId: string) => void;
}

export default function TripDetailModal({
  trip,
  currentUser,
  isOpen,
  onClose,
  onBook,
  onCancelTrip,
}: TripDetailModalProps) {
  const [showCallPrompt, setShowCallPrompt] = useState(false);
  const [showQrShare, setShowQrShare] = useState(false);

  if (!isOpen || !trip) return null;

  const isOwner = trip.publisher.id === currentUser.id;
  const isDriverOffer = trip.type === 'driver_offer';
  const hasUserBooked = trip.bookings.some((b) => b.passengerId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-6 overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="relative flex items-center justify-between border-b border-slate-100 p-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isDriverOffer
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {isDriverOffer ? '车主发车行程' : '乘客求车需求'}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {trip.departureDate} {trip.departureTime}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowQrShare(true)}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-200 transition"
              title="分享至文旅城业主拼车群"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-200 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* GIS Route Visualizer Header */}
          <div className="h-48 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
            <MapView selectedTrip={trip} className="h-full w-full" isCompact />
          </div>

          {/* Departure & Arrival Point Summary */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/70 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <div className="h-8 w-0.5 bg-slate-200" />
                <div className="h-3 w-3 rounded-full bg-sky-500 ring-4 ring-sky-100" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{trip.origin.name}</span>
                    <span className="text-xs text-slate-400">{trip.origin.zone}</span>
                  </div>
                  {trip.origin.detail && (
                    <p className="text-xs text-slate-500">{trip.origin.detail}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{trip.destination.name}</span>
                    <span className="text-xs text-slate-400">{trip.destination.zone}</span>
                  </div>
                  {trip.destination.detail && (
                    <p className="text-xs text-slate-500">{trip.destination.detail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Highway Route */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
              <Route className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800">推荐干道：</span>
              <span className="truncate">{trip.routeHighway}</span>
              <span className="ml-auto font-bold text-emerald-600">
                约 {trip.estimatedMinutes} 分钟
              </span>
            </div>
          </div>

          {/* Publisher / Driver Profile Card */}
          <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={trip.publisher.avatar}
                    alt={trip.publisher.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  {trip.publisher.isVerifiedOwner && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                      <ShieldCheck className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{trip.publisher.name}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      文旅城认证业主
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {trip.publisher.communityPhase} · {trip.publisher.identityTag}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCallPrompt(true)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                电话联系
              </button>
            </div>

            {/* Vehicle Details */}
            {trip.carInfo && (
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">车型</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{trip.carInfo.brandModel}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">车牌</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{trip.carInfo.plateMasked}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">车身颜色</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{trip.carInfo.color}</div>
                </div>
              </div>
            )}

            {/* Remark */}
            {trip.remark && (
              <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                <span className="font-bold text-amber-900">邻里留言：</span> {trip.remark}
              </div>
            )}
          </div>

          {/* Booked Passengers Section */}
          <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <Users className="h-4 w-4 text-emerald-600" />
                同行拼友名单
              </div>
              <span className="text-xs text-slate-500">
                {trip.bookings.length} 人已约 · 余 {trip.availableSeats} 座
              </span>
            </div>

            {trip.bookings.length === 0 ? (
              <div className="py-3 text-center text-xs text-slate-400">
                暂无邻居预约，快来抢先锁定座位吧～
              </div>
            ) : (
              <div className="space-y-2">
                {trip.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={booking.passengerAvatar}
                        alt={booking.passengerName}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-slate-800">
                          {booking.passengerName}{' '}
                          <span className="text-[10px] font-normal text-slate-400">
                            ({booking.communityPhase})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          上车：{booking.pickupPoint} • 预约 {booking.seatsBooked} 座
                        </div>
                      </div>
                    </div>

                    <span className="rounded-md bg-emerald-100/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      已核验
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Non-profit Guarantee Notice */}
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50/60 p-3 text-xs text-emerald-900 border border-emerald-200/50">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">恒大文旅城邻里公益互助承诺：</span>
              不收车费、不设抽成，仅做信息撮合，互助互爱。
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-4 bg-slate-50 flex gap-2">
          {isOwner ? (
            <button
              onClick={() => {
                if (confirm('确定要取消此行程吗？')) {
                  onCancelTrip?.(trip.id);
                  onClose();
                }
              }}
              className="w-full rounded-xl bg-red-50 py-3 text-xs font-bold text-red-600 hover:bg-red-100 transition"
            >
              取消此行程
            </button>
          ) : hasUserBooked ? (
            <div className="w-full text-center py-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
              ✓ 您已预约此行程，请准时在上车点等候
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onBook(trip);
              }}
              disabled={trip.availableSeats <= 0 && isDriverOffer}
              className={`w-full rounded-xl py-3 text-xs font-bold text-white transition shadow-sm ${
                trip.availableSeats <= 0 && isDriverOffer
                  ? 'bg-slate-300 cursor-not-allowed'
                  : isDriverOffer
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {trip.availableSeats <= 0 && isDriverOffer ? '已约满' : '立即免费预约同行'}
            </button>
          )}
        </div>

        {/* Phone Contact Prompt Sheet */}
        {showCallPrompt && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="mt-3 text-base font-bold text-slate-900">邻里安全联系</h4>
              <p className="text-xs text-slate-500 mt-1">
                车主 {trip.publisher.name} · {trip.publisher.phone}
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                已启用虚拟号码保护与业主身份核对，请文明沟通拼车事宜。
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowCallPrompt(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600"
                >
                  关闭
                </button>
                <a
                  href={`tel:${trip.publisher.phone.replace(/\*/g, '8')}`}
                  className="flex-1 flex items-center justify-center rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm"
                >
                  拨打电话
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Share QR Dialog */}
        {showQrShare && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl">
              <QrCode className="mx-auto h-12 w-12 text-slate-900" />
              <h4 className="mt-2 text-base font-bold text-slate-900">转发至文旅城业主群</h4>
              <p className="text-xs text-slate-500 mt-1">
                长按保存或截图海报，分享至微信群/朋友圈
              </p>
              <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-left text-xs text-emerald-900 space-y-1">
                <div className="font-bold">【恒大文旅城拼车卡】</div>
                <div>时间：{trip.departureDate} {trip.departureTime}</div>
                <div>路线：{trip.origin.name} ➔ {trip.destination.name}</div>
                <div>车辆：{trip.carInfo?.brandModel || '认证私家车'}</div>
              </div>
              <button
                onClick={() => setShowQrShare(false)}
                className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white"
              >
                我知道了
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
