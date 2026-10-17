import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize2,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  Image as ImageIcon,
  GripVertical,
} from 'lucide-react';
import { CanvasPhoto } from '../types/canvas';

interface PhotoFormattingBarProps {
  photoItem: CanvasPhoto;
  onUpdate: (updated: Partial<CanvasPhoto>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDeselect?: () => void;
  onStartDrag?: (e: React.PointerEvent) => void;
  isDragging?: boolean;
  isCustomPosition?: boolean;
  onResetPosition?: () => void;
}

export const PhotoFormattingBar: React.FC<PhotoFormattingBarProps> = ({
  photoItem,
  onUpdate,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onDeselect,
  onStartDrag,
  isDragging,
  isCustomPosition,
  onResetPosition,
}) => {
  const currentScale = photoItem.scale || 1.0;
  const currentRotation = ((photoItem.rotation || 0) % 360 + 360) % 360;

  const handleSetRotation = (deg: number) => {
    const normalized = ((Math.round(deg) % 360) + 360) % 360;
    onUpdate({ rotation: normalized });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        if (!target.closest('button, input, select, textarea, [data-prevent-drag="true"]')) {
          onStartDrag?.(e);
        }
      }}
      className={`flex flex-wrap items-center justify-center gap-1.5 p-2 bg-white/95 backdrop-blur-md border border-rose-300 rounded-xl shadow-[0_12px_36px_rgba(226,123,138,0.22)] text-xs text-stone-800 z-50 select-none max-w-full ${
        isDragging
          ? 'ring-2 ring-rose-400 scale-[1.02] cursor-grabbing'
          : 'cursor-default'
      }`}
    >
      {onStartDrag && (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            onStartDrag(e);
          }}
          className={`flex items-center gap-1 px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 text-rose-800 font-['Cinzel'] text-[10px] uppercase tracking-wider select-none touch-none shadow-xs transition-all group ${
            isDragging ? 'cursor-grabbing bg-rose-200 ring-1 ring-rose-400' : 'cursor-grab'
          }`}
          title="Drag to reposition toolbar"
        >
          <GripVertical className="w-3.5 h-3.5 text-rose-500 group-hover:text-rose-700" />
          <span className="font-bold">Drag</span>
        </div>
      )}

      <div
        onPointerDown={(e) => {
          e.stopPropagation();
          onStartDrag?.(e);
        }}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 font-['Cinzel'] text-[10px] uppercase tracking-wider select-none"
      >
        <ImageIcon className="w-3 h-3 text-rose-500" />
        <span className="font-bold">Photo</span>
      </div>

      {isCustomPosition && onResetPosition && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onResetPosition();
          }}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-['Cinzel'] text-[9px] uppercase cursor-pointer transition-colors shadow-xs"
          title="Snap back above photo"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span className="hidden sm:inline">Snap</span>
        </button>
      )}

      <div className="w-[1px] h-4 bg-rose-200 mx-0.5" />

      {/* Zoom In & Out */}
      <div className="flex items-center bg-rose-50/60 border border-rose-200 rounded p-0.5 shadow-inner">
        <button
          onClick={() => onUpdate({ scale: Math.max(0.3, Number((currentScale - 0.1).toFixed(2))) })}
          className="p-1 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded cursor-pointer transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="px-1 text-[10px] font-mono text-rose-900 min-w-[38px] text-center font-semibold">
          {Math.round(currentScale * 100)}%
        </span>
        <button
          onClick={() => onUpdate({ scale: Math.min(3.5, Number((currentScale + 0.1).toFixed(2))) })}
          className="p-1 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded cursor-pointer transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-[1px] h-4 bg-rose-200 mx-0.5" />

      {/* Rotation slider */}
      <div className="flex items-center gap-1 bg-rose-50/60 border border-rose-200 rounded px-1.5 py-0.5 shadow-inner">
        <span className="text-[10px] text-rose-700 uppercase font-['Cinzel'] flex items-center gap-0.5 font-semibold">
          <RotateCw className="w-3 h-3 text-rose-500" />
          <span>Angle:</span>
        </span>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={currentRotation}
          onChange={(e) => handleSetRotation(Number(e.target.value))}
          className="w-14 sm:w-20 h-1.5 accent-rose-500 cursor-pointer"
          title={`Rotate: ${currentRotation}°`}
        />
        <span className="px-1 text-[10px] font-mono text-rose-900 min-w-[32px] text-center font-semibold">
          {currentRotation}°
        </span>
        <button
          onClick={() => handleSetRotation(currentRotation - 15)}
          className="p-1 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded cursor-pointer"
          title="-15°"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <button
          onClick={() => handleSetRotation(currentRotation + 15)}
          className="p-1 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded cursor-pointer"
          title="+15°"
        >
          <RotateCw className="w-3 h-3" />
        </button>
      </div>

      <div className="w-[1px] h-4 bg-rose-200 mx-0.5" />

      {/* Fit vs Fill */}
      <button
        onClick={() => onUpdate({ objectFit: photoItem.objectFit === 'contain' ? 'cover' : 'contain' })}
        className={`px-2 py-1 rounded text-[10px] font-['Cinzel'] border border-rose-200 cursor-pointer transition-colors ${
          photoItem.objectFit === 'contain'
            ? 'bg-rose-500 text-white font-bold'
            : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
        }`}
        title="Toggle Fit / Fill"
      >
        <Maximize2 className="w-3 h-3 inline mr-1" />
        <span>{photoItem.objectFit === 'contain' ? 'Fit' : 'Fill'}</span>
      </button>

      {/* Layers */}
      <div className="flex items-center gap-0.5 bg-rose-50/60 border border-rose-200 rounded p-0.5">
        <button
          onClick={onBringForward}
          className="p-1 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded cursor-pointer"
          title="Bring Forward"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onSendBackward}
          className="p-1 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded cursor-pointer"
          title="Send Backward"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        onClick={onDuplicate}
        className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer shadow-xs"
        title="Duplicate"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={onDelete}
        className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 cursor-pointer shadow-xs"
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {onDeselect && (
        <button
          onClick={onDeselect}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white font-['Cinzel'] font-bold text-[10px] uppercase cursor-pointer ml-1 shadow-xs"
        >
          <Check className="w-3 h-3" />
          <span>Done</span>
        </button>
      )}
    </div>
  );
};
