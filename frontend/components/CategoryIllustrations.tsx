import React from 'react';

// SVG Illustration for Design & Branding
export function DesignIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="design-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3965FA" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#99B7FC" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="design-grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8CC63E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3965FA" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Background Shapes */}
      <rect x="15" y="15" width="170" height="90" rx="12" fill="url(#design-grad1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      {/* Design Layers / Canvas Elements */}
      <circle cx="60" cy="55" r="28" fill="url(#design-grad2)" />
      <rect x="95" y="35" width="70" height="12" rx="6" fill="#FFFFFF" fillOpacity="0.9" />
      <rect x="95" y="55" width="50" height="8" rx="4" fill="#99B7FC" fillOpacity="0.7" />
      <rect x="95" y="70" width="60" height="8" rx="4" fill="#3965FA" fillOpacity="0.8" />
      {/* Pen Tool Control Points */}
      <path d="M 45 75 C 60 30, 100 90, 140 45" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
      <circle cx="45" cy="75" r="4" fill="#FFFFFF" />
      <circle cx="140" cy="45" r="4" fill="#3965FA" stroke="#FFFFFF" strokeWidth="2" />
    </svg>
  );
}

// SVG Illustration for Web3 Development
export function DevIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dev-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B1B39" />
          <stop offset="100%" stopColor="#3965FA" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* Code Window Container */}
      <rect x="20" y="15" width="160" height="90" rx="10" fill="url(#dev-grad)" stroke="rgba(57,101,250,0.4)" strokeWidth="1.5" />
      {/* Window Controls */}
      <circle cx="35" cy="28" r="3.5" fill="#FF6D47" />
      <circle cx="47" cy="28" r="3.5" fill="#FFD16B" />
      <circle cx="59" cy="28" r="3.5" fill="#8CC63E" />
      {/* Code Lines */}
      <path d="M 35 48 L 45 56 L 35 64" stroke="#3965FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="52" y1="64" x2="68" y2="64" stroke="#99B7FC" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="35" y="76" width="70" height="6" rx="3" fill="#99B7FC" fillOpacity="0.4" />
      <rect x="112" y="76" width="40" height="6" rx="3" fill="#8CC63E" fillOpacity="0.7" />
      {/* Soroban / Stellar Node Symbol */}
      <circle cx="145" cy="48" r="16" fill="#3965FA" fillOpacity="0.3" stroke="#3965FA" strokeWidth="1.5" />
      <path d="M145 38 L152 48 L145 58 L138 48 Z" fill="#99B7FC" />
    </svg>
  );
}

// SVG Illustration for Video & Motion
export function VideoIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3965FA" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF6D47" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="160" height="80" rx="12" fill="url(#vid-grad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      {/* Timeline Waveform */}
      <rect x="30" y="75" width="140" height="12" rx="4" fill="rgba(27,27,57,0.7)" />
      <line x1="40" y1="81" x2="160" y2="81" stroke="#99B7FC" strokeWidth="2" strokeDasharray="3 3" />
      {/* Central Play Button */}
      <circle cx="100" cy="48" r="20" fill="#FFFFFF" fillOpacity="0.9" />
      <path d="M96 40 L108 48 L96 56 Z" fill="#1B1B39" />
    </svg>
  );
}

// SVG Illustration for Digital Marketing
export function MarketingIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mkt-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8CC63E" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3965FA" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="20" y="15" width="160" height="90" rx="12" fill="url(#mkt-grad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      {/* Growth Chart Bars */}
      <rect x="40" y="65" width="16" height="25" rx="3" fill="#FFFFFF" fillOpacity="0.4" />
      <rect x="65" y="50" width="16" height="40" rx="3" fill="#FFFFFF" fillOpacity="0.6" />
      <rect x="90" y="38" width="16" height="52" rx="3" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="115" y="25" width="16" height="65" rx="3" fill="#FFFFFF" />
      {/* Trend Arrow Line */}
      <path d="M 38 60 Q 80 40, 140 18" stroke="#FFD16B" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 132 18 L 142 18 L 140 28" fill="#FFD16B" />
    </svg>
  );
}

// SVG Illustration for Writing & Content
export function WritingIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wrt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#99B7FC" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3965FA" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect x="40" y="15" width="120" height="90" rx="8" fill="url(#wrt-grad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <line x1="55" y1="35" x2="120" y2="35" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="48" x2="145" y2="48" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      <line x1="55" y1="60" x2="135" y2="60" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      <line x1="55" y1="72" x2="100" y2="72" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      {/* Feather Pen */}
      <path d="M 130 85 C 145 65, 160 40, 170 20" stroke="#FFD16B" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// SVG Illustration for Stellar Architecture Network
export function StellarNetworkIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="net-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3965FA" />
          <stop offset="50%" stopColor="#99B7FC" />
          <stop offset="100%" stopColor="#8CC63E" />
        </linearGradient>
      </defs>
      {/* Interconnecting Lines */}
      <path d="M 70 100 Q 150 40, 250 100 T 430 100" stroke="url(#net-line)" strokeWidth="2.5" strokeDasharray="6 6" fill="none" />
      
      {/* Node 1: Client Wallet */}
      <circle cx="70" cy="100" r="32" fill="#1B1B39" stroke="#3965FA" strokeWidth="2" />
      <circle cx="70" cy="100" r="10" fill="#3965FA" />
      <text x="70" y="150" textAnchor="middle" fill="#99B7FC" fontSize="11" fontFamily="sans-serif" fontWeight="bold">1. Cliente / Wallet</text>

      {/* Node 2: Stellar Wallets Kit */}
      <circle cx="190" cy="60" r="28" fill="#1B1B39" stroke="#99B7FC" strokeWidth="2" />
      <path d="M190 48 L197 60 L190 72 L183 60 Z" fill="#99B7FC" />
      <text x="190" y="105" textAnchor="middle" fill="#99B7FC" fontSize="11" fontFamily="sans-serif" fontWeight="bold">2. Wallets Kit</text>

      {/* Node 3: Horizon API & Testnet */}
      <circle cx="310" cy="140" r="28" fill="#1B1B39" stroke="#3965FA" strokeWidth="2" />
      <circle cx="310" cy="140" r="8" fill="#3965FA" />
      <text x="310" y="185" textAnchor="middle" fill="#99B7FC" fontSize="11" fontFamily="sans-serif" fontWeight="bold">3. Horizon API</text>

      {/* Node 4: Freelancer Wallet */}
      <circle cx="430" cy="100" r="32" fill="#1B1B39" stroke="#8CC63E" strokeWidth="2" />
      <circle cx="430" cy="100" r="10" fill="#8CC63E" />
      <text x="430" y="150" textAnchor="middle" fill="#8CC63E" fontSize="11" fontFamily="sans-serif" fontWeight="bold">4. Freelancer (XLM)</text>
    </svg>
  );
}

// SVG Illustration for Empty Search Result State
export function EmptySearchIllustration({ className = "w-24 h-24 mx-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="45" cy="45" r="28" stroke="#3965FA" strokeWidth="3" strokeDasharray="4 4" fill="none" />
      <line x1="65" y1="65" x2="85" y2="85" stroke="#3965FA" strokeWidth="4" strokeLinecap="round" />
      <path d="M 38 45 A 7 7 0 0 1 52 45" stroke="#99B7FC" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="38" cy="38" r="2.5" fill="#99B7FC" />
      <circle cx="52" cy="38" r="2.5" fill="#99B7FC" />
    </svg>
  );
}
