import { useState } from 'react'
import { Share2, Facebook, Twitter, MessageCircle, Link, Download, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import { useAnalyticsStore } from '@/store/analytics-store'
import { useLanguageStore } from '@/store/language-store'

interface SocialShareProps {
  result?: {
    palmType: string
    confidence: number
    interpretations: Array<{
      category: string
      description: string
      confidence: number
    }>
  }
  className?: string
}

export default function SocialShare({ result, className = "" }: SocialShareProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const trackShare = useAnalyticsStore(state => state.trackShare)
  const { t, currentLanguage } = useLanguageStore()
  
  // Generate share content based on result
  const generateShareText = () => {
    if (!result) {
      return currentLanguage === 'zh' 
        ? "我剛使用了免費AI手相算命工具，分析超準確！快來試試看你的手相運勢吧 🔮✋"
        : "I just used the free AI palm reading tool, the analysis was super accurate! Come try your palm fortune 🔮✋"
    }
    
    const topInterpretation = result.interpretations
      .sort((a, b) => b.confidence - a.confidence)[0]
    
    return currentLanguage === 'zh'
      ? `我的手相分析結果出爐了！${topInterpretation.category}運勢: ${topInterpretation.description.slice(0, 50)}... 準確度${Math.round(result.confidence * 100)}%！免費AI手相算命超神準 🔮✋`
      : `My palm reading results are out! ${topInterpretation.category}: ${topInterpretation.description.slice(0, 50)}... Accuracy ${Math.round(result.confidence * 100)}%! Free AI palm reading is amazing 🔮✋`
  }

  const shareUrl = window.location.href
  const shareText = generateShareText()
  const hashtags = "手相算命,AI算命,掌相分析,免費算命"
  
  // Update document meta tags dynamically
  const updateMetaTags = (title: string, description: string, image?: string) => {
    // Update title
    document.title = title
    
    // Update meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.querySelector(`meta[name="${property.replace('og:', '').replace('twitter:', '')}"]`) as HTMLMetaElement
      }
      if (meta) {
        meta.content = content
      }
    }
    
    updateMetaTag('og:title', title)
    updateMetaTag('og:description', description)
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    
    if (image) {
      updateMetaTag('og:image', image)
      updateMetaTag('twitter:image', image)
    }
  }

  const handleShare = async (platform: string) => {
    // Update meta tags for sharing
    const shareTitle = result ? 
      `我的AI手相分析結果 - 準確度${Math.round(result.confidence * 100)}%` : 
      "免費AI手相算命 | 專業掌相解讀分析"
    
    updateMetaTags(shareTitle, shareText)

    // Track share analytics
    const shareMetadata = result ? {
      topics: result.interpretations.map(i => i.category),
      confidence: result.confidence,
      palmType: result.palmType || 'unknown'
    } : {}
    
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedHashtags = encodeURIComponent(hashtags)
    
    let shareLink = ''
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
        break
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedHashtags}`
        break
      case 'line':
        shareLink = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`
        break
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
          
          // Track copy link share
          trackShare('copy-link', result ? 'analysis' : 'general', shareMetadata)
          
          toast({
            title: t('share.copied_clipboard'),
            description: t('share.copied_description'),
          })
          return
        } catch (err) {
          toast({
            title: t('share.copy_failed'),
            description: t('share.copy_failed_description'),
            variant: "destructive"
          })
          return
        }
      default:
        return
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
      
      // Track sharing event with analytics
      trackShare(platform, result ? 'analysis' : 'general', shareMetadata)
      
      toast({
        title: t('share.share_success'),
        description: `${t('share.shared_via')} ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      })
    }
  }

  const handleDownloadResult = async () => {
    if (!result) return
    
    setIsDownloading(true)
    
    try {
      // Create a canvas to generate result image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')
      
      canvas.width = 800
      canvas.height = 1000
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#1a1a2e')
      gradient.addColorStop(1, '#16213e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Title
      ctx.fillStyle = '#D4AF37'
      ctx.font = 'bold 48px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(currentLanguage === 'zh' ? '我的手相分析結果' : 'My Palm Reading Results', canvas.width / 2, 80)
      
      // Subtitle
      ctx.fillStyle = '#ffffff'
      ctx.font = '24px Arial'
      ctx.fillText(`準確度: ${Math.round(result.confidence * 100)}%`, canvas.width / 2, 130)
      
      // Results
      let yPos = 200
      result.interpretations.forEach((interpretation, index) => {
        ctx.fillStyle = '#D4AF37'
        ctx.font = 'bold 28px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(`${interpretation.category}運勢`, 50, yPos)
        
        ctx.fillStyle = '#ffffff'
        ctx.font = '20px Arial'
        const lines = interpretation.description.match(/.{1,35}/g) || [interpretation.description]
        lines.forEach((line, lineIndex) => {
          ctx.fillText(line, 50, yPos + 40 + (lineIndex * 30))
        })
        
        ctx.fillStyle = '#D4AF37'
        ctx.font = '18px Arial'
        ctx.textAlign = 'right'
        ctx.fillText(`${Math.round(interpretation.confidence * 100)}%`, canvas.width - 50, yPos + 20)
        
        yPos += 150 + (lines.length * 30)
      })
      
      // Footer
      ctx.fillStyle = '#888888'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('免費AI手相算命 - 僅供娛樂參考', canvas.width / 2, canvas.height - 50)
      ctx.fillText('https://palm-reading-ai.com', canvas.width / 2, canvas.height - 20)
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `我的手相分析結果_${new Date().toISOString().split('T')[0]}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          
          // Track image download
          trackShare('download', 'image', {
            topics: result.interpretations.map(i => i.category),
            confidence: result.confidence,
            palmType: result.palmType || 'unknown'
          })
          
          toast({
            title: t('share.download_success'),
            description: t('share.download_success_description'),
          })
        }
        setIsDownloading(false)
      }, 'image/png')
    } catch (error) {
      console.error('Download failed:', error)
      toast({
        title: t('share.download_failed'),
        description: t('share.download_failed_description'),
        variant: "destructive"
      })
      setIsDownloading(false)
    }
  }

  // Native Web Share API support
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: result ? 
            `我的AI手相分析結果 - 準確度${Math.round(result.confidence * 100)}%` : 
            "免費AI手相算命",
          text: shareText,
          url: shareUrl,
        })
        
        // Track native share
        const shareMetadata = result ? {
          topics: result.interpretations.map(i => i.category),
          confidence: result.confidence,
          palmType: result.palmType || 'unknown'
        } : {}
        
        trackShare('native-share', result ? 'analysis' : 'general', shareMetadata)
        
      } catch (error) {
        console.log('Native sharing cancelled or failed')
      }
    }
  }

  return (
    <Card className={`social-share-card ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t('share.title')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Native share button for mobile */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNativeShare}
                className="hidden max-sm:flex"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            )}
            
            {/* Download result */}
            {result && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadResult}
                disabled={isDownloading}
                className="gap-1"
              >
                {isDownloading ? (
                  <CheckCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {t('share.download_button')}
              </Button>
            )}
            
            {/* Social share dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm" className="gap-1">
                  <Share2 className="w-4 h-4" />
                  {t('share.share_button')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => handleShare('facebook')}
                  className="gap-2 cursor-pointer"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  {t('share.facebook')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleShare('twitter')}
                  className="gap-2 cursor-pointer"
                >
                  <Twitter className="w-4 h-4 text-blue-400" />
                  {t('share.twitter')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleShare('line')}
                  className="gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  {t('share.line')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleShare('whatsapp')}
                  className="gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  {t('share.whatsapp')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleShare('copy')}
                  className="gap-2 cursor-pointer"
                >
                  <Link className="w-4 h-4" />
                  {t('share.copy')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Share preview text */}
        {result && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">{t('share.preview')}</p>
            <p className="text-sm line-clamp-2">{shareText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}