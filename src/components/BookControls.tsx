import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Book,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Plus,
  Minus,
  Image as ImageIcon,
  Type,
} from 'lucide-react';
import { PaperStyle } from './PlainPage';

interface BookControlsProps {
  currentSpread: number;
  totalSpreads: number;
  onPrevSpread: () => void;
  onNextSpread: () => void;
  onGoToSpread: (spreadIndex: number) => void;
  onCloseBook: () => void;
  paperStyle: PaperStyle;
  onChangePaperStyle: (style: PaperStyle) => void;
  onClearAllPages: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  petalsEnabled: boolean;
  onTogglePetals: () => void;
  totalPages: number;
  onAddPages: () => void;
  onRemovePages: () => void;
  onAddPhotos?: () => void;
  onToggleTextTool?: () => void;
  activeTool?: 'select' | 'text';
}

export const BookControls: React.FC<BookControlsProps> = ({
  currentSpread,
  totalSpreads,
  onPrevSpread,
  onNextSpread,
  onGoToSpread,
  onCloseBook,
  paperStyle,
  onChangePaperStyle,
  onClearAllPages,
  isAudioPlaying,
  onToggleAudio,
  petalsEnabled,
  onTogglePetals,
  totalPages,
  onAddPages,
  onRemovePages,
  onAddPhotos,
  onToggleTextTool,
  activeTool = 'select',
}) => {
  return (
    <div className="w-full flex flex-col gap-2 mt-2 sm:mt-2.5 z-30 select-none">
      {/* Secondary Customization & Paper Style Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white/85 backdrop-blur-sm border border-rose-200/60 rounded-xl px-4 py-2 text-xs text-stone-700 shadow-xs">
        {/* Spread Navigation Dots */}
        <div className="flex items-center gap-1.5">
          <span className="font-['Cinzel'] text-[10px] text-rose-700 uppercase mr-1 font-semibold">
            Spread:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {Array.from({ length: totalSpreads }).map((_, i) => (
              <button
                key={i}
                onClick={() => onGoToSpread(i)}
                title={`Go to Spread ${i}`}
                className={`transition-all rounded-full cursor-pointer ${
                  i === currentSpread
                    ? 'w-6 h-2 bg-rose-500 shadow-[0_0_8px_rgba(226,123,138,0.7)]'
                    : 'w-2 h-2 bg-rose-200 hover:bg-rose-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Paper Style Selector */}
        <div className="flex items-center gap-1.5">
          <span className="font-['Cinzel'] text-[11px] text-rose-700 hidden sm:inline font-semibold">
            PAPER:
          </span>
          <div className="inline-flex rounded-lg border border-rose-200 p-0.5 bg-rose-50/60">
            <button
              onClick={() => onChangePaperStyle('parchment')}
              className={`px-2 py-1 rounded text-[11px] font-['Cinzel'] transition-colors cursor-pointer ${
                paperStyle === 'parchment'
                  ? 'bg-rose-500 text-white font-semibold shadow-xs'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
              title="Plain White"
            >
              Plain
            </button>
            <button
              onClick={() => onChangePaperStyle('bordered')}
              className={`px-2 py-1 rounded text-[11px] font-['Cinzel'] transition-colors cursor-pointer ${
                paperStyle === 'bordered'
                  ? 'bg-rose-500 text-white font-semibold shadow-xs'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
              title="Floral Bordered"
            >
              Bordered
            </button>
            <button
              onClick={() => onChangePaperStyle('ruled')}
              className={`px-2 py-1 rounded text-[11px] font-['Cinzel'] transition-colors cursor-pointer ${
                paperStyle === 'ruled'
                  ? 'bg-rose-500 text-white font-semibold shadow-xs'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
              title="Lined Journal Paper"
            >
              Lined
            </button>
            <button
              onClick={() => onChangePaperStyle('dotted')}
              className={`px-2 py-1 rounded text-[11px] font-['Cinzel'] transition-colors cursor-pointer ${
                paperStyle === 'dotted'
                  ? 'bg-rose-500 text-white font-semibold shadow-xs'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
              title="Dotted Grid Paper"
            >
              Dotted
            </button>
          </div>
        </div>

        {/* Page Count Manager */}
        <div className="flex items-center gap-1.5">
          <span className="font-['Cinzel'] text-[11px] text-rose-700 font-semibold">
            PAGES ({totalPages}):
          </span>
          <div className="inline-flex items-center gap-1 bg-rose-50/60 border border-rose-200 rounded-lg p-0.5">
            <button
              onClick={onRemovePages}
              disabled={totalPages <= 4}
              title="Remove 2 Pages"
              className="p-1 text-rose-700 hover:text-rose-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-xs font-mono text-rose-800 font-bold">
              {totalPages}
            </span>
            <button
              onClick={onAddPages}
              disabled={totalPages >= 20}
              title="Add 2 Pages"
              className="p-1 text-rose-700 hover:text-rose-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Utilities: Clear, Audio, Petals, Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClearAllPages}
            title="Clear all pages"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100 transition-colors font-['Cinzel'] text-[11px] cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3 h-3 text-rose-600" />
            <span>Clear</span>
          </button>

          <button
            onClick={onTogglePetals}
            title={petalsEnabled ? 'Disable Petals' : 'Enable Petals'}
            className={`p-1.5 rounded-lg border border-rose-200 cursor-pointer transition-colors shadow-xs ${
              petalsEnabled ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? 'Mute Music' : 'Play Romantic Music'}
            className={`p-1.5 rounded-lg border border-rose-200 cursor-pointer transition-colors shadow-xs ${
              isAudioPlaying ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onCloseBook}
            title="Close Book to Cover"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-300 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 font-['Cinzel'] text-[11px] cursor-pointer shadow-xs"
          >
            <Book className="w-3 h-3 text-white" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
