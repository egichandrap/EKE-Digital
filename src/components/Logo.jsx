import React from 'react';

export default function Logo({ className = "w-10 h-10", showText = false, textClass = "" }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative shrink-0 rounded-2xl overflow-hidden shadow-md shadow-[#b22204]/25 transition-transform duration-300 group-hover:scale-105 ${className}`}>
        <img
          src="/logo.svg"
          alt="EKE Digital Logo"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-[#111c2d] leading-none ${textClass}`}>
            EKE Digital
          </span>
          <span className="text-[10px] text-[#8f7069] font-bold tracking-wider uppercase mt-0.5">
            Instant License Hub
          </span>
        </div>
      )}
    </div>
  );
}
