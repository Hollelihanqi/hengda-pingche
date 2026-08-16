'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Car,
  Users,
  ShieldCheck,
  Phone,
  Route,
  Share2,
  QrCode,
  Info,
  Calendar,
  Sparkles,
  Check,
  Copy,
} from 'lucide-react';
import { CarpoolTrip, UserProfile } from '@/types/carpool';

interface TripDetailModalProps {
  trip: CarpoolTrip | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCancelTrip?: (tripId: string) => void;
}

export default function TripDetailModal({
  trip,
  currentUser,
  isOpen,
  onClose,
  onCancelTrip,
}: TripDetailModalProps) {
  const [showQrShare, setShowQrShare] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trip) return null;

  const isOwner = trip.publisher.id === currentUser.id;
  const isDriverOffer = trip.type === 'driver_offer';
  const cleanPublisherName = trip.publisher.name.replace(/[\(（].*?[\)）]/g, '').trim();

  const phone = trip.publisher.phone || '18729391167';

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="trip-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                isDriverOffer
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}
            >
              {isDriverOffer ? <Car className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
              {isDriverOffer ? '车主发车 · 车找人' : '乘客发布 · 人找车'}
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {isDriverOffer ? `空位 ${trip.availableSeats || trip.totalSeats} 席` : `求拼 ${trip.totalSeats || 1} 人`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrShare(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              title="分享行程卡片"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 1. Time and Date Banner */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-mono font-black text-slate-900">
                    {trip.departureTime}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {trip.departureDate === '2026-08-16' ? '明天 (8月16日)' : trip.departureDate}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {trip.isRecurring ? '工作日每天固定通勤' : '单次发车'} · 约 {trip.estimatedMinutes || 45} 分钟到达
                </div>
              </div>
            </div>
          </div>

          {/* 2. Route Steps */}
          <div className="rounded-2xl border border-slate-200/90 p-4 space-y-3 bg-white">
            <div className="text-xs font-bold text-slate-400">通勤路线</div>

            <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-2">
              {/* Origin */}
              <div className="relative">
                <span className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <div className="text-xs text-slate-400">出发地点</div>
                <div className="font-bold text-slate-900 text-sm">{trip.origin.name}</div>
                {trip.origin.detail && (
                  <div className="text-xs text-slate-500 mt-0.5">{trip.origin.detail}</div>
                )}
              </div>

              {/* Destination */}
              <div className="relative pt-1">
                <span className="absolute -left-[23px] top-2 h-3.5 w-3.5 rounded-full bg-red-500 ring-4 ring-red-100" />
                <div className="text-xs text-slate-400">到达目的地</div>
                <div className="font-bold text-slate-900 text-sm">{trip.destination.name}</div>
                {trip.destination.detail && (
                  <div className="text-xs text-slate-500 mt-0.5">{trip.destination.detail}</div>
                )}
              </div>
            </div>

            {/* Highway Route */}
            {trip.routeHighway && (
              <div className="mt-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 flex items-center gap-2">
                <Route className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-medium">途经：{trip.routeHighway}</span>
              </div>
            )}
          </div>

          {/* 3. Publisher Info & Vehicle */}
          <div className="rounded-2xl border border-slate-200/90 p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={trip.publisher.avatar}
                  alt={cleanPublisherName}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{cleanPublisherName}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {isDriverOffer ? '顺路车主' : '同路乘客'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {isDriverOffer ? '私家车主' : '邻里拼车'} · 诚信积分 {trip.publisher.creditScore || 100} 分
                  </div>
                </div>
              </div>

              {/* Phone Dial Link */}
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>一键拨打</span>
              </a>
            </div>

            {/* Remark */}
            {trip.remark && (
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[10px] text-slate-400">发布备注</div>
                <div className="text-xs text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2 rounded-xl">
                  {trip.remark}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions: Simple Contact / Delete */}
        <div className="border-t border-slate-100 p-4 bg-slate-50 flex gap-2">
          {isOwner ? (
            <button
              onClick={() => {
                if (confirm('确定要删除/下架此拼车信息吗？')) {
                  onCancelTrip?.(trip.id);
                  onClose();
                }
              }}
              className="w-full rounded-2xl bg-red-50 py-3.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
            >
              删除/下架此发布
            </button>
          ) : (
            <div className="w-full flex gap-2">
              <a
                href={`tel:${phone}`}
                className="flex-1 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white text-center hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Phone className="h-4 w-4" />
                <span>电话联系邻居 ({phone})</span>
              </a>
              <button
                onClick={handleCopyPhone}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? '已复制' : '复制手机号'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Share QR Dialog */}
        {showQrShare && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl">
              <QrCode className="mx-auto h-12 w-12 text-slate-900" />
              <h4 className="mt-2 text-base font-bold text-slate-900">分享至文旅城拼车群</h4>
              <p className="text-xs text-slate-500 mt-1">
                长按保存或截图卡片发群
              </p>
              <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-left text-xs text-emerald-900 space-y-1">
                <div className="font-bold">【恒大文旅城邻里拼车】</div>
                <div>时间：{trip.departureDate} {trip.departureTime}</div>
                <div>路线：{trip.origin.name} ➔ {trip.destination.name}</div>
                <div>联系人：{cleanPublisherName} ({phone})</div>
              </div>
              <button
                onClick={() => setShowQrShare(false)}
                className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
