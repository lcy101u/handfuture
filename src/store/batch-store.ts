import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BatchImage {
  id: string;
  file: File;
  preview: string;
  processed: boolean;
  analysis?: any;
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    sharpen: number;
    hue: number;
    gamma: number;
    vignette: number;
    sepia: number;
  };
  processedCanvas?: HTMLCanvasElement;
  downloadUrl?: string;
}

export interface BatchProcessingState {
  images: BatchImage[];
  isProcessing: boolean;
  currentProcessingIndex: number;
  totalImages: number;
  completedImages: number;
  globalFilters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    sharpen: number;
    hue: number;
    gamma: number;
    vignette: number;
    sepia: number;
  };
  applyGlobalFilters: boolean;
  selectedPreset: string;
}

interface BatchStore extends BatchProcessingState {
  // Actions
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  clearBatch: () => void;
  startBatchProcessing: () => Promise<void>;
  stopBatchProcessing: () => void;
  updateGlobalFilters: (filters: Partial<BatchProcessingState['globalFilters']>) => void;
  toggleGlobalFilters: () => void;
  applyPresetToBatch: (preset: string) => void;
  updateImageFilters: (id: string, filters: Partial<BatchImage['filters']>) => void;
  exportBatch: () => void;
  reorderImages: (startIndex: number, endIndex: number) => void;
}

const defaultFilters = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  sharpen: 0,
  hue: 0,
  gamma: 0,
  vignette: 0,
  sepia: 0,
};

const presetFilters = {
  natural: { brightness: 5, contrast: 10, saturation: 5, sharpen: 15 },
  enhanced: { brightness: 10, contrast: 20, saturation: 15, sharpen: 25 },
  dramatic: { brightness: 15, contrast: 30, saturation: 20, sharpen: 30, vignette: 20 },
  vintage: { sepia: 40, contrast: 15, vignette: 25, saturation: -10 },
  professional: { contrast: 25, sharpen: 35, brightness: 8, gamma: 5 },
  mystical: { hue: 15, saturation: 25, contrast: 20, vignette: 30, brightness: 5 },
};

export const useBatchStore = create<BatchStore>()(
  persist(
    (set, get) => ({
      images: [],
      isProcessing: false,
      currentProcessingIndex: 0,
      totalImages: 0,
      completedImages: 0,
      globalFilters: { ...defaultFilters },
      applyGlobalFilters: false,
      selectedPreset: 'none',

      addImages: (files: File[]) => {
        const newImages: BatchImage[] = files.map((file, index) => ({
          id: `batch-${Date.now()}-${index}`,
          file,
          preview: URL.createObjectURL(file),
          processed: false,
          filters: { ...defaultFilters },
        }));

        set((state) => ({
          images: [...state.images, ...newImages],
          totalImages: state.images.length + newImages.length,
        }));
      },

      removeImage: (id: string) => {
        set((state) => {
          const imageToRemove = state.images.find(img => img.id === id);
          if (imageToRemove?.preview) {
            URL.revokeObjectURL(imageToRemove.preview);
          }
          if (imageToRemove?.downloadUrl) {
            URL.revokeObjectURL(imageToRemove.downloadUrl);
          }
          
          const newImages = state.images.filter(img => img.id !== id);
          return {
            images: newImages,
            totalImages: newImages.length,
            completedImages: Math.min(state.completedImages, newImages.length),
          };
        });
      },

      clearBatch: () => {
        const { images } = get();
        images.forEach(img => {
          if (img.preview) URL.revokeObjectURL(img.preview);
          if (img.downloadUrl) URL.revokeObjectURL(img.downloadUrl);
        });

        set({
          images: [],
          isProcessing: false,
          currentProcessingIndex: 0,
          totalImages: 0,
          completedImages: 0,
        });
      },

      startBatchProcessing: async () => {
        const { images, globalFilters, applyGlobalFilters } = get();
        
        set({ isProcessing: true, currentProcessingIndex: 0, completedImages: 0 });

        for (let i = 0; i < images.length; i++) {
          set({ currentProcessingIndex: i });
          
          const image = images[i];
          const filtersToApply = applyGlobalFilters ? globalFilters : image.filters!;

          try {
            // Simulate palm reading analysis
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Apply filters and create processed canvas
            const processedCanvas = await processImageWithFilters(image.file, filtersToApply);
            
            // Create download URL
            const downloadUrl = processedCanvas.toDataURL('image/png');

            // Generate mock analysis
            const analysis = generateMockAnalysis();

            set((state) => ({
              images: state.images.map(img => 
                img.id === image.id 
                  ? { 
                      ...img, 
                      processed: true, 
                      analysis,
                      processedCanvas,
                      downloadUrl,
                      filters: filtersToApply,
                    }
                  : img
              ),
              completedImages: i + 1,
            }));
          } catch (error) {
            console.error(`Error processing image ${image.id}:`, error);
          }
        }

        set({ isProcessing: false });
      },

      stopBatchProcessing: () => {
        set({ isProcessing: false });
      },

      updateGlobalFilters: (filters) => {
        set((state) => ({
          globalFilters: { ...state.globalFilters, ...filters },
        }));
      },

      toggleGlobalFilters: () => {
        set((state) => ({ applyGlobalFilters: !state.applyGlobalFilters }));
      },

      applyPresetToBatch: (preset: string) => {
        const presetValues = presetFilters[preset as keyof typeof presetFilters] || defaultFilters;
        
        set((state) => ({
          selectedPreset: preset,
          globalFilters: { ...defaultFilters, ...presetValues },
          images: state.images.map(img => ({
            ...img,
            filters: { ...defaultFilters, ...presetValues },
          })),
        }));
      },

      updateImageFilters: (id: string, filters) => {
        set((state) => ({
          images: state.images.map(img =>
            img.id === id ? { ...img, filters: { ...img.filters!, ...filters } } : img
          ),
        }));
      },

      exportBatch: () => {
        const { images } = get();
        const processedImages = images.filter(img => img.processed);
        
        if (processedImages.length === 0) return;

        // Create a zip-like export by downloading all images
        processedImages.forEach((img, index) => {
          if (img.downloadUrl) {
            const link = document.createElement('a');
            link.href = img.downloadUrl;
            link.download = `palm-reading-${index + 1}.png`;
            link.click();
          }
        });
      },

      reorderImages: (startIndex: number, endIndex: number) => {
        set((state) => {
          const newImages = [...state.images];
          const [reorderedItem] = newImages.splice(startIndex, 1);
          newImages.splice(endIndex, 0, reorderedItem);
          return { images: newImages };
        });
      },
    }),
    {
      name: 'batch-processing-storage',
      partialize: (state) => ({
        globalFilters: state.globalFilters,
        applyGlobalFilters: state.applyGlobalFilters,
        selectedPreset: state.selectedPreset,
      }),
    }
  )
);

