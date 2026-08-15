'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { CarpoolTrip } from '@/types/carpool';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendation: (filter: { keyword?: string; timeSlot?: string; zone?: string }) => void;
  trips: CarpoolTrip[];
}

export default function AiAssistantDrawer({
  isOpen,
  onClose,
  onApplyRecommendation,
  trips,
}: AiAssistantDrawerProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleAsk = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    setIsLoading(true);
    setResponseResult(null);

    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          userLocation: '恒大文旅城',
          destination: text.includes('高新') ? '高新软件新城' : text.includes('地铁') ? '地铁2号线运动公园站' : '西安市区',
        }),
      });

      const data = await res.json();
      setResponseResult(data);
    } catch (err) {
      console.error('AI call failed:', err);
      // Fallback
      setResponseResult({
        summary: '已根据西安恒大文旅城早高峰交通路况，为您规划最佳绕城高速拼车路线。',
        suggestedOrigin: '恒大文旅城·1期或2期主大门',
        suggestedDestination: '高新·软件新城 (环普科技园)',
        recommendedTime: '07:30',
        highwayRoute: '正阳大道 ➔ 绕城高速 ➔ 丈八立交',
        commuteTips: [
          '建议避开7:50-8:30的正阳快速路进城高峰，提早20分钟出发。',
          '优先预约走ETC高速通道的认证车主。',
          '下车点若在软件新城天谷八路，可提前与车主沟通在A座/G座落客。',
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    '我住在文旅城2期，明早8点要到高新软件新城上班，求匹配车主',
    '明天早上去地铁2号线运动公园站换乘，什么时候出发最顺畅？',
    '晚上6点半在锦业路下班回文旅城，有没有顺路邻居车？',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl border border-white/80 bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">文旅城 AI 拼车智能助手</h3>
              <p className="text-[11px] text-slate-500">Gemini 赋能 · 智能路况与邻里拼友撮合</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conversation / Results area */}
        <div className="my-4 max-h-[60vh] overflow-y-auto space-y-3.5 pr-1">
          {/* Intro Card */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 p-3.5 border border-emerald-100 text-xs text-slate-700">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
              <Bot className="h-4 w-4 text-emerald-600" />
              我是您的恒大文旅城通勤专属管家
            </div>
            您可以直接用一句话告诉我您的出发时间、目的地或上下班班次，我将为您精准匹配文旅城邻居的行程！
          </div>

          {/* Quick preset chips */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5">快捷提问：</div>
            <div className="flex flex-col gap-1.5">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(p);
                    handleAsk(p);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 transition"
                >
                  💬 {p}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Animation */}
          {isLoading && (
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-spin">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div className="mt-3 text-xs font-bold text-slate-800">
                正在分析文旅城路况与邻里车源...
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                实时匹配绕城高速、正阳大道及地铁接驳车次
              </div>
            </div>
          )}

          {/* AI Result Card */}
          {responseResult && !isLoading && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                AI 智能匹配与出行规划
              </div>

              <div className="text-xs text-slate-800 leading-relaxed font-medium">
                {responseResult.summary}
              </div>

              {/* Recommended Route Card */}
              <div className="rounded-xl bg-white p-3 border border-emerald-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">推荐集合点：</span>
                  <span className="font-bold text-slate-900">
                    {responseResult.suggestedOrigin}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">推荐目的地：</span>
                  <span className="font-bold text-slate-900">
                    {responseResult.suggestedDestination}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">最佳出发时段：</span>
                  <span className="font-bold text-emerald-700">
                    {responseResult.recommendedTime}
                  </span>
                </div>
                {responseResult.highwayRoute && (
                  <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">避堵路线：</span>
                    {responseResult.highwayRoute}
                  </div>
                )}
              </div>

              {/* Commute Tips */}
              {responseResult.commuteTips && (
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="font-bold text-slate-800">💡 避堵与乘车建议：</div>
                  {responseResult.commuteTips.map((tip: string, i: number) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="text-emerald-600">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Apply Filter Button */}
              <button
                onClick={() => {
                  onApplyRecommendation({
                    keyword: responseResult.suggestedDestination?.includes('高新')
                      ? '高新'
                      : responseResult.suggestedDestination?.includes('地铁')
                      ? '地铁'
                      : '',
                    timeSlot: 'morning_peak',
                  });
                  onClose();
                }}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>在拼车大厅查看匹配车次</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="输入您的拼车诉求（如：明早7点半去高新）"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={() => handleAsk()}
            disabled={isLoading || !inputQuery.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-200 disabled:cursor-not-allowed transition shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
