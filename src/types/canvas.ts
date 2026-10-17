export interface CanvasPhoto {
  id: string;
  type: 'photo';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  objectFit?: 'cover' | 'contain';
  zIndex: number;
  caption?: string;
}

export interface CanvasText {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  align: 'left' | 'center' | 'right';
  opacity: number;
  backgroundColor: string;
  zIndex: number;
}

export type CanvasItem = CanvasPhoto | CanvasText;
