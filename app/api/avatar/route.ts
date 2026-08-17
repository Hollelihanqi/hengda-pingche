import { NextResponse } from 'next/server';

export async function GET() {
  // SVG of the 144x144 avatar
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 144" width="144" height="144">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#0D9488" />
    </linearGradient>
    <linearGradient id="carGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F0FDF4" />
    </linearGradient>
  </defs>

  <rect width="144" height="144" rx="32" fill="url(#bg)" />

  <path d="M20 114 Q72 102 124 114" stroke="#A7F3D0" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.45" />
  <path d="M48 108 L62 108 M76 108 L96 108" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.7" />

  <g>
    <path d="M48 64 C53 49 61 46 72 46 C83 46 91 49 96 64 Z" fill="url(#carGlow)" />
    <path d="M53 62 C56 52 62 49 70 49 L70 62 Z" fill="#0D9488" opacity="0.85" />
    <path d="M74 49 C82 49 88 52 91 62 L74 62 Z" fill="#0D9488" opacity="0.85" />
    <rect x="36" y="62" width="72" height="24" rx="7" fill="url(#carGlow)" />
    <rect x="38" y="68" width="5" height="4" rx="2" fill="#FBBF24" />
    <rect x="101" y="68" width="5" height="4" rx="2" fill="#FBBF24" />
    <circle cx="52" cy="86" r="8.5" fill="#1E293B" />
    <circle cx="52" cy="86" r="4" fill="#94A3B8" />
    <circle cx="92" cy="86" r="8.5" fill="#1E293B" />
    <circle cx="92" cy="86" r="4" fill="#94A3B8" />
  </g>

  <g transform="translate(98, 26)">
    <circle cx="10" cy="10" r="11" fill="#F59E0B" stroke="#FFFFFF" stroke-width="2.5" />
    <circle cx="10" cy="10" r="4" fill="#FFFFFF" />
  </g>

  <path d="M28 36 C28 26 38 24 38 24 C38 34 28 36 28 36 Z" fill="#6EE7B7" />
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
