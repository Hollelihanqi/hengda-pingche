'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Download, Check, Sparkles, X, Palette, Image as ImageIcon } from 'lucide-react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ThemeColor = 'emerald' | 'blue' | 'amber';

export default function AvatarModal({ isOpen, onClose }: AvatarModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<ThemeColor>('emerald');
  const [downloaded, setDownloaded] = useState(false);

  // Draw avatar on canvas
  const drawAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 144;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // 1. Background rounded rect
    const radius = 32;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();

    // Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    if (theme === 'emerald') {
      bgGrad.addColorStop(0, '#10B981');
      bgGrad.addColorStop(1, '#0D9488');
    } else if (theme === 'blue') {
      bgGrad.addColorStop(0, '#0284C7');
      bgGrad.addColorStop(1, '#2563EB');
    } else {
      bgGrad.addColorStop(0, '#F59E0B');
      bgGrad.addColorStop(1, '#EA580C');
    }
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // 2. Road Arc
    ctx.beginPath();
    ctx.moveTo(20, 114);
    ctx.quadraticCurveTo(72, 102, 124, 114);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Road dash lines
    ctx.beginPath();
    ctx.moveTo(48, 108);
    ctx.lineTo(62, 108);
    ctx.moveTo(76, 108);
    ctx.lineTo(96, 108);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 3. Car Body Shadow & Base
    // Cabin
    ctx.beginPath();
    ctx.moveTo(48, 64);
    ctx.bezierCurveTo(53, 49, 61, 46, 72, 46);
    ctx.bezierCurveTo(83, 46, 91, 49, 96, 64);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Windows (left & right)
    const winColor = theme === 'emerald' ? '#0F766E' : theme === 'blue' ? '#1D4ED8' : '#C2410C';
    ctx.fillStyle = winColor;
    
    // Left window
    ctx.beginPath();
    ctx.moveTo(53, 62);
    ctx.bezierCurveTo(56, 52, 62, 49, 70, 49);
    ctx.lineTo(70, 62);
    ctx.closePath();
    ctx.fill();

    // Right window
    ctx.beginPath();
    ctx.moveTo(74, 49);
    ctx.bezierCurveTo(82, 49, 88, 52, 91, 62);
    ctx.lineTo(74, 62);
    ctx.closePath();
    ctx.fill();

    // Lower Car Box (rounded)
    const bx = 36, by = 62, bw = 72, bh = 24, br = 7;
    ctx.beginPath();
    ctx.moveTo(bx + br, by);
    ctx.lineTo(bx + bw - br, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
    ctx.lineTo(bx + bw, by + bh - br);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
    ctx.lineTo(bx + br, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
    ctx.lineTo(bx, by + br);
    ctx.quadraticCurveTo(bx, by, bx + br, by);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Headlights
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.roundRect(38, 68, 5, 4, 2);
    ctx.roundRect(101, 68, 5, 4, 2);
    ctx.fill();

    // Wheels
    // Front wheel
    ctx.beginPath();
    ctx.arc(52, 86, 8.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(52, 86, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#94A3B8';
    ctx.fill();

    // Rear wheel
    ctx.beginPath();
    ctx.arc(92, 86, 8.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(92, 86, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#94A3B8';
    ctx.fill();

    // 4. Community Orange Location Pin
    ctx.beginPath();
    ctx.arc(108, 36, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(108, 36, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // 5. Eco Leaf Top-Left
    ctx.beginPath();
    ctx.moveTo(28, 36);
    ctx.quadraticCurveTo(28, 24, 38, 24);
    ctx.quadraticCurveTo(38, 36, 28, 36);
    ctx.fillStyle = '#86EFAC';
    ctx.fill();
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(drawAvatar, 50);
    }
  }, [isOpen, theme]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `wechat-miniprogram-avatar-${theme}-144x144.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-5 text-center animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> 微信小程序专属头像
          </div>
          <h3 className="text-lg font-black text-slate-900">144×144 PNG 头像下载</h3>
          <p className="text-xs text-slate-500">
            完全符合微信官方规范：PNG 格式 · &lt;2MB · 144×144px
          </p>
        </div>

        {/* Live Canvas Avatar Rendering */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="p-3 bg-slate-50 rounded-3xl border-2 border-slate-100 shadow-inner">
            <canvas
              ref={canvasRef}
              width={144}
              height={144}
              className="w-36 h-36 rounded-2xl shadow-md cursor-pointer transition hover:scale-105"
              onClick={handleDownload}
              title="点击直接下载"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-2">实时渲染画布 (点击图片亦可直接保存)</span>
        </div>

        {/* Color Palette Switcher */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
            <Palette className="w-3.5 h-3.5 text-slate-400" /> 选择头像配色主题
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setTheme('emerald')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                theme === 'emerald'
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              翡翠绿 (推荐)
            </button>
            <button
              onClick={() => setTheme('blue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                theme === 'blue'
                  ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-300'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
              }`}
            >
              科技蓝
            </button>
            <button
              onClick={() => setTheme('amber')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                theme === 'amber'
                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              活力橙
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownload}
            className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" /> 已保存到本地相册/下载文件夹
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> 一键下载 144×144 PNG 头像
              </>
            )}
          </button>

          <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-500 text-left space-y-1">
            <p className="font-bold text-slate-700">📌 上传微信官方指引：</p>
            <p>1. 登录微信公众平台 (mp.weixin.qq.com)</p>
            <p>2. 点击「设置」➔「基本设置」➔「小程序头像」➔ 上传下载的 PNG 即可</p>
          </div>
        </div>
      </div>
    </div>
  );
}
