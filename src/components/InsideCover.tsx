import React from 'react';
import { Book, Heart } from 'lucide-react';

interface InsideCoverProps {
  side: 'front' | 'back';
  onFlipForward?: () => void;
  onCloseBook?: () => void;
}

export const InsideCover: React.FC<InsideCoverProps> = ({
  side,
  onCloseBook,
}) => {
  return (
    <div
      className={`relative w-full h-full select-none flex flex-col justify-between overflow-hidden p-6 sm:p-8
        ${side === 'front' ? 'shadow-[inset_-16px_0_24px_rgba(0,0,0,0.06)]' : 'shadow-[inset_16px_0_24px_rgba(0,0,0,0.06)]'}
      `}
      style={{
        background:
          side === 'front'
            ? 'linear-gradient(200deg, #FFFFFF 0%, #FFF5F7 50%, #FAEDF0 100%)'
            : 'linear-gradient(160deg, #FFFFFF 0%, #FFF5F7 50%, #FAEDF0 100%)',
      }}
    >
      {/* Subtle paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(#C99A6E 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Book spine gutter shadow */}
      <div
        className={`absolute top-0 bottom-0 pointer-events-none z-10 w-10 ${
          side === 'front'
            ? 'right-0 bg-gradient-to-l from-rose-900/10 via-rose-900/5 to-transparent'
            : 'left-0 bg-gradient-to-r from-rose-900/10 via-rose-900/5 to-transparent'
        }`}
      />

      {/* Outer edge shadow */}
      <div
        className={`absolute top-0 bottom-0 pointer-events-none z-10 w-5 ${
          side === 'front'
            ? 'left-0 bg-gradient-to-r from-rose-900/10 to-transparent'
            : 'right-0 bg-gradient-to-l from-rose-900/10 to-transparent'
        }`}
      />

      {/* Ornate Rose Gold Border */}
      <div className="absolute inset-4 border-[1.5px] border-[#C99A6E]/60 pointer-events-none z-10 rounded-[2px]">
        <div className="absolute inset-1.5 border-[0.5px] border-[#E89BA4]/40 pointer-events-none" />
      </div>

      {/* 4 Corner Floral Ornaments in Rose Gold */}
      <div className="absolute top-4 left-4 w-8 h-8 pointer-events-none z-10 text-[#C99A6E]">
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <path d="M2 2L30 2L30 5L5 5L5 30L2 30Z" fill="currentColor" fillOpacity="0.8" />
          <circle cx="7" cy="7" r="2.5" fill="#E89BA4" />
          <path d="M5 10L14 10L14 13L8 13L8 19L5 19Z" fill="#C99A6E" fillOpacity="0.6" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 w-8 h-8 pointer-events-none z-10 text-[#C99A6E] -scale-x-100">
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <path d="M2 2L30 2L30 5L5 5L5 30L2 30Z" fill="currentColor" fillOpacity="0.8" />
          <circle cx="7" cy="7" r="2.5" fill="#E89BA4" />
          <path d="M5 10L14 10L14 13L8 13L8 19L5 19Z" fill="#C99A6E" fillOpacity="0.6" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 w-8 h-8 pointer-events-none z-10 text-[#C99A6E] -scale-y-100">
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <path d="M2 2L30 2L30 5L5 5L5 30L2 30Z" fill="currentColor" fillOpacity="0.8" />
          <circle cx="7" cy="7" r="2.5" fill="#E89BA4" />
          <path d="M5 10L14 10L14 13L8 13L8 19L5 19Z" fill="#C99A6E" fillOpacity="0.6" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 w-8 h-8 pointer-events-none z-10 text-[#C99A6E] -scale-100">
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <path d="M2 2L30 2L30 5L5 5L5 30L2 30Z" fill="currentColor" fillOpacity="0.8" />
          <circle cx="7" cy="7" r="2.5" fill="#E89BA4" />
          <path d="M5 10L14 10L14 13L8 13L8 19L5 19Z" fill="#C99A6E" fillOpacity="0.6" />
        </svg>
      </div>

      {/* Header Watermark */}
      <div className="relative z-20 flex justify-center items-center text-[10px] sm:text-xs tracking-[4px] text-[#C99A6E] uppercase font-['Cinzel'] font-semibold">
        <span>{side === 'front' ? '✦ INSIDE FRONT COVER ✦' : '✦ INSIDE BACK COVER ✦'}</span>
      </div>

      {/* Center Keepsake Crest */}
      <div className="relative z-20 my-auto flex flex-col items-center justify-center text-center p-3 sm:p-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#C99A6E] flex items-center justify-center bg-white/80 shadow-sm mb-3">
          <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12 sm:w-16 sm:h-16">
            <circle cx="40" cy="40" r="36" stroke="#C99A6E" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="40" cy="40" r="30" stroke="#E89BA4" strokeWidth="1.2" />
            <circle cx="34" cy="40" r="12" stroke="#C99A6E" strokeWidth="2.2" fill="none" />
            <circle cx="46" cy="40" r="12" stroke="#E89BA4" strokeWidth="2.2" fill="none" />
            <polygon points="46,26 49,30 43,30" fill="#E89BA4" />
          </svg>
        </div>

        <div className="font-['Playfair_Display'] text-sm sm:text-base text-[#2D2628] tracking-wide font-bold">
          {side === 'front' ? 'Wedding Anniversary' : 'Happily Ever After'}
        </div>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C99A6E] to-transparent my-1.5" />
        <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#5C4A4E] max-w-[240px] leading-relaxed">
          {side === 'front'
            ? 'A love-filled journey written in memories, preserved with elegance and devotion.'
            : 'May every passing year bring more joy, deeper love, and cherished moments together.'}
        </p>

        <div className="flex items-center gap-1.5 mt-2 text-[#C99A6E] text-xs">
          <Heart className="w-3.5 h-3.5 fill-[#E89BA4] text-[#E89BA4]" />
          <span className="font-['Great_Vibes'] text-base text-[#C45566]">Forever & Always</span>
          <Heart className="w-3.5 h-3.5 fill-[#E89BA4] text-[#E89BA4]" />
        </div>

        {side === 'back' && onCloseBook && (
          <button
            onClick={onCloseBook}
            className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-['Cinzel'] text-[10px] sm:text-xs tracking-wider uppercase cursor-pointer transition-all shadow-xs"
          >
            <Book className="w-3.5 h-3.5 text-rose-600" />
            <span>Close Book</span>
          </button>
        )}
      </div>

      <div className="relative z-20 flex justify-center items-center text-center">
        <div className="w-16 h-[1px] bg-[#C99A6E]/40" />
      </div>
    </div>
  );
};