// Helper functions
async function processImageWithFilters(file: File, filters: any): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply filters using CSS filter string
      const filterString = [
        `brightness(${100 + filters.brightness}%)`,
        `contrast(${100 + filters.contrast}%)`,
        `saturate(${100 + filters.saturation}%)`,
        `blur(${filters.blur}px)`,
        `hue-rotate(${filters.hue}deg)`,
        `sepia(${filters.sepia}%)`,
      ].join(' ');
      
      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);
      
      // Apply additional effects
      if (filters.sharpen > 0) {
        applySharpening(ctx, canvas.width, canvas.height, filters.sharpen);
      }
      
      if (filters.vignette > 0) {
        applyVignette(ctx, canvas.width, canvas.height, filters.vignette);
      }
      
      if (filters.gamma !== 0) {
        applyGammaCorrection(ctx, canvas.width, canvas.height, filters.gamma);
      }
      
      resolve(canvas);
    };
    img.src = URL.createObjectURL(file);
  });
}

function applySharpening(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  
  // Simple sharpening kernel
  const kernel = [
    0, -factor, 0,
    -factor, 1 + 4 * factor, -factor,
    0, -factor, 0
  ];
  
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        newData[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, sum));
      }
    }
  }
  
  const newImageData = new ImageData(newData, width, height);
  ctx.putImageData(newImageData, 0, 0);
}

function applyVignette(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  
  const alpha = intensity / 100;
  gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
  gradient.addColorStop(0.7, `rgba(0, 0, 0, ${alpha * 0.3})`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
  
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
}

function applyGammaCorrection(ctx: CanvasRenderingContext2D, width: number, height: number, gamma: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const gammaValue = 1 + (gamma / 100);
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.pow(data[i] / 255, 1 / gammaValue) * 255;     // R
    data[i + 1] = Math.pow(data[i + 1] / 255, 1 / gammaValue) * 255; // G
    data[i + 2] = Math.pow(data[i + 2] / 255, 1 / gammaValue) * 255; // B
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function generateMockAnalysis() {
  const categories = ['emotion', 'intelligence', 'career', 'energy'];
  const analysis: any = {};
  
  categories.forEach(category => {
    analysis[category] = {
      score: Math.floor(Math.random() * 40) + 60, // 60-99
      description: `Mock ${category} analysis based on palm lines and features.`,
      confidence: Math.floor(Math.random() * 20) + 80, // 80-99
    };
  });
  
  return analysis;
}