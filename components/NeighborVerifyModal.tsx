'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Home, User, Phone, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types/carpool';

interface NeighborVerifyModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export default function NeighborVerifyModal({
  currentUser,
  isOpen,
  onClose,
  onUpdateUser,
}: NeighborVerifyModalProps) {
  const [name, setName] = useState(currentUser.name);
  const [phase, setPhase] = useState(currentUser.communityPhase);
  const [room, setRoom] = useState(currentUser.roomNumber || '7号楼2单元1802');
  const [phone, setPhone] = useState(currentUser.phone);
  const [identityTag, setIdentityTag] = useState(currentUser.identityTag || '高新华为·认证业主');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      communityPhase: phase,
      roomNumber: room,
      phone,
      identityTag,
      isVerifiedOwner: true,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">恒大文旅城业主认证</h3>
            <p className="text-xs text-slate-500">仅限恒大文旅城业主与常住居民拼车认证</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">您的姓名 / 称呼</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">所在期数</label>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
            >
              <option value="恒大文旅城·1期天际星空">恒大文旅城·1期 天际星空</option>
              <option value="恒大文旅城·2期天际星座">恒大文旅城·2期 天际星座</option>
              <option value="恒大文旅城·3期童梦汇">恒大文旅城·3期 童梦汇</option>
              <option value="恒大文旅城·4期公馆">恒大文旅城·4期 公馆</option>
              <option value="恒大文旅城·风情商业街">恒大文旅城·风情商业街</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">房号 (仅用于实名核验)</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="如：3号楼1单元1204"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">工作地/职业标签</label>
            <input
              type="text"
              value={identityTag}
              onChange={(e) => setIdentityTag(e.target.value)}
              placeholder="如：高新软件新城·工程师 / 经开行政中心"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-emerald-50 p-3 text-[11px] text-emerald-900">
            <span className="font-bold">认证权益：</span>
            点亮“文旅城认证业主”绿盾标识，提升预约成功率，享受信用优先匹配。
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>认证资料已更新！</span>
              </>
            ) : (
              '保存认证信息'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
