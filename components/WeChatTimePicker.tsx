'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Check, ChevronDown, Sparkles } from 'lucide-react';

interface WeChatTimePickerProps {
  value: string; // "HH:mm" e.g., "07:30"
  onChange: (time: string) => void;
  label?: string;
}

const COMMON_HOURS = Array.from({ length: 18 }, (_, i) => {
  const h = i + 6; // 06 to 23
  return h.toString().padStart(2, '0');
});

const COMMON_MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

// Fast commute preset shortcuts
const COMMUTE_PRESETS = [
  { label: '07:00 早班车', value: '07:00' },
  { label: '07:15 早高峰', value: '07:15' },
  { label: '07:30 黄金班', value: '07:30' },
  { label: '07:45 进城潮', value: '07:45' },
  { label: '08:00', value: '08:00' },
  { label: '08:30', value: '08:30' },
  { label: '18:00 晚下班', value: '18:00' },
  { label: '18:30 晚高峰', value: '18:30' },
  { label: '19:00', value: '19:00' },
];

export default function WeChatTimePicker({
  value,
  onChange,
  label,
}: WeChatTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedHour, setSelectedHour] = useState('07');
  const [selectedMinute, setSelectedMinute] = useState('30');

  useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(':');
      setSelectedHour(h.padStart(2, '0'));
      setSelectedMinute(m.padStart(2, '0'));
    }
  }, [value]);

  const handleConfirm = () => {
    onChange(`${selectedHour}:${selectedMinute}`);
    setIsOpen(false);
  };

  const handleSelectPreset = (timeStr: string) => {
    onChange(timeStr);
    const [h, m] = timeStr.split(':');
    setSelectedHour(h);
    setSelectedMinute(m);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5">
      {label && <span className="text-[10px] text-slate-400 block font-medium">{label}</span>}

      {/* Trigger Button - WeChat Cell Style */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 px-3.5 py-2.5 transition active:scale-98 group shadow-2xs"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-left">
            <div className="font-mono text-base font-black text-slate-900 tracking-wider">
              {value || '07:30'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50/80 px-2 py-1 rounded-lg">
          <span>更改时间</span>
          <ChevronDown className="h-3.5 w-3.5 text-emerald-600 transition-transform group-hover:translate-y-0.5" />
        </div>
      </button>

      {/* WeChat Style ActionSheet / Bottom Drawer Time Picker */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 p-0 sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 bg-slate-50/80">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
              >
                取消
              </button>
              <span className="text-sm font-bold text-slate-800">选择发车时间</span>
              <button
                type="button"
                onClick={handleConfirm}
                className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-3 py-1.5 rounded-lg shadow-xs transition"
              >
                确定
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 space-y-4">
              {/* Quick Commute Presets */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <span>常用通勤时刻</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {COMMUTE_PRESETS.map((p) => {
                    const isSelected = value === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => handleSelectPreset(p.value)}
                        className={`rounded-xl py-2 px-1 text-center text-xs font-mono font-bold transition active:scale-95 border ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Wheel / Columns Picker */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400">自定义时分</div>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {/* Hours Selector */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 text-center block">
                      时 (点)
                    </span>
                    <div className="h-36 overflow-y-auto rounded-xl bg-white border border-slate-200 p-1 space-y-1 text-center scrollbar-thin">
                      {COMMON_HOURS.map((h) => {
                        const active = selectedHour === h;
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setSelectedHour(h)}
                            className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                              active
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {h} 时
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Minutes Selector */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 text-center block">
                      分
                    </span>
                    <div className="h-36 overflow-y-auto rounded-xl bg-white border border-slate-200 p-1 space-y-1 text-center scrollbar-thin">
                      {COMMON_MINUTES.map((m) => {
                        const active = selectedMinute === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSelectedMinute(m)}
                            className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                              active
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {m} 分
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Preview */}
              <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-2.5 text-center">
                <span className="text-xs text-slate-500">当前选择：</span>
                <span className="font-mono text-base font-black text-emerald-800 ml-1">
                  {selectedHour}:{selectedMinute} 出发
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
