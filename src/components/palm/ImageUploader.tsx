import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { AlertCircle, Upload, Camera, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { usePalmStore } from '@/store/palm-store'
import { useAnalyticsStore } from '@/store/analytics-store'
import { useLanguageStore } from '@/store/language-store'

export default function ImageUploader() {
  const { toast } = useToast()
  const setImage = usePalmStore(state => state.setImage)
  const trackEvent = useAnalyticsStore(state => state.trackEvent)
  const { t, currentLanguage } = useLanguageStore()
  const [uploadError, setUploadError] = useState<string | null>(null)
  const activeReaderRef = useRef<FileReader | null>(null)
  const requestIdRef = useRef(0)

  const messages = currentLanguage === 'zh'
    ? {
        type: '請選擇 JPG、PNG 或 WebP 圖片。',
        size: '圖片超過 10MB，請選擇較小的檔案。',
        unreadable: '無法讀取圖片，請選擇其他檔案。',
      }
    : {
        type: 'Choose a JPG, PNG, or WebP image.',
        size: 'The image is larger than 10MB. Choose a smaller file.',
        unreadable: 'The image could not be read. Choose another file.',
      }

  const cancelPendingRead = useCallback(() => {
    requestIdRef.current += 1
    activeReaderRef.current?.abort()
    activeReaderRef.current = null
    return requestIdRef.current
  }, [])

  useEffect(() => () => {
    cancelPendingRead()
  }, [cancelPendingRead])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const requestId = cancelPendingRead()
    const file = acceptedFiles[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError(messages.type)
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(messages.size)
      toast({
        title: currentLanguage === 'zh' ? "檔案過大" : "File Too Large",
        description: currentLanguage === 'zh' ? "請選擇小於 10MB 的圖片" : "Please select an image smaller than 10MB",
        variant: "destructive"
      })
      return
    }

    // Create image URL
    const reader = new FileReader()
    activeReaderRef.current = reader
    const isCurrentRequest = () =>
      requestIdRef.current === requestId && activeReaderRef.current === reader

    reader.onload = (e) => {
      if (!isCurrentRequest()) return
      const result = e.target?.result
      if (typeof result === 'string' && result) {
        activeReaderRef.current = null
        setUploadError(null)
        setImage(result)
        
        // Track image upload
        trackEvent('image_uploaded', {
          fileSize: file.size,
          fileType: file.type,
          uploadMethod: 'drag_drop'
        })
        
        toast({
          title: "圖片上傳成功",
          description: "正在分析手部特徵..."
        })
      } else {
        activeReaderRef.current = null
        setUploadError(messages.unreadable)
      }
    }
    reader.onerror = () => {
      if (!isCurrentRequest()) return
      activeReaderRef.current = null
      setUploadError(messages.unreadable)
    }
    reader.onabort = () => {
      if (!isCurrentRequest()) return
      activeReaderRef.current = null
      setUploadError(messages.unreadable)
    }
    reader.readAsDataURL(file)
  }, [cancelPendingRead, currentLanguage, messages.size, messages.type, messages.unreadable, setImage, toast, trackEvent])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: () => {
      cancelPendingRead()
      setUploadError(messages.type)
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  const handleCamera = () => {
    // Track camera usage
    trackEvent('camera_accessed', {
      method: 'camera_button'
    })
    
    // Create file input for camera
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Track camera capture
        trackEvent('image_uploaded', {
          fileSize: file.size,
          fileType: file.type,
          uploadMethod: 'camera_capture'
        })
        onDrop([file])
      }
    }
    input.click()
  }

  return (
    <div className="space-y-4">
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          hand-preview min-h-[200px] flex flex-col items-center justify-center
          cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'hover:border-primary/50 hover:bg-muted/80'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="text-center space-y-4">
          <div className={`
            w-16 h-16 mx-auto rounded-full border-2 border-dashed
            flex items-center justify-center transition-colors
            ${isDragActive ? 'border-primary text-primary' : 'border-muted-foreground/50 text-muted-foreground'}
          `}>
            {isDragActive ? (
              <Upload className="w-6 h-6" />
            ) : (
              <ImageIcon className="w-6 h-6" />
            )}
          </div>
          
          <div>
            <p className="font-medium">
              {isDragActive 
                ? (currentLanguage === 'zh' ? '放開以上傳照片' : 'Drop to upload photo')
                : (currentLanguage === 'zh' ? '拖放照片至此處' : t('upload.drag'))
              }
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('upload.formats')} {currentLanguage === 'zh' ? '，最大 10MB' : ', max 10MB'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (file) onDrop([file])
            }
            input.click()
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          {t('upload.select_file')}
        </Button>
        
        <Button 
          variant="outline"
          className="flex-1"
          onClick={handleCamera}
        >
          <Camera className="w-4 h-4 mr-2" />
          {t('upload.open_camera')}
        </Button>
      </div>

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• {t('upload.tip1')}</p>
        <p>• {t('upload.tip2')}</p>
        <p>• {t('upload.tip3')}</p>
      </div>
    </div>
  )
}
