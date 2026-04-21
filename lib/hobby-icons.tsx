import {
  Guitar,
  Palette,
  Camera,
  ChefHat,
  Flower2,
  Code,
  PenTool,
  Pencil,
  Star,
  LucideIcon,
} from 'lucide-react'

export const hobbyIcons: Record<string, LucideIcon> = {
  guitar: Guitar,
  palette: Palette,
  camera: Camera,
  'chef-hat': ChefHat,
  'flower-2': Flower2,
  code: Code,
  'pen-tool': PenTool,
  pencil: Pencil,
  star: Star,
}

export function getHobbyIcon(iconName: string): LucideIcon {
  return hobbyIcons[iconName] || Star
}
