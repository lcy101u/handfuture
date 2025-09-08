import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ImageFilter {
  id: string
  name: string
  nameEn: string
  effect: string
  canvas: (ctx: CanvasRenderingContext2D, imageData: ImageData) => ImageData
  preview: string // CSS filter for preview
}

interface ImageFilterState {
  activeFilter: string | null
  brightness: number
  contrast: number
  saturation: number
  blur: number
  sepia: number
  vintage: number
  sharpness: number
  temperature: number
  tint: number
  vignette: number
  setActiveFilter: (filterId: string | null) => void
  setBrightness: (value: number) => void
  setContrast: (value: number) => void
  setSaturation: (value: number) => void
  setBlur: (value: number) => void
  setSepia: (value: number) => void
  setVintage: (value: number) => void
  setSharpness: (value: number) => void
  setTemperature: (value: number) => void
  setTint: (value: number) => void
  setVignette: (value: number) => void
  resetFilters: () => void
  applyFiltersToCanvas: (canvas: HTMLCanvasElement, originalImageData: ImageData) => void
}

// Advanced filter algorithms
const applyBrightnessContrast = (imageData: ImageData, brightness: number, contrast: number): ImageData => {
  const data = imageData.data
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
  
  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness
    data[i] = Math.max(0, Math.min(255, data[i] + brightness))     // Red
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness)) // Green
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness)) // Blue
    
    // Apply contrast
    data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128))
    data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128))
    data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128))
  }
  
  return imageData
}

const applySaturation = (imageData: ImageData, saturation: number): ImageData => {
  const data = imageData.data
  const factor = saturation / 100
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    
    data[i] = Math.max(0, Math.min(255, gray + factor * (r - gray)))
    data[i + 1] = Math.max(0, Math.min(255, gray + factor * (g - gray)))
    data[i + 2] = Math.max(0, Math.min(255, gray + factor * (b - gray)))
  }
  
  return imageData
}

const applySepia = (imageData: ImageData, intensity: number): ImageData => {
  const data = imageData.data
  const factor = intensity / 100
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    const tr = 0.393 * r + 0.769 * g + 0.189 * b
    const tg = 0.349 * r + 0.686 * g + 0.168 * b
    const tb = 0.272 * r + 0.534 * g + 0.131 * b
    
    data[i] = Math.min(255, r + factor * (tr - r))
    data[i + 1] = Math.min(255, g + factor * (tg - g))
    data[i + 2] = Math.min(255, b + factor * (tb - b))
  }
  
  return imageData
}

const applySharpness = (imageData: ImageData, intensity: number): ImageData => {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height
  const factor = intensity / 100
  
  // Sharpening kernel
  const kernel = [
    0, -1 * factor, 0,
    -1 * factor, 1 + 4 * factor, -1 * factor,
    0, -1 * factor, 0
  ]
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) { // RGB channels only
        let sum = 0
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c
            sum += imageData.data[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
          }
        }
        data[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, sum))
      }
    }
  }
  
  return new ImageData(data, width, height)
}

const applyTemperature = (imageData: ImageData, temperature: number): ImageData => {
  const data = imageData.data
  const temp = temperature / 100
  
  for (let i = 0; i < data.length; i += 4) {
    if (temp > 0) {
      // Warmer - increase red, decrease blue
      data[i] = Math.min(255, data[i] * (1 + temp * 0.3))     // Red
      data[i + 2] = Math.max(0, data[i + 2] * (1 - temp * 0.3)) // Blue
    } else {
      // Cooler - decrease red, increase blue
      data[i] = Math.max(0, data[i] * (1 + temp * 0.3))      // Red
      data[i + 2] = Math.min(255, data[i + 2] * (1 - temp * 0.3)) // Blue
    }
  }
  
  return imageData
}

const applyVignette = (imageData: ImageData, intensity: number): ImageData => {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  const centerX = width / 2
  const centerY = height / 2
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)
  const vignetteStrength = intensity / 100
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      const vignetteFactor = 1 - (distance / maxDistance) * vignetteStrength
      const idx = (y * width + x) * 4
      
      data[idx] *= vignetteFactor     // Red
      data[idx + 1] *= vignetteFactor // Green
      data[idx + 2] *= vignetteFactor // Blue
    }
  }
  
  return imageData
}

