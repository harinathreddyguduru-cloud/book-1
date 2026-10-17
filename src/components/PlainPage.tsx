import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Type, Trash2 } from 'lucide-react';
import { CanvasItem, CanvasPhoto, CanvasText } from '../types/canvas';
import { CanvasItemRenderer } from './CanvasItemRenderer';
import { TextFormattingBar } from './TextFormattingBar';
import { PhotoFormattingBar } from './PhotoFormattingBar';

export type PaperStyle = 'parchment' | 'ruled' | 'dotted' | 'bordered';

interface PlainPageProps {
  pageNumber: number;
  side: 'left' | 'right';
  style: PaperStyle;
  items: CanvasItem[];
  onUpdateItems: (newItems: CanvasItem[]) => void;
  activeTool?: 'select' | 'text';
  onToolReset?: () => void;
  onFocusPage?: () => void;
}

export const PlainPage: React.FC<PlainPageProps> = ({
  pageNumber,
  side,
  style,
  items = [],
  onUpdateItems,
  activeTool = 'select',
  onToolReset,
  onFocusPage,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isEditingActiveText, setIsEditingActiveText] = useState(false);
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const toolbarContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedItem = items.find((it) => it.id === selectedItemId);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 9);
    if (files.length === 0) return;

    const count = files.length;
    let cols = 1;
    let rows = 1;
    if (count === 2) {
      cols = 2;
      rows = 1;
    } else if (count >= 3 && count <= 4) {
      cols = 2;
      rows = 2;
    } else if (count >= 5 && count <= 6) {
      cols = 2;
      rows = 3;
    } else if (count >= 7) {
      cols = 3;
      rows = 3;
    }

    const marginX = 8;
    const marginY = 8;
    const availableW = 100 - marginX * 2;
    const availableH = 100 - marginY * 2;
    const gapX = cols > 1 ? 4 : 0;
    const gapY = rows > 1 ? 4 : 0;
    const itemW = (availableW - (cols - 1) * gapX) / cols;
    const itemH = (availableH - (rows - 1) * gapY) / rows;

    const readers = files.map((file, idx) => {
      return new Promise<CanvasPhoto>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const c = idx % cols;
          const r = Math.floor(idx / cols);
          const posX = marginX + c * (itemW + gapX);
          const posY = marginY + r * (itemH + gapY);

          resolve({
            id: `photo-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'photo',
            src: event.target?.result as string,
            x: Number(posX.toFixed(2)),
            y: Number(posY.toFixed(2)),
            width: Number(itemW.toFixed(2)),
            height: Number(itemH.toFixed(2)),
            scale: 1.0,
            rotation: 0,
            objectFit: 'cover',
            zIndex: items.length + idx + 1,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newPhotos) => {
      onFocusPage?.();
      const updated = [...items, ...newPhotos];
      onUpdateItems(updated);
      if (newPhotos.length > 0) {
        setSelectedItemId(newPhotos[0].id);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  const addTextBox = (atX: number = 25, atY: number = 35) => {
    onFocusPage?.();
    const newText: CanvasText = {
      id: `text-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'text',
      text: 'Our treasured memory...',
      x: Math.max(5, Math.min(55, atX)),
      y: Math.max(5, Math.min(75, atY)),
      width: 44,
      height: 18,
      rotation: 0,
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 22,
      bold: false,
      italic: false,
      underline: false,
      color: '#2D2628',
      align: 'center',
      opacity: 1.0,
      backgroundColor: 'transparent',
      zIndex: items.length + 1,
    };
    onUpdateItems([...items, newText]);
    setSelectedItemId(newText.id);
    onToolReset?.();
  };

  const handlePageClick = (e: React.MouseEvent) => {
    onFocusPage?.();
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-interactive-toolbar]') ||
      target.closest('[data-canvas-item]') ||
      target.closest('[data-handle]') ||
      target.closest('button')
    ) {
      return;
    }

    if (activeTool === 'text' && canvasContainerRef.current) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100 - 22;
      const clickYPercent = ((e.clientY - rect.top) / rect.height) * 100 - 9;
      addTextBox(clickXPercent, clickYPercent);
    } else {
      setSelectedItemId(null);
      setIsEditingActiveText(false);
      setToolbarPos(null);
    }
  };

  const handleUpdateItem = (itemId: string, updatedProps: Partial<CanvasItem>) => {
    const next = items.map((it) => (it.id === itemId ? ({ ...it, ...updatedProps } as CanvasItem) : it));
    onUpdateItems(next);
  };

  const handleDuplicateItem = (itemId: string) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const duplicated: CanvasItem = {
      ...target,
      id: `${target.type}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      x: Math.min(85, target.x + 4),
      y: Math.min(85, target.y + 4),
      zIndex: items.length + 1,
    };
    onUpdateItems([...items, duplicated]);
    setSelectedItemId(duplicated.id);
  };

  const handleDeleteItem = (itemId: string) => {
    onUpdateItems(items.filter((it) => it.id !== itemId));
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
      setIsEditingActiveText(false);
      setToolbarPos(null);
    }
  };

  const handleBringForward = (itemId: string) => {
    const sorted = [...items].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sorted.findIndex((it) => it.id === itemId);
    if (currentIndex === -1 || currentIndex === sorted.length - 1) return;

    const nextItem = sorted[currentIndex + 1];
    sorted[currentIndex] = nextItem;
    sorted[currentIndex + 1] = items.find((it) => it.id === itemId)!;

    const reindexed = sorted.map((it, idx) => ({
      ...it,
      zIndex: idx + 1,
    }));
    onUpdateItems(reindexed);
  };

  const handleSendBackward = (itemId: string) => {
    const sorted = [...items].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sorted.findIndex((it) => it.id === itemId);
    if (currentIndex === -1 || currentIndex === 0) return;

    const prevItem = sorted[currentIndex - 1];
    sorted[currentIndex] = prevItem;
    sorted[currentIndex - 1] = items.find((it) => it.id === itemId)!;

    const reindexed = sorted.map((it, idx) => ({
      ...it,
      zIndex: idx + 1,
    }));
    onUpdateItems(reindexed);
  };

  const handleStartDragToolbar = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!canvasContainerRef.current || !toolbarContainerRef.current) return;
    const canvasRect = canvasContainerRef.current.getBoundingClientRect();
    const barRect = toolbarContainerRef.current.getBoundingClientRect();

    setIsDraggingToolbar(true);

    const startClientX = e.clientX;
    const startClientY = e.clientY;

    const currentCenterX = barRect.left + barRect.width / 2;
    const currentCenterY = barRect.top + barRect.height / 2;

    const startXPercent = ((currentCenterX - canvasRect.left) / canvasRect.width) * 100;
    const startYPercent = ((currentCenterY - canvasRect.top) / canvasRect.height) * 100;

    setToolbarPos({
      x: Number(startXPercent.toFixed(2)),
      y: Number(startYPercent.toFixed(2)),
    });

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!canvasContainerRef.current) return;
      const currentCanvasRect = canvasContainerRef.current.getBoundingClientRect();
      const deltaX = moveEvent.clientX - startClientX;
      const deltaY = moveEvent.clientY - startClientY;

      const deltaXPercent = (deltaX / currentCanvasRect.width) * 100;
      const deltaYPercent = (deltaY / currentCanvasRect.height) * 100;

      const newX = Math.max(10, Math.min(90, startXPercent + deltaXPercent));
      const newY = Math.max(-8, Math.min(108, startYPercent + deltaYPercent));

      setToolbarPos({
        x: Number(newX.toFixed(2)),
        y: Number(newY.toFixed(2)),
      });
    };

    const onPointerUp = () => {
      setIsDraggingToolbar(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const isAbove = selectedItem ? selectedItem.y >= 22 : true;
  const itemCenterX = selectedItem ? selectedItem.x + selectedItem.width / 2 : 50;
  const horizontalJustify =
    itemCenterX < 35 ? 'justify-start' : itemCenterX > 65 ? 'justify-end' : 'justify-center';

  return (
    <div
      ref={pageContainerRef}
      onClick={handlePageClick}
      className={`relative w-full h-full select-none transition-colors duration-300 flex flex-col justify-between overflow-hidden p-5 sm:p-7 ${
        activeTool === 'text' ? 'cursor-crosshair' : 'cursor-default'
      } ${
        side === 'left'
          ? 'shadow-[inset_-16px_0_24px_rgba(0,0,0,0.05)]'
          : 'shadow-[inset_16px_0_24px_rgba(0,0,0,0.05)]'
      }`}
      style={{
        background:
          side === 'left'
            ? 'linear-gradient(200deg, #FFFFFF 0%, #FFF9FA 50%, #FAF0F2 100%)'
            : 'linear-gradient(160deg, #FFFFFF 0%, #FFF9FA 50%, #FAF0F2 100%)',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(rgba(201, 154, 110, 0.12) 1px, transparent 0)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Spine gutter shadow */}
      <div
        className={`absolute top-0 bottom-0 pointer-events-none z-10 w-8 ${
          side === 'left'
            ? 'right-0 bg-gradient-to-l from-rose-900/10 via-rose-900/3 to-transparent'
            : 'left-0 bg-gradient-to-r from-rose-900/10 via-rose-900/3 to-transparent'
        }`}
      />

      {/* Outer edge shadow */}
      <div
        className={`absolute top-0 bottom-0 pointer-events-none z-10 w-4 ${
          side === 'left'
            ? 'left-0 bg-gradient-to-r from-rose-900/5 to-transparent'
            : 'right-0 bg-gradient-to-l from-rose-900/5 to-transparent'
        }`}
      />

      {/* Bordered style */}
      {style === 'bordered' && (
        <>
          <div className="absolute inset-4 border-[1.2px] border-[#C99A6E]/50 pointer-events-none z-10 rounded-[2px]">
            <div className="absolute inset-1.5 border-[0.5px] border-[#E89BA4]/35 pointer-events-none" />
          </div>
          <div className="absolute top-4 left-4 w-7 h-7 pointer-events-none z-10 text-[#C99A6E]">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M2 2L30 2L30 5L5 5L5 30L2 30Z" fill="currentColor" fillOpacity="0.8" />
              <circle cx="7" cy="7" r="2.5" fill="#E89BA4" />
            </svg>
          </div>
          <div className="absolute top-4 right-4 w-7 h-7 pointer-events-none z-10 text-[#C99A6E] -scale-x-100">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M2 2L30 2L30 5L5 5L5 30L2 30Z" fill="currentColor" fillOpacity="0.8" />
              <circle cx="7" cy="7" r="2.5" fill="#E89BA4" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-4 w-7 h-7 pointer-events-none z-10 text-[#C99A6E] -scale-y-100">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M2 2L30 2L30 5L5 5L5 30L2 30Z" fill="currentColor" fillOpacity="0.8" />
              <circle cx="7" cy="7" r="2.5" fill="#E89BA4" />
            </svg>
          </div>
          <div className="absolute bottom-4 right-4 w-7 h-7 pointer-events-none z-10 text-[#C99A6E] -scale-100">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M2 2L30 2L30 5L5 5L5 30L2 30Z" fill="currentColor" fillOpacity="0.8" />
              <circle cx="7" cy="7" r="2.5" fill="#E89BA4" />
            </svg>
          </div>
        </>
      )}

      {/* Ruled style */}
      {style === 'ruled' && (
        <div
          className="absolute inset-x-8 top-12 bottom-12 pointer-events-none z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, rgba(201, 154, 110, 0.15) 28px)`,
          }}
        />
      )}

      {/* Dotted style */}
      {style === 'dotted' && (
        <div
          className="absolute inset-8 pointer-events-none z-0"
          style={{
            backgroundImage: `radial-gradient(rgba(201, 154, 110, 0.16) 1.2px, transparent 1.2px)`,
            backgroundSize: '20px 20px',
          }}
        />
      )}

      {/* Page Header */}
      <div
        data-interactive-toolbar="true"
        className="relative z-30 flex justify-between items-center text-xs text-[#C45566]"
      >
        <span className="text-[10px] sm:text-[11px] font-['Cinzel'] tracking-[3px] text-[#A67C52] uppercase font-semibold">
          ✦ PAGE {pageNumber} ✦
        </span>

        <div className="flex items-center gap-1 bg-white/90 border border-rose-200 rounded-lg p-0.5 shadow-xs">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 font-['Cinzel'] text-[10px] tracking-wider uppercase cursor-pointer transition-all shadow-xs border border-rose-200/60"
            title="Add Photos (1-9 images)"
          >
            <ImageIcon className="w-3 h-3 text-rose-500" />
            <span className="hidden sm:inline">Add Photos</span>
          </button>

          <button
            onClick={() => addTextBox(25, 35)}
            className={`flex items-center gap-1 px-2 py-1 rounded font-['Cinzel'] text-[10px] tracking-wider uppercase cursor-pointer transition-all shadow-xs ${
              activeTool === 'text'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/60'
            }`}
            title="Add Text Box"
          >
            <Type className="w-3 h-3 text-rose-500" />
            <span className="hidden sm:inline">Text</span>
          </button>

          {items.length > 0 && (
            <button
              onClick={() => {
                onUpdateItems([]);
                setSelectedItemId(null);
                setToolbarPos(null);
              }}
              className="p-1 rounded text-rose-600 hover:text-rose-900 hover:bg-rose-50 cursor-pointer transition-colors"
              title="Clear Page"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Canvas */}
      <div
        ref={canvasContainerRef}
        className="relative z-20 flex-1 my-2 overflow-visible"
      >
        {items.map((item) => (
          <CanvasItemRenderer
            key={item.id}
            item={item}
            isSelected={selectedItemId === item.id}
            onSelect={() => setSelectedItemId(item.id)}
            onUpdate={(updated) => handleUpdateItem(item.id, updated)}
            canvasRectRef={canvasContainerRef}
            isEditingTextExternal={selectedItemId === item.id && isEditingActiveText}
            onStopEditingText={() => setIsEditingActiveText(false)}
          />
        ))}

        {selectedItem && (
          <div
            ref={toolbarContainerRef}
            data-interactive-toolbar="true"
            className={`absolute pointer-events-auto flex flex-col items-center ${
              toolbarPos ? 'z-50' : `z-50 ${horizontalJustify}`
            } ${isDraggingToolbar ? 'select-none cursor-grabbing transition-none' : 'transition-all duration-150'}`}
            style={
              toolbarPos
                ? {
                    left: `${toolbarPos.x}%`,
                    top: `${toolbarPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 'max-content',
                    maxWidth: 'calc(100% - 16px)',
                  }
                : {
                    left: '2px',
                    right: '2px',
                    ...(isAbove
                      ? {
                          top: `${selectedItem.y}%`,
                          transform: 'translateY(-100%) translateY(-48px)',
                        }
                      : {
                          top: `${selectedItem.y + selectedItem.height}%`,
                          transform: 'translateY(24px)',
                        }),
                  }
            }
          >
            <div className="flex flex-col items-center max-w-full">
              {selectedItem.type === 'text' ? (
                <TextFormattingBar
                  textItem={selectedItem}
                  onUpdate={(updated) => handleUpdateItem(selectedItem.id, updated)}
                  onDuplicate={() => handleDuplicateItem(selectedItem.id)}
                  onDelete={() => handleDeleteItem(selectedItem.id)}
                  onBringForward={() => handleBringForward(selectedItem.id)}
                  onSendBackward={() => handleSendBackward(selectedItem.id)}
                  onStartEditing={() => setIsEditingActiveText(true)}
                  onDeselect={() => {
                    setSelectedItemId(null);
                    setIsEditingActiveText(false);
                    setToolbarPos(null);
                  }}
                  onStartDrag={handleStartDragToolbar}
                  isDragging={isDraggingToolbar}
                  isCustomPosition={Boolean(toolbarPos)}
                  onResetPosition={() => setToolbarPos(null)}
                />
              ) : (
                <PhotoFormattingBar
                  photoItem={selectedItem}
                  onUpdate={(updated) => handleUpdateItem(selectedItem.id, updated)}
                  onDuplicate={() => handleDuplicateItem(selectedItem.id)}
                  onDelete={() => handleDeleteItem(selectedItem.id)}
                  onBringForward={() => handleBringForward(selectedItem.id)}
                  onSendBackward={() => handleSendBackward(selectedItem.id)}
                  onDeselect={() => {
                    setSelectedItemId(null);
                    setToolbarPos(null);
                  }}
                  onStartDrag={handleStartDragToolbar}
                  isDragging={isDraggingToolbar}
                  isCustomPosition={Boolean(toolbarPos)}
                  onResetPosition={() => setToolbarPos(null)}
                />
              )}

              {!toolbarPos && (
                <div
                  className="w-full flex"
                  style={{
                    paddingLeft: `${Math.max(4, Math.min(96, itemCenterX))}%`,
                  }}
                >
                  {isAbove ? (
                    <div className="w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-rose-400 -translate-x-1/2 drop-shadow-xs" />
                  ) : (
                    <div className="w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-rose-400 -translate-x-1/2 drop-shadow-xs order-first -mt-1" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none opacity-30">
            <div className="flex items-center gap-2 text-xs font-['Cinzel'] tracking-widest text-[#C45566] uppercase">
              <span>✦ Add Wedding Photos & Notes ✦</span>
            </div>
          </div>
        )}
      </div>

      {/* Page Folio */}
      <div className="relative z-20 flex justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 text-xs text-[#A67C52] font-['Cinzel'] tracking-widest opacity-80">
          <span className="text-[9px] text-rose-400">•</span>
          <span>{pageNumber}</span>
          <span className="text-[9px] text-rose-400">•</span>
        </div>
      </div>
    </div>
  );
};
