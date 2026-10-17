import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Edit3,
  Check,
  Type,
  RotateCw,
  RotateCcw,
  GripVertical,
} from 'lucide-react';
import { CanvasText } from '../types/canvas';

interface TextFormattingBarProps {
  textItem: CanvasText;
  onUpdate: (updated: Partial<CanvasText>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onStartEditing?: () => void;
  onDeselect?: () => void;
  onStartDrag?: (e: React.PointerEvent) => void;
  isDragging?: boolean;
  isCustomPosition?: boolean;
  onResetPosition?: () => void;
}

const FONT_FAMILIES = [
  { label: 'Great Vibes', value: "'Great Vibes', cursive" },
  { label: 'Cormorant Garamond', value: "'Cormorant Garamond', serif" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Cinzel', value: "'Cinzel', serif" },
  { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Classic Serif', value: 'serif' },
];

const PRESET_COLORS = [
  { label: 'Deep Charcoal', value: '#1F2421' },
  { label: 'Dusty Rose', value: '#C45566' },
  { label: 'Rose Gold', value: '#C99A6E' },
  { label: 'Soft Plum', value: '#6B3B48' },
  { label: 'Sage Green', value: '#7C9872' },
  { label: 'Pure White', value: '#FFFFFF' },
];

const BG_COLORS = [
  { label: 'Transparent', value: 'transparent' },
  { label: 'Pure White', value: 'rgba(255, 255, 255, 0.95)' },
  { label: 'Blush Tint', value: 'rgba(253, 232, 236, 0.9)' },
  { label: 'Rose Gold Tint', value: 'rgba(245, 225, 205, 0.85)' },
  { label: 'Soft Sage Tint', value: 'rgba(235, 245, 230, 0.85)' },
];

export const TextFormattingBar: React.FC<TextFormattingBarProps> = ({
  textItem,
  onUpdate,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onStartEditing,
  onDeselect,
  onStartDrag,
  isDragging,
  isCustomPosition,
  onResetPosition,
}) => {
  const currentRotation = ((textItem.rotation || 0) % 360 + 360) % 360;

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
        <Type className="w-3 h-3 text-rose-500" />
        <span className="font-bold">Text</span>
      </div>

      {isCustomPosition && onResetPosition && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onResetPosition();
          }}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-['Cinzel'] text-[9px] uppercase cursor-pointer transition-colors shadow-xs"
          title="Snap back above text box"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span className="hidden sm:inline">Snap</span>
        </button>
      )}

      {onStartEditing && (
        <button
          onClick={onStartEditing}
          className="flex items-center gap-1 px-2 py-1 rounded bg-rose-500 text-white font-['Cinzel'] font-bold text-[10px] uppercase cursor-pointer hover:bg-rose-600 transition-colors shadow-xs"
          title="Edit Text"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>
      )}

      {/* Font Family */}
      <select
        value={textItem.fontFamily}
        onChange={(e) => onUpdate({ fontFamily: e.target.value })}
        className="px-2 py-1 bg-rose-50/70 border border-rose-200 rounded text-xs text-rose-900 font-serif cursor-pointer outline-none focus:border-rose-400"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      {/* Font Size */}
      <div className="flex items-center bg-rose-50/60 border border-rose-200 rounded px-1 shadow-inner">
        <button
          onClick={() => onUpdate({ fontSize: Math.max(10, textItem.fontSize - 2) })}
          className="p-1 text-rose-700 hover:text-rose-900 cursor-pointer"
          title="Decrease"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
        <span className="px-1 text-[11px] font-mono text-rose-900 min-w-[28px] text-center font-semibold">
          {textItem.fontSize}px
        </span>
        <button
          onClick={() => onUpdate({ fontSize: Math.min(96, textItem.fontSize + 2) })}
          className="p-1 text-rose-700 hover:text-rose-900 cursor-pointer"
          title="Increase"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
      </div>

      <div className="w-[1px] h-4 bg-rose-200 mx-0.5" />

      {/* Rotation */}
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
        />
        <span className="px-1 text-[10px] font-mono text-rose-900 min-w-[32px] text-center font-semibold">
          {currentRotation}°
        </span>
      </div>

      {/* Bold, Italic, Underline */}
      <div className="flex items-center gap-0.5 bg-rose-50/60 border border-rose-200 rounded p-0.5 shadow-inner">
        <button
          onClick={() => onUpdate({ bold: !textItem.bold })}
          className={`p-1 rounded cursor-pointer ${
            textItem.bold ? 'bg-rose-500 text-white font-bold' : 'text-rose-700 hover:bg-rose-100'
          }`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onUpdate({ italic: !textItem.italic })}
          className={`p-1 rounded cursor-pointer ${
            textItem.italic ? 'bg-rose-500 text-white font-bold' : 'text-rose-700 hover:bg-rose-100'
          }`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onUpdate({ underline: !textItem.underline })}
          className={`p-1 rounded cursor-pointer ${
            textItem.underline ? 'bg-rose-500 text-white font-bold' : 'text-rose-700 hover:bg-rose-100'
          }`}
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 bg-rose-50/60 border border-rose-200 rounded p-0.5 shadow-inner">
        <button
          onClick={() => onUpdate({ align: 'left' })}
          className={`p-1 rounded cursor-pointer ${
            textItem.align === 'left' ? 'bg-rose-500 text-white font-bold' : 'text-rose-700 hover:bg-rose-100'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onUpdate({ align: 'center' })}
          className={`p-1 rounded cursor-pointer ${
            textItem.align === 'center' ? 'bg-rose-500 text-white font-bold' : 'text-rose-700 hover:bg-rose-100'
          }`}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onUpdate({ align: 'right' })}
          className={`p-1 rounded cursor-pointer ${
            textItem.align === 'right' ? 'bg-rose-500 text-white font-bold' : 'text-rose-700 hover:bg-rose-100'
          }`}
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Text Colors */}
      <div className="flex items-center gap-1 bg-rose-50/60 border border-rose-200 rounded px-1.5 py-1">
        <span className="text-[10px] text-rose-700 uppercase font-['Cinzel'] font-semibold">Color:</span>
        <div className="flex items-center gap-1">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => onUpdate({ color: c.value })}
              style={{ backgroundColor: c.value }}
              title={c.label}
              className={`w-3.5 h-3.5 rounded-full border cursor-pointer ${
                textItem.color === c.value ? 'border-rose-600 scale-125 shadow-xs' : 'border-stone-300'
              }`}
            />
          ))}
          <input
            type="color"
            value={textItem.color.startsWith('#') ? textItem.color : '#1F2421'}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-4 h-4 rounded cursor-pointer bg-transparent border-0 p-0"
          />
        </div>
      </div>

      {/* Background Colors */}
      <div className="flex items-center gap-1 bg-rose-50/60 border border-rose-200 rounded px-1.5 py-1">
        <span className="text-[10px] text-rose-700 uppercase font-['Cinzel'] font-semibold">BG:</span>
        <div className="flex items-center gap-1">
          {BG_COLORS.map((bg) => (
            <button
              key={bg.value}
              onClick={() => onUpdate({ backgroundColor: bg.value })}
              style={{ backgroundColor: bg.value === 'transparent' ? '#fff' : bg.value }}
              title={bg.label}
              className={`w-3.5 h-3.5 rounded-full border cursor-pointer ${
                textItem.backgroundColor === bg.value ? 'border-rose-600 scale-125 shadow-xs' : 'border-stone-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Layer Order */}
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
