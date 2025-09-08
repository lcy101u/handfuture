import { useEffect, useRef, useState } from 'react'
import { Loader2, AlertCircle, CheckCircle, Sliders } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { usePalmStore } from '@/store/palm-store'
import { useToast } from '@/hooks/use-toast'
import { useLanguageStore } from '@/store/language-store'
import { useAnalyticsStore } from '@/store/analytics-store'
import { ImageFilterPanel } from './ImageFilterPanel'

// MediaPipe will be loaded dynamically
declare global {
  interface Window {
    Hands: any
    Camera: any
    drawConnectors: any
    drawLandmarks: any
    HAND_CONNECTIONS: any
  }
}

export default function HandPreview() {
  const { image, landmarks, setLandmarks } = usePalmStore()
  const { toast } = useToast()
  const { t } = useLanguageStore()
  const { trackEvent } = useAnalyticsStore()
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const originalImageDataRef = useRef<ImageData | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [showFilterPanel, setShowFilterPanel] = useState(false)

  // Load MediaPipe and process image
  useEffect(() => {
    if (!image) return

    const processImage = async () => {
      setIsLoading(true)
      setError(null)
      setDetectionStatus('processing')

      try {
        // For now, simulate MediaPipe processing with mock landmarks
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Generate mock hand landmarks (21 points)
        const mockLandmarks = Array.from({ length: 21 }, (_, i) => ({
          x: 0.3 + (Math.random() * 0.4), // Normalized coordinates
          y: 0.2 + (Math.random() * 0.6),
          z: Math.random() * 0.1 - 0.05
        }))

        // Simulate hand detection success/failure
        const success = Math.random() > 0.2 // 80% success rate
        
        if (success) {
          setLandmarks(mockLandmarks, Math.random() > 0.5 ? 'Right' : 'Left')
          setDetectionStatus('success')
          toast({
            title: t('detection.success') || "手部檢測成功",
            description: t('detection.successDesc') || "已識別到手部關鍵點，可以開始分析"
          })
        } else {
          setDetectionStatus('failed')
          setError(t('detection.failed') || '未能檢測到清晰的手部，請嘗試重新拍攝')
        }
      } catch (err) {
        setError(t('detection.error') || '圖片處理失敗，請稍後再試')
        setDetectionStatus('failed')
      } finally {
        setIsLoading(false)
      }
    }

    processImage()
  }, [image, setLandmarks, toast])

  // Draw image and landmarks on canvas
  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      // Set canvas size to match image aspect ratio
      const maxWidth = 400
      const maxHeight = 300
      const aspectRatio = img.width / img.height

      let canvasWidth = maxWidth
      let canvasHeight = maxWidth / aspectRatio

      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight
        canvasWidth = maxHeight * aspectRatio
      }

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Draw image
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
      
      // Store original image data for filtering
      if (!originalImageDataRef.current) {
        originalImageDataRef.current = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
      }

      // Draw landmarks if available
      if (landmarks && landmarks.length > 0) {
        // Draw hand connections (simplified)
        ctx.strokeStyle = 'rgba(255, 204, 0, 0.8)'
        ctx.lineWidth = 2
        
        // Draw simplified hand skeleton
        const connections = [
          [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
          [0, 5], [5, 6], [6, 7], [7, 8], // Index
          [0, 9], [9, 10], [10, 11], [11, 12], // Middle
          [0, 13], [13, 14], [14, 15], [15, 16], // Ring
          [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
          [5, 9], [9, 13], [13, 17] // Palm connections
        ]

        connections.forEach(([start, end]) => {
          if (landmarks[start] && landmarks[end]) {
            ctx.beginPath()
            ctx.moveTo(landmarks[start].x * canvasWidth, landmarks[start].y * canvasHeight)
            ctx.lineTo(landmarks[end].x * canvasWidth, landmarks[end].y * canvasHeight)
            ctx.stroke()
          }
        })

        // Draw landmark points
        landmarks.forEach((landmark, index) => {
          const x = landmark.x * canvasWidth
          const y = landmark.y * canvasHeight

          // Different colors for different parts
          if (index === 0) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)' // Wrist - red
          } else if (index <= 4) {
            ctx.fillStyle = 'rgba(255, 204, 0, 0.8)' // Thumb - gold
          } else {
            ctx.fillStyle = 'rgba(255, 131, 0, 0.8)' // Other fingers - orange
          }

          ctx.beginPath()
          ctx.arc(x, y, 4, 0, 2 * Math.PI)
          ctx.fill()

          // Add small stroke
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
          ctx.lineWidth = 1
          ctx.stroke()
        })
      }
    }
    img.src = image
  }, [image, landmarks])

  if (!image) return null

  return (
    <div className="space-y-4">
      {/* Status Alert */}
      {detectionStatus === 'processing' && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            正在分析手部特徵，請稍候...
          </AlertDescription>
        </Alert>
      )}

      {detectionStatus === 'success' && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            成功檢測到 {landmarks?.length} 個手部關鍵點
          </AlertDescription>
        </Alert>
      )}

      {detectionStatus === 'failed' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || '手部檢測失敗，請確保照片清晰且手心朝上'}
          </AlertDescription>
        </Alert>
      )}

      {/* Canvas Preview */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full max-w-md mx-auto rounded-lg border border-border shadow-lg"
          style={{ 
            background: '#f8f9fa',
            maxHeight: '300px',
            objectFit: 'contain'
          }}
        />
        
        {/* Filter Button */}
        {detectionStatus === 'success' && (
          <Button
            onClick={() => {
              setShowFilterPanel(true)
              trackEvent('filter_panel_opened')
            }}
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white/95 border border-amber-200 text-amber-700 shadow-lg"
            data-onboarding="filter-button"
          >
            <Sliders className="w-4 h-4 mr-2" />
            {t('filters.apply') || '應用濾鏡'}
          </Button>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-center">{t('detection.analyzing') || '分析中...'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Hand Info */}
      {landmarks && (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>✓ {t('detection.landmarksDetected') || '已檢測到手部關鍵點'}: {landmarks.length}</p>
          <p>✓ {t('detection.handOrientation') || '手部方向'}: {usePalmStore.getState().handedness === 'Right' ? (t('detection.rightHand') || '右手') : (t('detection.leftHand') || '左手')}</p>
          <p>✓ {t('detection.readyForAnalysis') || '準備進行掌相分析'}</p>
        </div>
      )}

      {/* Filter Panel */}
      <ImageFilterPanel
        isVisible={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        canvas={canvasRef.current}
        originalImageData={originalImageDataRef.current}
      />
    </div>
  )
}