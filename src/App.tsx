import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlainPage, PaperStyle } from './components/PlainPage';
import { InsideCover } from './components/InsideCover';
import { BookControls } from './components/BookControls';
import { Particles } from './components/Particles';
import { Petals } from './components/Petals';
import { soundFx } from './utils/audio';
import { CanvasItem, CanvasPhoto } from './types/canvas';
import {
  BookOpen,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  FlipHorizontal2,
  Camera,
  Maximize,
  Minimize,
} from 'lucide-react';

export default function App() {
  const [totalPages, setTotalPages] = useState(8);
  const [flippedLeaves, setFlippedLeaves] = useState<number>(0);
  const [turningLeafIndex, setTurningLeafIndex] = useState<number | null>(null);
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('bordered');

  // Pre-seeded pages in the fresh, romantic wedding palette
  const [pagesData, setPagesData] = useState<Record<number, CanvasItem[]>>(() => {
    const init: Record<number, CanvasItem[]> = {};
    for (let i = 1; i <= 20; i++) init[i] = [];

    // Spread 1 (Pages 1 & 2)
    init[1] = [
      {
        id: 'seed-p1-title',
        type: 'text',
        text: 'Our Journey Begins',
        x: 10,
        y: 12,
        width: 80,
        height: 12,
        rotation: 0,
        fontFamily: "'Playfair Display', serif",
        fontSize: 26,
        bold: true,
        italic: false,
        underline: false,
        color: '#1F2421',
        align: 'center',
        opacity: 1.0,
        backgroundColor: 'transparent',
        zIndex: 1,
      },
      {
        id: 'seed-p1-desc',
        type: 'text',
        text: 'From the moment our eyes first met to the sacred day we promised our lives to one another, every step has been illuminated by laughter, deep friendship, and unconditional devotion.\n\n"Whatever our souls are made of, yours and mine are the same."',
        x: 12,
        y: 30,
        width: 76,
        height: 48,
        rotation: 0,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18,
        bold: false,
        italic: true,
        underline: false,
        color: '#4A3B40',
        align: 'center',
        opacity: 0.95,
        backgroundColor: 'transparent',
        zIndex: 2,
      },
    ];

    init[2] = [
      {
        id: 'seed-p2-title',
        type: 'text',
        text: 'Wedding Vows',
        x: 10,
        y: 12,
        width: 80,
        height: 12,
        rotation: 0,
        fontFamily: "'Great Vibes', cursive",
        fontSize: 32,
        bold: false,
        italic: false,
        underline: false,
        color: '#C45566',
        align: 'center',
        opacity: 1.0,
        backgroundColor: 'transparent',
        zIndex: 1,
      },
      {
        id: 'seed-p2-vow',
        type: 'text',
        text: 'I choose you today and every tomorrow.\nTo encourage your dreams,\nto stand steadfast beside you in storm and sunshine,\nand to cherish your heart with all my soul.',
        x: 12,
        y: 32,
        width: 76,
        height: 44,
        rotation: 0,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18,
        bold: false,
        italic: true,
        underline: false,
        color: '#1F2421',
        align: 'center',
        opacity: 0.95,
        backgroundColor: 'transparent',
        zIndex: 2,
      },
    ];

    // Spread 2 (Pages 3 & 4)
    init[3] = [
      {
        id: 'seed-p3-title',
        type: 'text',
        text: 'The Ceremony & First Dance',
        x: 10,
        y: 14,
        width: 80,
        height: 12,
        rotation: 0,
        fontFamily: "'Playfair Display', serif",
        fontSize: 24,
        bold: true,
        italic: false,
        underline: false,
        color: '#1F2421',
        align: 'center',
        opacity: 1.0,
        backgroundColor: 'transparent',
        zIndex: 1,
      },
      {
        id: 'seed-p3-quote',
        type: 'text',
        text: 'Surrounded by family and friends, beneath a canopy of flowers, we began our forever.\n\nMemories of music playing, warm smiles, and hearts overflowing with gratitude.',
        x: 12,
        y: 35,
        width: 76,
        height: 38,
        rotation: 0,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18,
        bold: false,
        italic: true,
        underline: false,
        color: '#4A3B40',
        align: 'center',
        opacity: 0.95,
        backgroundColor: 'transparent',
        zIndex: 2,
      },
    ];

    init[4] = [
      {
        id: 'seed-p4-title',
        type: 'text',
        text: 'To Many More Years',
        x: 10,
        y: 14,
        width: 80,
        height: 12,
        rotation: 0,
        fontFamily: "'Great Vibes', cursive",
        fontSize: 32,
        bold: false,
        italic: false,
        underline: false,
        color: '#C45566',
        align: 'center',
        opacity: 1.0,
        backgroundColor: 'transparent',
        zIndex: 1,
      },
      {
        id: 'seed-p4-message',
        type: 'text',
        text: 'May our days remain blessed with love, laughter, shared journeys, and quiet tenderness.\n\nHappy Wedding Anniversary, My Forever Love.',
        x: 12,
        y: 36,
        width: 76,
        height: 40,
        rotation: 0,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18,
        bold: false,
        italic: true,
        underline: false,
        color: '#1F2421',
        align: 'center',
        opacity: 0.95,
        backgroundColor: 'transparent',
        zIndex: 2,
      },
    ];

    return init;
  });

  const [activeTool, setActiveTool] = useState<'select' | 'text'>('select');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [petalsEnabled, setPetalsEnabled] = useState(true);
  const [clearToast, setClearToast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Book closed state
  const [isClosed, setIsClosed] = useState<boolean>(true);
  const [closedBy, setClosedBy] = useState<'front' | 'back'>('front');
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isFlippingCover, setIsFlippingCover] = useState<boolean>(false);

  // Mouse tilt for closed 3D book
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isBookHovered, setIsBookHovered] = useState(false);
  const bookContainerRef = useRef<HTMLDivElement | null>(null);
  const globalFileInputRef = useRef<HTMLInputElement | null>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement | null>(null);

  // Cover photo & text state (preserving PDF visual identity)
  const [coverImage, setCoverImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem('wedding_cover_image') || '/wedding_couple_fence.jpg';
    } catch {
      return '/wedding_couple_fence.jpg';
    }
  });

  const [coverSubtitle, setCoverSubtitle] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('wedding_cover_subtitle') ||
        'Planning the Perfect Day with Style'
      );
    } catch {
      return 'Planning the Perfect Day with Style';
    }
  });

  const [coverWishes, setCoverWishes] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('wedding_cover_wishes') ||
        'A Love-filled Guide to Your Wedding Journey'
      );
    } catch {
      return 'A Love-filled Guide to Your Wedding Journey';
    }
  });

  useEffect(() => {
    try {
      if (coverImage) localStorage.setItem('wedding_cover_image', coverImage);
    } catch {}
  }, [coverImage]);

  useEffect(() => {
    try {
      localStorage.setItem('wedding_cover_subtitle', coverSubtitle);
    } catch {}
  }, [coverSubtitle]);

  useEffect(() => {
    try {
      localStorage.setItem('wedding_cover_wishes', coverWishes);
    } catch {}
  }, [coverWishes]);

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCoverImage(result);
        soundFx.playPageTurnSound();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const totalLeaves = Math.ceil(totalPages / 2) + 1;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isClosed || !bookContainerRef.current) return;
    const rect = bookContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x, y });
    setIsBookHovered(true);
  };

  const handleMouseEnter = () => {
    if (isClosed) setIsBookHovered(true);
  };

  const handleMouseLeave = () => {
    setIsBookHovered(false);
    setMouseTilt({ x: 0, y: 0 });
  };

  const openBook = useCallback(() => {
    if (turningLeafIndex !== null || !isClosed || isClosing || isOpening || isFlippingCover) return;
    setIsBookHovered(false);
    setIsOpening(true);
    soundFx.playBookOpenSound();

    if (closedBy === 'back') {
      setClosedBy('front');
    }

    // Transition from closed single-book to open spread
    setIsClosed(false);
    setTurningLeafIndex(0);
    setFlippedLeaves(0);

    setTimeout(() => {
      setFlippedLeaves(1);
    }, 40);

    setTimeout(() => {
      setTurningLeafIndex(null);
      setIsOpening(false);
    }, 950);
  }, [turningLeafIndex, isClosed, isClosing, isOpening, isFlippingCover, closedBy]);

  const closeBook = useCallback(() => {
    if (turningLeafIndex !== null || isClosed || isClosing || isOpening || isFlippingCover) return;
    setActiveTool('select');
    setIsClosing(true);
    setClosedBy('front');

    // Keep flippedLeaves at 1 while cover swings closed so interior pages remain naturally visible until shut
    if (flippedLeaves > 1) {
      setFlippedLeaves(1);
    }

    soundFx.playPageTurnSound();

    setTimeout(() => {
      soundFx.playBookCloseSound();
    }, 720);

    setTimeout(() => {
      setFlippedLeaves(0);
      setIsClosed(true);
      setIsClosing(false);
    }, 900);
  }, [turningLeafIndex, isClosed, isClosing, isOpening, isFlippingCover, flippedLeaves]);

  // Flip Book Button handler: Toggle between Front and Back Cover
  const handleFlipBookCover = useCallback(() => {
    if (turningLeafIndex !== null || isClosing || isOpening || isFlippingCover) return;

    if (!isClosed) {
      setIsFlippingCover(true);
      closeBook();
      setTimeout(() => {
        soundFx.playPageTurnSound();
        setClosedBy('back');
        setTimeout(() => {
          setIsFlippingCover(false);
        }, 850);
      }, 920);
    } else {
      setIsFlippingCover(true);
      soundFx.playPageTurnSound();
      setClosedBy((prev) => (prev === 'front' ? 'back' : 'front'));
      setTimeout(() => {
        setIsFlippingCover(false);
      }, 850);
    }
  }, [isClosed, isClosing, isOpening, isFlippingCover, turningLeafIndex, closeBook]);

  const flipForward = useCallback(() => {
    if (turningLeafIndex !== null || isClosed || isClosing || isOpening || flippedLeaves >= totalLeaves) return;
    const leafToTurn = flippedLeaves;
    setTurningLeafIndex(leafToTurn);
    setFlippedLeaves((prev) => prev + 1);
    soundFx.playPageTurnSound();

    setTimeout(() => {
      setTurningLeafIndex(null);
    }, 850);
  }, [turningLeafIndex, isClosed, isClosing, isOpening, flippedLeaves, totalLeaves]);

  const flipBack = useCallback(() => {
    if (turningLeafIndex !== null || isClosed || isClosing || isOpening) return;
    if (flippedLeaves <= 1) {
      closeBook();
      return;
    }
    const leafToTurn = flippedLeaves - 1;
    setTurningLeafIndex(leafToTurn);
    setFlippedLeaves((prev) => Math.max(prev - 1, 1));
    soundFx.playPageTurnSound();

    setTimeout(() => {
      setTurningLeafIndex(null);
    }, 850);
  }, [turningLeafIndex, isClosed, isClosing, isOpening, flippedLeaves, closeBook]);

  const goToSpread = (targetSpread: number) => {
    if (turningLeafIndex !== null || isClosed || isClosing || isOpening) return;
    const targetFlipped = targetSpread + 1;
    if (targetFlipped === flippedLeaves) return;
    soundFx.playPageTurnSound();
    setFlippedLeaves(targetFlipped);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (isClosed) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openBook();
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          handleFlipBookCover();
        }
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        flipForward();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        flipBack();
      } else if (e.key === 'Escape') {
        closeBook();
      } else if (e.key === 't' || e.key === 'T') {
        setActiveTool((prev) => (prev === 'text' ? 'select' : 'text'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClosed, openBook, closeBook, flipForward, flipBack, handleFlipBookCover]);

  const handleUpdatePageItems = (pageNum: number, items: CanvasItem[]) => {
    setPagesData((prev) => ({
      ...prev,
      [pageNum]: items,
    }));
  };

  const handleClearAllPages = () => {
    const cleared: Record<number, CanvasItem[]> = {};
    for (let i = 1; i <= 20; i++) cleared[i] = [];
    setPagesData(cleared);
    setClearToast(true);
    soundFx.playPageTurnSound();
    setTimeout(() => setClearToast(false), 2400);
  };

  const handleToggleAudio = () => {
    const playing = soundFx.toggleAmbientMusic();
    setIsAudioPlaying(playing);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const [focusedPageNumber, setFocusedPageNumber] = useState<number>(1);

  const getActiveVisiblePageNumber = (): number => {
    if (flippedLeaves <= 1) return 1;
    const leftPage = (flippedLeaves - 1) * 2;
    const rightPage = leftPage + 1;
    if (focusedPageNumber === leftPage || focusedPageNumber === rightPage) {
      return focusedPageNumber;
    }
    return leftPage;
  };

  const handleToolbarAddPhotosClick = () => {
    globalFileInputRef.current?.click();
  };

  const handleGlobalFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 9);
    if (files.length === 0) return;

    const targetPage = getActiveVisiblePageNumber();
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

    const currentItems = pagesData[targetPage] || [];

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
            zIndex: currentItems.length + idx + 1,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newPhotos) => {
      handleUpdatePageItems(targetPage, [...currentItems, ...newPhotos]);
      if (globalFileInputRef.current) {
        globalFileInputRef.current.value = '';
      }
    });
  };

  // Tilt angles for closed 3D book
  const closedRotY = isBookHovered ? -16 + mouseTilt.x * 20 : -18;
  const closedRotX = isBookHovered ? 8 - mouseTilt.y * 16 : 8;

  // Render the front cover content (used in both closed single-book and open spread)
  const renderFrontCoverContent = () => (
    <div
      className="absolute inset-0 rounded-[4px] border border-rose-200/80 flex flex-col justify-between overflow-hidden bg-white"
      style={{
        boxShadow: `
          0 0 0 1px #C99A6E,
          0 0 0 3px #FFFFFF,
          0 0 0 5px #F5DFE4,
          inset 0 0 20px rgba(226,123,138,0.06)
        `,
      }}
    >
      {/* Paper grain */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(#C99A6E 1px, transparent 1px)`,
          backgroundSize: '12px 12px',
        }}
      />

      {/* Top Arched Floral Garland from PDF */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10 overflow-hidden">
        <svg viewBox="0 0 420 80" fill="none" className="w-full h-full">
          <path d="M0 16 Q80 4 160 22 Q210 12 260 22 Q340 4 420 16" stroke="#9DB594" strokeWidth="1.2" fill="none" />
          <path d="M20 28 Q100 12 180 30 Q210 20 240 30 Q320 12 400 28" stroke="#8EA885" strokeWidth="0.8" strokeDasharray="3 2" fill="none" />
          <path d="M4 4 Q28 4 36 24 M4 4 Q4 28 24 36" stroke="#E68A98" strokeWidth="1.5" />
          <path d="M416 4 Q392 4 384 24 M416 4 Q416 28 396 36" stroke="#E68A98" strokeWidth="1.5" />
          
          {/* Soft Pink Flowers */}
          <g transform="translate(42, 22)">
            <circle cx="0" cy="-6" r="4.5" fill="#F8B6C0" opacity="0.9" />
            <circle cx="6" cy="-2" r="4.5" fill="#F8B6C0" opacity="0.9" />
            <circle cx="4" cy="5" r="4.5" fill="#F8B6C0" opacity="0.9" />
            <circle cx="-4" cy="5" r="4.5" fill="#F8B6C0" opacity="0.9" />
            <circle cx="-6" cy="-2" r="4.5" fill="#F8B6C0" opacity="0.9" />
            <circle cx="0" cy="0" r="2.5" fill="#F5D678" />
          </g>
          <g transform="translate(110, 16)">
            <circle cx="0" cy="-5" r="4" fill="#FAD4DC" opacity="0.95" />
            <circle cx="5" cy="-2" r="4" fill="#FAD4DC" opacity="0.95" />
            <circle cx="3" cy="4" r="4" fill="#FAD4DC" opacity="0.95" />
            <circle cx="-3" cy="4" r="4" fill="#FAD4DC" opacity="0.95" />
            <circle cx="-5" cy="-2" r="4" fill="#FAD4DC" opacity="0.95" />
            <circle cx="0" cy="0" r="2" fill="#E68A98" />
          </g>
          <g transform="translate(210, 18)">
            <circle cx="0" cy="-7" r="5" fill="#F4A6B2" opacity="0.95" />
            <circle cx="7" cy="-2" r="5" fill="#F4A6B2" opacity="0.95" />
            <circle cx="4" cy="6" r="5" fill="#F4A6B2" opacity="0.95" />
            <circle cx="-4" cy="6" r="5" fill="#F4A6B2" opacity="0.95" />
            <circle cx="-7" cy="-2" r="5" fill="#F4A6B2" opacity="0.95" />
            <circle cx="0" cy="0" r="3" fill="#F5D678" />
          </g>
          <g transform="translate(310, 16)">
            <circle cx="0" cy="-5" r="4" fill="#FAD4DC" opacity="0.95" />
            <circle cx="5" cy="-2" r="4" fill="#FAD4DC" opacity="0.95" />
            <circle cx="3" cy="4" r="4" fill="#FAD4DC" opacity="0.95" />
            <circle cx="-3" cy="4" r="4" fill="#FAD4DC" opacity="0.95" />
            <circle cx="-5" cy="-2" r="4" fill="#FAD4DC" opacity="0.95" />
            <circle cx="0" cy="0" r="2" fill="#E68A98" />
          </g>
          <g transform="translate(378, 22)">
            <circle cx="0" cy="-6" r="4.5" fill="#F8B6C0" opacity="0.9" />
            <circle cx="6" cy="-2" r="4.5" fill="#F8B6C0" opacity="0.9" />
            <circle cx="4" cy="5" r="4.5" fill="#F8B6C0" opacity="0.9" />
            <circle cx="-4" cy="5" r="4.5" fill="#F8B6C0" opacity="0.9" />
            <circle cx="-6" cy="-2" r="4.5" fill="#F8B6C0" opacity="0.9" />
            <circle cx="0" cy="0" r="2.5" fill="#F5D678" />
          </g>
          <ellipse cx="75" cy="38" rx="4" ry="2.5" fill="#F8B6C0" opacity="0.8" transform="rotate(25 75 38)" />
          <ellipse cx="160" cy="45" rx="3.5" ry="2" fill="#F4A6B2" opacity="0.85" transform="rotate(-15 160 45)" />
          <ellipse cx="260" cy="42" rx="4" ry="2.2" fill="#F8B6C0" opacity="0.8" transform="rotate(35 260 42)" />
          <ellipse cx="345" cy="36" rx="3" ry="2" fill="#FAD4DC" opacity="0.9" transform="rotate(-30 345 36)" />
        </svg>
      </div>

      {/* Side vines */}
      <div className="absolute top-16 bottom-16 left-0 w-8 pointer-events-none z-10 opacity-80">
        <svg viewBox="0 0 30 400" fill="none" className="w-full h-full">
          <path d="M8 0 Q2 100 12 200 Q2 300 8 400" stroke="#9DB594" strokeWidth="1" fill="none" />
          <circle cx="10" cy="60" r="4" fill="#F8B6C0" />
          <circle cx="6" cy="140" r="3.5" fill="#FAD4DC" stroke="#E68A98" strokeWidth="0.5" />
          <circle cx="12" cy="230" r="4.5" fill="#F8B6C0" />
          <circle cx="8" cy="320" r="3.5" fill="#E68A98" />
        </svg>
      </div>
      <div className="absolute top-16 bottom-16 right-0 w-8 pointer-events-none z-10 opacity-80 -scale-x-100">
        <svg viewBox="0 0 30 400" fill="none" className="w-full h-full">
          <path d="M8 0 Q2 100 12 200 Q2 300 8 400" stroke="#9DB594" strokeWidth="1" fill="none" />
          <circle cx="10" cy="60" r="4" fill="#F8B6C0" />
          <circle cx="6" cy="140" r="3.5" fill="#FAD4DC" stroke="#E68A98" strokeWidth="0.5" />
          <circle cx="12" cy="230" r="4.5" fill="#F8B6C0" />
          <circle cx="8" cy="320" r="3.5" fill="#E68A98" />
        </svg>
      </div>

      {/* Hidden Photo Upload Input */}
      <input
        type="file"
        ref={coverPhotoInputRef}
        accept="image/*"
        className="hidden"
        data-no-book-open="true"
        onClick={(e) => e.stopPropagation()}
        onChange={handleCoverPhotoUpload}
      />

      {/* TOP SECTION: PDF Typography & Layout */}
      <div
        data-no-book-open="true"
        className="relative z-20 w-full flex flex-col items-center justify-center px-4 pt-5 sm:pt-7 pb-1 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Script: "Planning the Perfect Day with Style" */}
        <div className="w-full flex items-center justify-center">
          <input
            type="text"
            data-no-book-open="true"
            value={coverSubtitle}
            onChange={(e) => setCoverSubtitle(e.target.value)}
            placeholder="Planning the Perfect Day with Style"
            className="w-full max-w-[360px] bg-transparent border-b border-transparent hover:border-rose-300 focus:border-rose-400 focus:bg-rose-50/50 outline-none text-center font-['Great_Vibes',cursive] text-2xl sm:text-3xl text-[#2D2628] tracking-wide transition-all py-0.5"
          />
        </div>

        {/* Title: "WEDDING" / "ANNIVERSARY" */}
        <div className="w-full mt-1 flex flex-col items-center justify-center leading-none">
          <div className="font-['Playfair_Display',sans-serif] font-black text-3xl sm:text-4xl text-[#1F2421] tracking-[4px] uppercase">
            WEDDING
          </div>
          <div className="font-['Playfair_Display',sans-serif] font-black text-3xl sm:text-4xl text-[#1F2421] tracking-[4px] uppercase mt-0.5">
            ANNIVERSARY
          </div>
        </div>

        {/* Branch with Cherry Blossoms */}
        <div className="flex items-center justify-center gap-2 my-1 pointer-events-none">
          <svg viewBox="0 0 240 30" fill="none" className="w-56 h-6">
            <path d="M20 18 Q80 8 120 18 Q160 26 220 14" stroke="#8EA885" strokeWidth="1.2" />
            <circle cx="70" cy="14" r="5" fill="#F8B6C0" />
            <circle cx="70" cy="14" r="2" fill="#E68A98" />
            <circle cx="120" cy="20" r="6" fill="#F4A6B2" />
            <circle cx="120" cy="20" r="2.5" fill="#F5D678" />
            <circle cx="170" cy="18" r="5" fill="#F8B6C0" />
            <circle cx="170" cy="18" r="2" fill="#E68A98" />
          </svg>
        </div>

        {/* Divider Line */}
        <div className="w-full max-w-[340px] sm:max-w-[380px] flex items-center justify-center my-0.5">
          <div className="h-[1px] flex-1 bg-[#8A7365]/40" />
          <div className="mx-2 text-[#E68A98] text-xs">🌸</div>
          <div className="h-[1px] flex-1 bg-[#8A7365]/40" />
        </div>

        {/* Rose Bouquet Cluster */}
        <div className="flex items-center justify-center gap-1.5 my-0.5 pointer-events-none">
          <svg viewBox="0 0 160 26" fill="none" className="w-40 h-5">
            <circle cx="80" cy="13" r="7" fill="#F4A6B2" />
            <circle cx="80" cy="13" r="4" fill="#E68A98" />
            <circle cx="66" cy="14" r="5.5" fill="#F8B6C0" />
            <circle cx="94" cy="14" r="5.5" fill="#F8B6C0" />
            <path d="M52 16 Q60 10 66 14" stroke="#8EA885" strokeWidth="1.2" />
            <path d="M94 14 Q100 10 108 16" stroke="#8EA885" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      {/* BOTTOM SECTION: REAL PHOTOGRAPHIC WEDDING PORTRAIT WITH ROSES */}
      <div
        data-no-book-open="true"
        className="relative z-20 w-full h-[52%] px-4 pb-4 pt-0 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          data-no-book-open="true"
          className="relative group/coverphoto w-full h-full max-h-[270px] rounded-[2px] bg-stone-100 overflow-hidden flex flex-col items-center justify-center shadow-md cursor-pointer border border-stone-200"
          onClick={(e) => {
            e.stopPropagation();
            coverPhotoInputRef.current?.click();
          }}
        >
          {/* Photographic Wedding Couple Image */}
          <img
            src={coverImage || '/wedding_couple_fence.jpg'}
            alt="Wedding Couple"
            className="w-full h-full object-cover transition-transform duration-500 group-hover/coverphoto:scale-105"
            onError={(e) => {
              // Fallback to alternative image if needed
              const target = e.target as HTMLImageElement;
              if (target.src.indexOf('wedding_cover_photo.jpg') === -1) {
                target.src = '/wedding_cover_photo.jpg';
              }
            }}
          />

          {/* Surrounding Watercolor Pink Roses and Gerberas embracing the photo corners (from PDF) */}
          <div className="absolute -bottom-2 -left-2 w-28 h-28 pointer-events-none z-20">
            <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
              <ellipse cx="30" cy="80" rx="18" ry="10" fill="#7C9872" transform="rotate(-30 30 80)" />
              <ellipse cx="65" cy="95" rx="16" ry="9" fill="#8EA885" transform="rotate(25 65 95)" />
              <circle cx="45" cy="85" r="30" fill="#F8B6C0" opacity="0.95" />
              <circle cx="45" cy="85" r="22" fill="#F4A6B2" />
              <circle cx="43" cy="83" r="14" fill="#EE9BA8" />
              <circle cx="44" cy="84" r="7" fill="#E68A98" />
              <circle cx="75" cy="65" r="16" fill="#FAD4DC" />
            </svg>
          </div>
          <div className="absolute -bottom-2 -right-2 w-28 h-28 pointer-events-none z-20">
            <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
              <ellipse cx="75" cy="85" rx="18" ry="10" fill="#7C9872" transform="rotate(30 75 85)" />
              <circle cx="80" cy="80" r="32" fill="#F4A6B2" opacity="0.95" />
              <circle cx="80" cy="80" r="16" fill="#E68A98" />
              <circle cx="80" cy="80" r="8" fill="#F5D678" />
              <circle cx="55" cy="55" r="18" fill="#FAD4DC" />
            </svg>
          </div>

          {/* Change Photo Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/coverphoto:opacity-100 transition-opacity flex items-center justify-center gap-2 z-30">
            <button
              type="button"
              data-no-book-open="true"
              onClick={(e) => {
                e.stopPropagation();
                coverPhotoInputRef.current?.click();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white text-rose-800 text-xs font-semibold flex items-center gap-1.5 shadow-md border border-rose-200 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-rose-500" />
              <span>Change Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the back cover content
  const renderBackCoverContent = () => (
    <div
      className="absolute inset-0 rounded-[4px] border-2 border-[#C99A6E]/80 p-6 sm:p-8 flex flex-col items-center justify-between overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, #FFF9FA 0%, #FAEDF0 40%, #F5DFE4 75%, #F0CBD2 100%)',
        boxShadow: `
          0 0 0 2px #C99A6E,
          0 0 0 4px #F5DFE4,
          0 0 0 6px #C99A6E,
          inset 0 0 40px rgba(226,123,138,0.12)
        `,
      }}
    >
      <div
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(#C99A6E 1px, transparent 1px)`,
          backgroundSize: '12px 12px',
        }}
      />
      <div className="absolute inset-3 border-[1.5px] border-[#C99A6E]/60 rounded-[2px] pointer-events-none">
        <div className="absolute inset-1.5 border-[0.8px] border-[#E89BA4]/40 rounded-[1px]" />
      </div>

      {/* 4 Gold Filigrees */}
      <div className="absolute top-3 left-3 w-8 h-8 pointer-events-none text-[#C99A6E]">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M2 2L38 2L38 6L6 6L6 38L2 38Z" fill="currentColor" opacity="0.8" />
          <circle cx="8" cy="8" r="3" fill="#E89BA4" />
        </svg>
      </div>
      <div className="absolute top-3 right-3 w-8 h-8 pointer-events-none text-[#C99A6E] -scale-x-100">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M2 2L38 2L38 6L6 6L6 38L2 38Z" fill="currentColor" opacity="0.8" />
          <circle cx="8" cy="8" r="3" fill="#E89BA4" />
        </svg>
      </div>
      <div className="absolute bottom-3 left-3 w-8 h-8 pointer-events-none text-[#C99A6E] -scale-y-100">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M2 2L38 2L38 6L6 6L6 38L2 38Z" fill="currentColor" opacity="0.8" />
          <circle cx="8" cy="8" r="3" fill="#E89BA4" />
        </svg>
      </div>
      <div className="absolute bottom-3 right-3 w-8 h-8 pointer-events-none text-[#C99A6E] -scale-100">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M2 2L38 2L38 6L6 6L6 38L2 38Z" fill="currentColor" opacity="0.8" />
          <circle cx="8" cy="8" r="3" fill="#E89BA4" />
        </svg>
      </div>

      <div className="relative z-10 w-full pt-2 flex flex-col items-center">
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#C99A6E] to-transparent my-1.5" />
        <div className="font-['Great_Vibes'] text-xl text-[#C45566] tracking-wider">
          Eternal Memories
        </div>
      </div>

      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-radial from-[#FAD4DC]/60 via-[#F5DFE4]/30 to-transparent blur-md pointer-events-none" />
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <circle cx="100" cy="100" r="92" stroke="#C99A6E" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
            <circle cx="100" cy="100" r="84" stroke="#E89BA4" strokeWidth="1.5" opacity="0.8" />
            <circle cx="100" cy="100" r="64" stroke="#C99A6E" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            <circle cx="100" cy="100" r="44" stroke="#C99A6E" strokeWidth="1.2" fill="rgba(255, 245, 247, 0.85)" />
            <circle cx="92" cy="100" r="16" stroke="#C99A6E" strokeWidth="2.5" fill="none" />
            <circle cx="108" cy="100" r="16" stroke="#E27B8A" strokeWidth="2.5" fill="none" />
            <polygon points="108,82 112,87 104,87" fill="#E27B8A" />
          </svg>
        </div>

        <div className="font-['Playfair_Display'] text-xs sm:text-sm text-[#1F2421] tracking-[3px] uppercase font-bold mt-2">
          Wedding Anniversary
        </div>
        <div className="font-['Cormorant_Garamond'] text-xs text-[#5C4A4E] italic mt-1 max-w-[220px]">
          "A beautiful journey of two souls bound together in love and friendship."
        </div>
      </div>

      <div className="relative z-10 w-full pb-2 flex flex-col items-center">
        <div
          className="w-9 h-9 rounded-full border border-rose-300 bg-white flex items-center justify-center text-rose-600 transition-all duration-300 shadow-xs"
        >
          <BookOpen className="w-4 h-4 text-rose-600" />
        </div>
        <span className="font-['Cinzel'] text-[9px] text-[#A67C52] tracking-[2px] uppercase mt-1">
          Click to Open
        </span>
      </div>
    </div>
  );

  {/* Authentic Physical 3D Hardcover Book (Single Portrait Volume when closed) */}
  const renderClosedBook3D = () => {
    const rotY =
      closedBy === 'back'
        ? 180 + (isBookHovered ? -mouseTilt.x * 20 : 0)
        : isBookHovered
        ? -16 + mouseTilt.x * 20
        : -16;
    const rotX = isBookHovered ? 8 - mouseTilt.y * 16 : 8;
    const transZ = isBookHovered ? 24 : 0;
    const transY = isBookHovered ? -12 : 0;

    return (
      <div
        onClick={(e) => {
          const target = e.target as HTMLElement | null;
          if (
            target?.closest('[data-no-book-open]') ||
            target?.closest('button') ||
            target?.closest('input') ||
            target?.closest('textarea')
          ) {
            return;
          }
          openBook();
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative cursor-pointer ${
          !isBookHovered && !isFlippingCover ? 'animate-book-float' : ''
        }`}
        style={{
          perspective: '2600px',
          transformStyle: 'preserve-3d',
          width: 'min(420px, 85vw, calc((100dvh - 180px) / 1.38))',
          aspectRatio: '1 / 1.38',
        }}
      >
        {/* Soft Ambient Contact Drop Shadow underneath the closed book */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[92%] h-14 rounded-full pointer-events-none transition-all duration-500"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(140,48,66,0.3) 0%, rgba(140,48,66,0.1) 60%, transparent 80%)',
            filter: 'blur(16px)',
            transform: `translateX(${mouseTilt.x * 12}px) scale(${isBookHovered ? 0.95 : 0.85})`,
            opacity: isBookHovered ? 0.95 : 0.8,
          }}
        />

        {/* The 3D Physical Book Volume with all 6 faces */}
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(${transY}px) translateZ(${transZ}px)`,
            transition: isFlippingCover
              ? 'transform 850ms cubic-bezier(0.34, 1.25, 0.64, 1)'
              : isBookHovered
              ? 'transform 250ms ease-out'
              : 'transform 650ms ease-out',
          }}
        >
          {/* ================= FRONT COVER (Top Face) ================= */}
          <div
            className="absolute inset-0 rounded-[4px] overflow-hidden"
            style={{
              transform: 'translateZ(18px)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              boxShadow: '0 12px 36px rgba(196,85,102,0.22), 0 2px 10px rgba(0,0,0,0.06)',
            }}
          >
            {renderFrontCoverContent()}
          </div>

          {/* ================= BACK COVER (Bottom Face) ================= */}
          <div
            className="absolute inset-0 rounded-[4px] overflow-hidden"
            style={{
              transform: 'translateZ(-18px) rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              boxShadow: '0 12px 36px rgba(196,85,102,0.22), 0 2px 10px rgba(0,0,0,0.06)',
            }}
          >
            {renderBackCoverContent()}
          </div>

          {/* ================= 3D SPINE (Left Edge) ================= */}
          <div
            className="absolute top-0 bottom-0 left-0 w-[36px] pointer-events-none rounded-l-[3px] flex flex-col justify-between py-6 items-center overflow-hidden"
            style={{
              transformOrigin: 'left center',
              transform: 'rotateY(-90deg) translateZ(0px)',
              background: 'linear-gradient(90deg, #FAD4DC 0%, #F5B3BE 35%, #EE9BA8 65%, #FAD4DC 100%)',
              boxShadow: 'inset 0 0 10px rgba(196,85,102,0.35)',
            }}
          >
            {/* Top gold rib band */}
            <div className="w-full flex flex-col gap-1 px-0.5">
              <div className="w-full h-1 bg-gradient-to-r from-[#C99A6E] via-[#F5D678] to-[#C99A6E] shadow-xs" />
              <div className="w-full h-0.5 bg-[#C99A6E]/70" />
            </div>

            {/* Vertical Spine Title in gold foil */}
            <div className="my-auto transform rotate-90 whitespace-nowrap flex items-center gap-2">
              <span className="font-['Cinzel'] text-[10px] tracking-[4px] text-[#8C3042] font-bold uppercase drop-shadow-xs">
                ✦ WEDDING ANNIVERSARY ✦
              </span>
            </div>

            {/* Bottom gold rib band */}
            <div className="w-full flex flex-col gap-1 px-0.5">
              <div className="w-full h-0.5 bg-[#C99A6E]/70" />
              <div className="w-full h-1 bg-gradient-to-r from-[#C99A6E] via-[#F5D678] to-[#C99A6E] shadow-xs" />
            </div>
          </div>

          {/* ================= 3D FORE-EDGE (Right Open Paper Block) ================= */}
          <div
            className="absolute top-[4px] bottom-[4px] right-0 w-[34px] pointer-events-none rounded-r-[2px] overflow-hidden"
            style={{
              transformOrigin: 'right center',
              transform: 'rotateY(90deg) translateZ(0px)',
              background: `repeating-linear-gradient(
                to bottom,
                #FFFFFF 0px,
                #FFF8F9 1.5px,
                #F8E6E9 2.5px,
                #FFFFFF 4px
              )`,
              boxShadow: 'inset 3px 0 8px rgba(196,85,102,0.18), inset -3px 0 6px rgba(201,154,110,0.25)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#C99A6E]/20 via-transparent to-[#C99A6E]/20" />
          </div>

          {/* ================= 3D HEAD (Top Paper Block) ================= */}
          <div
            className="absolute top-0 left-[6px] right-[6px] h-[34px] pointer-events-none rounded-t-[2px] overflow-hidden"
            style={{
              transformOrigin: 'top center',
              transform: 'rotateX(90deg) translateZ(0px)',
              background: `repeating-linear-gradient(
                to right,
                #FFFFFF 0px,
                #FFF8F9 1.5px,
                #F8E6E9 2.5px,
                #FFFFFF 4px
              )`,
              boxShadow: 'inset 0 3px 8px rgba(196,85,102,0.18)',
            }}
          />

          {/* ================= 3D TAIL (Bottom Paper Block) ================= */}
          <div
            className="absolute bottom-0 left-[6px] right-[6px] h-[34px] pointer-events-none rounded-b-[2px] overflow-hidden"
            style={{
              transformOrigin: 'bottom center',
              transform: 'rotateX(-90deg) translateZ(0px)',
              background: `repeating-linear-gradient(
                to right,
                #FFFFFF 0px,
                #FFF8F9 1.5px,
                #F8E6E9 2.5px,
                #FFFFFF 4px
              )`,
              boxShadow: 'inset 0 -3px 8px rgba(196,85,102,0.18)',
            }}
          />

          {/* Silk Ribbon Bookmark */}
          <div
            className="absolute -bottom-8 left-[70%] w-4 h-12 bg-gradient-to-b from-[#E68A98] to-[#C45566] border-x border-[#C99A6E]/50 shadow-md pointer-events-none"
            style={{
              transform: 'translateZ(6px) rotate(4deg)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-screen h-[100dvh] w-full flex flex-col items-center justify-between p-2 sm:p-3 overflow-hidden select-none bg-[radial-gradient(ellipse_at_50%_25%,#FFF7F8_0%,#FAEEF1_50%,#F5DFE4_100%)] text-[#2D2628]">
      {/* Background Ambience */}
      <Particles />
      <Petals enabled={petalsEnabled} />

      {/* Global File Input */}
      <input
        ref={globalFileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleGlobalFileInputChange}
        className="hidden"
      />

      {/* Top Header */}
      <header className="relative z-30 w-full max-w-5xl flex items-center justify-between py-1.5 px-3 sm:px-4 rounded-full bg-white/85 backdrop-blur-md border border-rose-200/90 text-xs shadow-sm mb-1 sm:mb-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <div className="flex items-center gap-2">
            <h1 className="font-['Playfair_Display'] tracking-wide text-rose-900 font-bold text-xs sm:text-sm">
              Wedding Anniversary
            </h1>
            <span className="text-[10px] text-rose-600 hidden sm:inline">
              · 3D Keepsake Edition
            </span>
          </div>
        </div>

        {/* Status Indicator & Main Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/80 border border-rose-200 text-[11px] text-rose-800">
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span>
              {isClosed
                ? closedBy === 'back'
                  ? 'Hardcover Back View (Click book to open)'
                  : 'Hardcover Front View (Click book to open)'
                : activeTool === 'text'
                ? 'Text Tool Active (Click to place text)'
                : `Spread ${Math.max(0, flippedLeaves - 1)} Active`}
            </span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-1.5 rounded-full border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 transition-colors cursor-pointer shadow-xs"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {/* Flip Book Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFlipBookCover();
            }}
            title={closedBy === 'front' ? 'Rotate book to view Back Cover' : 'Rotate book to view Front Cover'}
            className="group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-rose-300 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-['Cinzel'] text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all shadow-[0_2px_12px_rgba(226,123,138,0.35)] hover:shadow-[0_4px_18px_rgba(226,123,138,0.5)]"
          >
            <FlipHorizontal2 className={`w-4 h-4 text-white transition-transform duration-500 ${closedBy === 'back' ? 'rotate-180' : 'group-hover:rotate-45'}`} />
            <span className="font-bold">
              {closedBy === 'front' ? 'Flip Book' : 'Flip to Front'}
            </span>
            <span className="pointer-events-none absolute -bottom-8 right-0 hidden group-hover:flex items-center px-2 py-0.5 rounded bg-white border border-rose-200 text-[10px] text-rose-800 whitespace-nowrap font-['Cinzel'] tracking-wide shadow-md z-50">
              {closedBy === 'front' ? 'Rotate to Back Cover' : 'Rotate to Front Cover'}
            </span>
          </button>

          {/* Open / Close Book Toggle */}
          <button
            onClick={isClosed ? openBook : closeBook}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-rose-300 bg-white hover:bg-rose-50 active:scale-95 text-rose-800 font-['Cinzel'] text-xs uppercase tracking-wider cursor-pointer transition-all shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-semibold">{isClosed ? 'Open Book' : 'Close Book'}</span>
          </button>
        </div>
      </header>

      {/* Clear Toast */}
      {clearToast && (
        <div className="fixed top-20 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-rose-300 text-rose-800 text-xs font-['Cinzel'] tracking-wider shadow-[0_8px_25px_rgba(226,123,138,0.3)] animate-bounce">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>All pages cleared to pristine paper!</span>
        </div>
      )}

      {/* Main 3D Book Stage */}
      <main
        ref={bookContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-20 w-full max-w-5xl flex-1 min-h-0 flex flex-col items-center justify-center my-auto py-1"
        style={{ perspective: '2600px' }}
      >
        {/* ================= 3D PHYSICAL BOOK STAGE ================= */}
        {isClosed && !isClosing ? (
          <div className="flex flex-col items-center justify-center">
            {renderClosedBook3D()}
            {/* Prompt when Book is Closed */}
            <div
              onClick={openBook}
              className="flex items-center gap-2 text-xs font-['Cinzel'] text-rose-800 tracking-[3px] uppercase mt-3 sm:mt-4 cursor-pointer hover:text-rose-950 transition-colors shrink-0"
            >
              <span className="w-10 h-[1px] bg-rose-300" />
              <span>✦ CLICK BOOK TO OPEN & READ ✦</span>
              <span className="w-10 h-[1px] bg-rose-300" />
            </div>
          </div>
        ) : (
          /* ================= 3D OPEN BOOK SPREAD ASSEMBLY ================= */
          <div
            className="relative aspect-[1.38/1]"
            style={{
              transformStyle: 'preserve-3d',
              width: 'min(880px, 94vw, calc((100dvh - 165px) * 1.38))',
              maxWidth: '100%',
            }}
          >
            {/* Main 3D Book Body with realistic opening/closing slide & tilt */}
            <div
              className="w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 900ms cubic-bezier(0.25, 1, 0.5, 1)',
                transform: isClosing
                  ? 'scale(0.88) rotateX(6deg) translateY(12px)'
                  : 'scale(1.0) rotateX(0deg) translateY(0)',
              }}
            >
              {/* Ambient Contact Shadow beneath the book */}
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[92%] h-14 bg-rose-950/20 rounded-full blur-2xl pointer-events-none"
                style={{
                  transition: 'opacity 900ms ease',
                  opacity: 0.6,
                }}
              />

              {/* ================= BOOK SPREAD ASSEMBLY ================= */}
              <div
                className="relative w-full h-full rounded-lg transition-shadow duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 25px 50px rgba(196,85,102,0.18)',
                }}
              >
                {/* Hardcover Base Underneath Right Half (Back cover board) */}
                <div
                  className="absolute top-0 right-0 w-1/2 h-full rounded-r-[6px] border-2 border-[#C99A6E]/80 pointer-events-none overflow-hidden"
                  style={{
                    transform: 'translateZ(-16px)',
                  }}
                >
                  {renderBackCoverContent()}
                </div>

                {/* Center Spine Crease */}
                <div
                  className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 sm:w-8 pointer-events-none z-60 flex flex-col items-center justify-between py-4"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(200,100,120,0.15) 0%, rgba(201,154,110,0.3) 50%, rgba(200,100,120,0.15) 100%)',
                    boxShadow: '0 0 10px rgba(200,100,120,0.2)',
                    transform: 'translateZ(2px)',
                  }}
                >
                  <div className="w-1 h-3 rounded-full bg-[#C99A6E]" />
                  <div className="w-1 h-3 rounded-full bg-[#C99A6E]" />
                  <div className="w-1 h-3 rounded-full bg-[#C99A6E]" />
                  <div className="w-1 h-3 rounded-full bg-[#C99A6E]" />
                </div>

                {/* ================= LEAF 0: THE PHYSICAL HARDCOVER FRONT (SWINGS IN 3D TO OPEN/CLOSE) ================= */}
                <div
                  className="absolute top-0 right-0 w-1/2 h-full"
                  style={{
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    transform:
                      isClosing || (isOpening && flippedLeaves === 0)
                        ? 'rotateY(0deg)'
                        : 'rotateY(-180deg)',
                    transition: 'transform 900ms cubic-bezier(0.25, 1, 0.5, 1)',
                    zIndex: isClosing || isOpening ? 100 : !isClosed ? 10 : 50,
                    willChange: 'transform',
                  }}
                >
                  {/* Front Face of Leaf 0: OUTSIDE FRONT COVER (Facing desk when open) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      transform: 'rotateY(0deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    {renderFrontCoverContent()}
                  </div>

                  {/* Back Face of Leaf 0: INSIDE FRONT COVER (Faces user on left half when open!) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <InsideCover side="front" onFlipForward={flipForward} onCloseBook={closeBook} />
                  </div>
                </div>

                {/* ================= LEAVES 1 TO N: INTERIOR PAGES ================= */}
                {Array.from({ length: Math.ceil(totalPages / 2) }).map((_, sheetIdx) => {
                  const leafIdx = sheetIdx + 1;
                  const frontPageNum = sheetIdx * 2 + 1;
                  const backPageNum = sheetIdx * 2 + 2;

                  const isLeafFlipped = flippedLeaves > leafIdx;
                  const isTurning = turningLeafIndex === leafIdx;

                  const zIndex = isTurning
                    ? 99
                    : isLeafFlipped
                    ? 10 + leafIdx
                    : 40 - leafIdx;

                  return (
                    <div
                      key={leafIdx}
                      className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
                      style={{
                        transformOrigin: 'left center',
                        transformStyle: 'preserve-3d',
                        transform: isLeafFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                        transition: 'transform 850ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease',
                        zIndex,
                        willChange: 'transform',
                        opacity: isFlippingCover ? 0 : 1,
                      }}
                    >
                      {/* Front Face: Odd Page (Right side) */}
                      <div
                        className="absolute inset-0 overflow-hidden pointer-events-auto"
                        style={{
                          transform: 'rotateY(0deg)',
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                      >
                        <PlainPage
                          pageNumber={frontPageNum}
                          side="right"
                          style={paperStyle}
                          items={pagesData[frontPageNum] || []}
                          onUpdateItems={(newItems) => handleUpdatePageItems(frontPageNum, newItems)}
                          activeTool={activeTool}
                          onToolReset={() => setActiveTool('select')}
                          onFocusPage={() => setFocusedPageNumber(frontPageNum)}
                        />

                        {/* Corner Turn Button */}
                        {!isClosed && !isClosing && (
                          <button
                            onClick={flipForward}
                            title="Next Page"
                            className="absolute bottom-3 right-3 w-8 h-8 z-30 group cursor-pointer flex items-center justify-center rounded-full bg-white/90 hover:bg-rose-50 border border-rose-200 text-rose-700 shadow-sm transition-all hover:scale-110"
                          >
                            <ChevronRight className="w-4 h-4 text-rose-600" />
                          </button>
                        )}
                      </div>

                      {/* Back Face: Even Page (Left side) */}
                      <div
                        className="absolute inset-0 overflow-hidden pointer-events-auto"
                        style={{
                          transform: 'rotateY(180deg)',
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                      >
                        <PlainPage
                          pageNumber={backPageNum}
                          side="left"
                          style={paperStyle}
                          items={pagesData[backPageNum] || []}
                          onUpdateItems={(newItems) => handleUpdatePageItems(backPageNum, newItems)}
                          activeTool={activeTool}
                          onToolReset={() => setActiveTool('select')}
                          onFocusPage={() => setFocusedPageNumber(backPageNum)}
                        />

                        {/* Corner Turn Button */}
                        {!isClosed && !isClosing && (
                          <button
                            onClick={flipBack}
                            title="Previous Page"
                            className="absolute bottom-3 left-3 w-8 h-8 z-30 group cursor-pointer flex items-center justify-center rounded-full bg-white/90 hover:bg-rose-50 border border-rose-200 text-rose-700 shadow-sm transition-all hover:scale-110"
                          >
                            <ChevronLeft className="w-4 h-4 text-rose-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Controls Toolbar when Book is Open */}
        {!isClosed && !isClosing && (
          <div
            className="w-full shrink-0"
            style={{
              width: 'min(880px, 94vw, calc((100dvh - 165px) * 1.38))',
              maxWidth: '100%',
            }}
          >
            <BookControls
              currentSpread={Math.max(0, flippedLeaves - 1)}
              totalSpreads={totalLeaves}
              onPrevSpread={flipBack}
              onNextSpread={flipForward}
              onGoToSpread={goToSpread}
              onCloseBook={closeBook}
              paperStyle={paperStyle}
              onChangePaperStyle={(s) => {
                setPaperStyle(s);
                soundFx.playPageTurnSound();
              }}
              onClearAllPages={handleClearAllPages}
              isAudioPlaying={isAudioPlaying}
              onToggleAudio={handleToggleAudio}
              petalsEnabled={petalsEnabled}
              onTogglePetals={() => setPetalsEnabled(!petalsEnabled)}
              totalPages={totalPages}
              onAddPages={() => setTotalPages((p) => Math.min(p + 2, 20))}
              onRemovePages={() => setTotalPages((p) => Math.max(p - 2, 4))}
              onAddPhotos={handleToolbarAddPhotosClick}
              onToggleTextTool={() => setActiveTool((prev) => (prev === 'text' ? 'select' : 'text'))}
              activeTool={activeTool}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-5xl text-center py-1 text-[11px] font-['Cinzel'] text-rose-700/80 flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-1 shrink-0">
        <span>✦ Keyboard: [←] Prev Page · [→] Next Page · [ESC] Close Book · [F] Flip Cover · [Space/Enter] Open Book ✦</span>
        <span>·</span>
        <span>Wedding Anniversary Keepsake</span>
      </footer>
    </div>
  );
}
