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
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">个人拼车资料与偏好</h3>
            <p className="text-xs text-slate-500">方便邻居在上下车时与您快速会合与联系</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">您的昵称 / 称呼</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">文旅城常用门岗 / 区域</label>
            <input
              type="text"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              placeholder="自由输入，如：1期星空门岗 / 3期童梦汇 / 4期等"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">常用上下车详细点 (选填)</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="如：星空门岗保安亭旁 / 2期东门"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">工作地/通勤标签 (选填)</label>
            <input
              type="text"
              value={identityTag}
              onChange={(e) => setIdentityTag(e.target.value)}
              placeholder="如：高新软件新城 / 运动公园地铁站"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-[11px] text-slate-600">
            <span className="font-bold text-emerald-700">💡 提示：</span>
            本程序为文旅城邻里 0 元公益顺路拼车，无需任何强制认证，随时可发车或预约。
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>资料已更新！</span>
              </>
            ) : (
              '保存资料'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
