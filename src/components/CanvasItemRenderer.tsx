import React, { useState, useRef, useEffect } from 'react';
import { CanvasItem } from '../types/canvas';
import { RotateCw } from 'lucide-react';

interface CanvasItemRendererProps {
  item: CanvasItem;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: Partial<CanvasItem>) => void;
  canvasRectRef: React.RefObject<HTMLDivElement | null>;
  isEditingTextExternal?: boolean;
  onStopEditingText?: () => void;
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export const CanvasItemRenderer: React.FC<CanvasItemRendererProps> = ({
  item,
  isSelected,
  onSelect,
  onUpdate,
  canvasRectRef,
  isEditingTextExternal,
  onStopEditingText,
}) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const itemContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isEditingTextExternal && item.type === 'text') {
      setIsEditingText(true);
    }
  }, [isEditingTextExternal, item.type]);

  useEffect(() => {
    if (isEditingText && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditingText]);

  useEffect(() => {
    if (!isSelected) {
      setIsEditingText(false);
      onStopEditingText?.();
    }
  }, [isSelected, onStopEditingText]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-handle]')) return;
    if (isEditingText) return;

    e.stopPropagation();
    onSelect();

    if (!canvasRectRef.current) return;

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startItemX = item.x;
    const startItemY = item.y;
    const itemW = item.width;
    const itemH = item.height;
    let dragThresholdPassed = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const distX = Math.abs(moveEvent.clientX - startClientX);
      const distY = Math.abs(moveEvent.clientY - startClientY);

      if (!dragThresholdPassed) {
        if (distX > 3 || distY > 3) {
          dragThresholdPassed = true;
          setIsDragging(true);
        } else {
          return;
        }
      }

      if (!canvasRectRef.current) return;
      const currentCanvasRect = canvasRectRef.current.getBoundingClientRect();
      const deltaXPercent = ((moveEvent.clientX - startClientX) / currentCanvasRect.width) * 100;
      const deltaYPercent = ((moveEvent.clientY - startClientY) / currentCanvasRect.height) * 100;

      const maxX = Math.max(0, 100 - itemW);
      const maxY = Math.max(0, 100 - itemH);
      const newX = Math.max(0, Math.min(maxX, startItemX + deltaXPercent));
      const newY = Math.max(0, Math.min(maxY, startItemY + deltaYPercent));

      onUpdate({
        x: Number(newX.toFixed(2)),
        y: Number(newY.toFixed(2)),
      });
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleRotateStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();

    if (!itemContainerRef.current) return;
    const rect = itemContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setIsRotating(true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const rad = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
      let deg = rad * (180 / Math.PI) + 90;
      deg = ((Math.round(deg) % 360) + 360) % 360;

      onUpdate({ rotation: deg });
    };

    const onPointerUp = () => {
      setIsRotating(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleResizeStart = (e: React.PointerEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();

    if (!canvasRectRef.current) return;
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startItemX = item.x;
    const startItemY = item.y;
    const startItemW = item.width;
    const startItemH = item.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!canvasRectRef.current) return;
      const currentCanvasRect = canvasRectRef.current.getBoundingClientRect();
      const deltaX = ((moveEvent.clientX - startClientX) / currentCanvasRect.width) * 100;
      const deltaY = ((moveEvent.clientY - startClientY) / currentCanvasRect.height) * 100;

      let newX = startItemX;
      let newY = startItemY;
      let newW = startItemW;
      let newH = startItemH;

      if (handle.includes('e')) {
        newW = Math.max(6, Math.min(100 - startItemX, startItemW + deltaX));
      } else if (handle.includes('w')) {
        const potentialW = startItemW - deltaX;
        if (potentialW >= 6) {
          const potentialX = startItemX + deltaX;
          if (potentialX >= 0) {
            newW = potentialW;
            newX = potentialX;
          }
        }
      }

      if (handle.includes('s')) {
        newH = Math.max(5, Math.min(100 - startItemY, startItemH + deltaY));
      } else if (handle.includes('n')) {
        const potentialH = startItemH - deltaY;
        if (potentialH >= 5) {
          const potentialY = startItemY + deltaY;
          if (potentialY >= 0) {
            newH = potentialH;
            newY = potentialY;
          }
        }
      }

      onUpdate({
        x: Number(newX.toFixed(2)),
        y: Number(newY.toFixed(2)),
        width: Number(newW.toFixed(2)),
        height: Number(newH.toFixed(2)),
      });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'text') {
      setIsEditingText(true);
    }
  };

  const currentRotation = item.rotation || 0;

  return (
    <div
      ref={itemContainerRef}
      data-canvas-item="true"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      className={`absolute select-none transition-shadow ${
        isSelected
          ? 'ring-2 ring-[#D4AF37] ring-offset-1 ring-offset-transparent shadow-lg'
          : 'hover:ring-1 hover:ring-[#D4AF37]/60'
      }`}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.width}%`,
        height: `${item.height}%`,
        zIndex: item.zIndex,
        cursor: isEditingText ? 'text' : isDragging ? 'grabbing' : isRotating ? 'crosshair' : 'grab',
        touchAction: 'none',
        transform: `rotate(${currentRotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <div className="w-full h-full relative overflow-hidden rounded-[2px]">
        {item.type === 'photo' ? (
          <div className="w-full h-full relative overflow-hidden bg-black/5 flex items-center justify-center border border-[#D4AF37]/50 shadow-sm p-1 bg-white">
            <img
              src={item.src}
              alt="Page photo"
              draggable={false}
              className="w-full h-full pointer-events-none select-none transition-transform"
              style={{
                objectFit: item.objectFit || 'cover',
                transform: `scale(${item.scale || 1.0})`,
              }}
            />
          </div>
        ) : (
          <div
            className="w-full h-full p-2 overflow-hidden flex flex-col justify-center"
            style={{
              fontFamily: item.fontFamily,
              fontSize: `${item.fontSize}px`,
              fontWeight: item.bold ? 'bold' : 'normal',
              fontStyle: item.italic ? 'italic' : 'normal',
              textDecoration: item.underline ? 'underline' : 'none',
              color: item.color,
              textAlign: item.align,
              opacity: item.opacity,
              backgroundColor: item.backgroundColor,
              lineHeight: 1.35,
            }}
          >
            {isEditingText ? (
              <textarea
                ref={textareaRef}
                value={item.text}
                onChange={(e) => onUpdate({ text: e.target.value })}
                onBlur={() => {
                  setIsEditingText(false);
                  onStopEditingText?.();
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsEditingText(false);
                    onStopEditingText?.();
                  }
                }}
                className="w-full h-full bg-transparent resize-none outline-none border border-[#D4AF37] rounded p-1 leading-normal"
                style={{
                  fontFamily: item.fontFamily,
                  fontSize: `${item.fontSize}px`,
                  color: item.color,
                  textAlign: item.align,
                }}
              />
            ) : (
              <div className="w-full h-full break-words whitespace-pre-wrap select-none flex items-center justify-center">
                {item.text || (
                  <span className="opacity-40 italic text-sm">Double click to write...</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {isSelected && (
        <>
          <div className="absolute -inset-1 border-2 border-dashed border-[#E27B8A] pointer-events-none rounded shadow-[0_0_12px_rgba(226,123,138,0.45)]" />

          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[1.5px] h-6 bg-[#E27B8A] pointer-events-none z-40" />

          <div
            data-handle="rot"
            onPointerDown={handleRotateStart}
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-125 transition-transform shadow-[0_2px_8px_rgba(226,123,138,0.5)] z-50"
            title={`Rotate freely: ${currentRotation}°`}
          >
            <RotateCw className="w-3 h-3 text-white" />
          </div>

          <div
            data-handle="nw"
            onPointerDown={(e) => handleResizeStart(e, 'nw')}
            className="absolute -top-2.5 -left-2.5 w-4 h-4 bg-rose-400 border-2 border-white rounded-full cursor-nwse-resize z-50 hover:scale-125 transition-transform shadow-sm"
            title="Resize Top-Left"
          />
          <div
            data-handle="n"
            onPointerDown={(e) => handleResizeStart(e, 'n')}
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-400 border-2 border-white rounded-full cursor-ns-resize z-50 hover:scale-125 transition-transform shadow-sm"
            title="Resize Top"
          />
          <div
            data-handle="ne"
            onPointerDown={(e) => handleResizeStart(e, 'ne')}
            className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-rose-400 border-2 border-white rounded-full cursor-nesw-resize z-50 hover:scale-125 transition-transform shadow-sm"
            title="Resize Top-Right"
          />
          <div
            data-handle="e"
            onPointerDown={(e) => handleResizeStart(e, 'e')}
            className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-4 h-4 bg-rose-400 border-2 border-white rounded-full cursor-ew-resize z-50 hover:scale-125 transition-transform shadow-sm"
            title="Resize Right"
          />
          <div
            data-handle="se"
            onPointerDown={(e) => handleResizeStart(e, 'se')}
            className="absolute -bottom-2.5 -right-2.5 w-4 h-4 bg-rose-400 border-2 border-white rounded-full cursor-nwse-resize z-50 hover:scale-125 transition-transform shadow-sm"
            title="Resize Bottom-Right"
          />
          <div
            data-handle="s"
            onPointerDown={(e) => handleResizeStart(e, 's')}
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-400 border-2 border-white rounded-full cursor-ns-resize z-50 hover:scale-125 transition-transform shadow-sm"
            title="Resize Bottom"
          />
          <div
            data-handle="sw"
            onPointerDown={(e) => handleResizeStart(e, 'sw')}
            className="absolute -bottom-2.5 -left-2.5 w-4 h-4 bg-rose-400 border-2 border-white rounded-full cursor-nesw-resize z-50 hover:scale-125 transition-transform shadow-sm"
            title="Resize Bottom-Left"
          />
          <div
            data-handle="w"
            onPointerDown={(e) => handleResizeStart(e, 'w')}
            className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-4 h-4 bg-rose-400 border-2 border-white rounded-full cursor-ew-resize z-50 hover:scale-125 transition-transform shadow-sm"
            title="Resize Left"
          />
        </>
      )}
    </div>
  );
};