export const useImageFilterStore = create<ImageFilterState>()(
  persist(
    (set, get) => ({
      activeFilter: null,
      brightness: 0,
      contrast: 0,
      saturation: 100,
      blur: 0,
      sepia: 0,
      vintage: 0,
      sharpness: 0,
      temperature: 0,
      tint: 0,
      vignette: 0,

      setActiveFilter: (filterId) => set({ activeFilter: filterId }),
      setBrightness: (value) => set({ brightness: value }),
      setContrast: (value) => set({ contrast: value }),
      setSaturation: (value) => set({ saturation: value }),
      setBlur: (value) => set({ blur: value }),
      setSepia: (value) => set({ sepia: value }),
      setVintage: (value) => set({ vintage: value }),
      setSharpness: (value) => set({ sharpness: value }),
      setTemperature: (value) => set({ temperature: value }),
      setTint: (value) => set({ tint: value }),
      setVignette: (value) => set({ vignette: value }),

      resetFilters: () => set({
        activeFilter: null,
        brightness: 0,
        contrast: 0,
        saturation: 100,
        blur: 0,
        sepia: 0,
        vintage: 0,
        sharpness: 0,
        temperature: 0,
        tint: 0,
        vignette: 0
      }),

      applyFiltersToCanvas: (canvas, originalImageData) => {
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let processedData = new ImageData(
          new Uint8ClampedArray(originalImageData.data),
          originalImageData.width,
          originalImageData.height
        )

        const state = get()

        // Apply filters in sequence
        if (state.brightness !== 0 || state.contrast !== 0) {
          processedData = applyBrightnessContrast(processedData, state.brightness, state.contrast)
        }

        if (state.saturation !== 100) {
          processedData = applySaturation(processedData, state.saturation)
        }

        if (state.sepia > 0) {
          processedData = applySepia(processedData, state.sepia)
        }

        if (state.sharpness !== 0) {
          processedData = applySharpness(processedData, state.sharpness)
        }

        if (state.temperature !== 0) {
          processedData = applyTemperature(processedData, state.temperature)
        }

        if (state.vignette > 0) {
          processedData = applyVignette(processedData, state.vignette)
        }

        // Apply CSS filters for blur and other effects
        ctx.filter = `
          blur(${state.blur}px)
          ${state.vintage > 0 ? `hue-rotate(${state.vintage * 3.6}deg) saturate(${100 - state.vintage * 0.5}%)` : ''}
          ${state.tint !== 0 ? `hue-rotate(${state.tint}deg)` : ''}
        `.trim()

        ctx.putImageData(processedData, 0, 0)
      }
    }),
    {
      name: 'image-filter-storage'
    }
  )
)

// Predefined filter presets
export const filterPresets: ImageFilter[] = [
  {
    id: 'original',
    name: '原圖',
    nameEn: 'Original',
    effect: 'none',
    canvas: (ctx, imageData) => imageData,
    preview: 'none'
  },
  {
    id: 'enhance',
    name: '增強',
    nameEn: 'Enhance',
    effect: 'brightness(110%) contrast(120%) saturate(110%)',
    canvas: (ctx, imageData) => {
      return applyBrightnessContrast(
        applySaturation(imageData, 110),
        10, 20
      )
    },
    preview: 'brightness(110%) contrast(120%) saturate(110%)'
  },
  {
    id: 'classic',
    name: '經典',
    nameEn: 'Classic',
    effect: 'sepia(30%) contrast(110%)',
    canvas: (ctx, imageData) => {
      return applyBrightnessContrast(
        applySepia(imageData, 30),
        0, 10
      )
    },
    preview: 'sepia(30%) contrast(110%)'
  },
  {
    id: 'vintage',
    name: '復古',
    nameEn: 'Vintage',
    effect: 'sepia(50%) hue-rotate(15deg) saturate(80%)',
    canvas: (ctx, imageData) => {
      return applySaturation(
        applySepia(imageData, 50),
        80
      )
    },
    preview: 'sepia(50%) hue-rotate(15deg) saturate(80%)'
  },
  {
    id: 'mystic',
    name: '神秘',
    nameEn: 'Mystic',
    effect: 'contrast(130%) saturate(150%) hue-rotate(270deg)',
    canvas: (ctx, imageData) => {
      return applyBrightnessContrast(
        applySaturation(imageData, 150),
        0, 30
      )
    },
    preview: 'contrast(130%) saturate(150%) hue-rotate(270deg)'
  },
  {
    id: 'gold',
    name: '黃金',
    nameEn: 'Golden',
    effect: 'sepia(80%) saturate(200%) hue-rotate(10deg) brightness(110%)',
    canvas: (ctx, imageData) => {
      return applyBrightnessContrast(
        applySaturation(
          applySepia(imageData, 80),
          200
        ),
        10, 0
      )
    },
    preview: 'sepia(80%) saturate(200%) hue-rotate(10deg) brightness(110%)'
  }
]