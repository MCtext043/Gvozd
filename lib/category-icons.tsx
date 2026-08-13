import {
  Paintbrush,
  Home,
  Wrench,
  PaintBucket,
  Sofa,
  Layers,
  ScrollText,
  DoorOpen,
  Thermometer,
  Grid3x3,
  Droplets,
  Boxes,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Иконки корневых категорий каталога для mega-menu */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  dekor: Paintbrush,
  "dom-i-sad": Home,
  "instrument-i-specodezhda": Wrench,
  "lakokrasochnye-materialy": PaintBucket,
  mebel: Sofa,
  "napolnye-pokrytiya": Layers,
  oboi: ScrollText,
  "okna-i-dveri": DoorOpen,
  "otoplenie-i-klimat": Thermometer,
  plitka: Grid3x3,
  santehnika: Droplets,
  stroymaterialy: Boxes,
  strojmaterialy: Boxes,
  elektrotovary: Zap,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Boxes;
}
