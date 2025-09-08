import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { 
  Palette,
  Sun,
  Moon,
  Contrast,
  Sparkles,
  Zap,
  Waves,
  RotateCcw,
  Download,
  Eye,
  Sliders
} from 'lucide-react'
import { useImageFilterStore, filterPresets } from '@/store/image-filter-store'
import { useLanguageStore } from '@/store/language-store'
import { useAnalyticsStore } from '@/store/analytics-store'

interface ImageFilterPanelProps {
  isVisible: boolean
  onClose: () => void
  canvas: HTMLCanvasElement | null
  originalImageData: ImageData | null
}

export function ImageFilterPanel({ isVisible, onClose, canvas, originalImageData }: ImageFilterPanelProps) {
  const { currentLanguage, t } = useLanguageStore()
  const { trackEvent } = useAnalyticsStore()
  const {
    activeFilter,
    brightness,
    contrast,
    saturation,
    blur,
    sepia,
    vintage,
    sharpness,
    temperature,
    tint,
    vignette,
    setActiveFilter,
    setBrightness,
    setContrast,
    setSaturation,
    setBlur,
    setSepia,
    setVintage,
    setSharpness,
    setTemperature,
    setTint,
    setVignette,
    resetFilters,
    applyFiltersToCanvas
  } = useImageFilterStore()

  // Apply filters when values change
  React.useEffect(() => {
    if (canvas && originalImageData) {
      applyFiltersToCanvas(canvas, originalImageData)
    }
  }, [canvas, originalImageData, brightness, contrast, saturation, blur, sepia, vintage, sharpness, temperature, tint, vignette])

  const handlePresetFilter = (preset: typeof filterPresets[0]) => {
    trackEvent('filter_preset_applied', {
      filter_id: preset.id,
      filter_name: currentLanguage === 'zh' ? preset.name : preset.nameEn
    })
    
    setActiveFilter(preset.id)
    
    // Apply preset values based on filter type
    switch (preset.id) {
      case 'original':
        resetFilters()
        break
      case 'enhance':
        setBrightness(10)
        setContrast(20)
        setSaturation(110)
        break
      case 'classic':
        setSepia(30)
        setContrast(10)
        break
      case 'vintage':
        setSepia(50)
        setSaturation(80)
        setTint(15)
        break
      case 'mystic':
        setContrast(30)
        setSaturation(150)
        setTint(-90)
        break
      case 'gold':
        setSepia(80)
        setSaturation(200)
        setTint(10)
        setBrightness(10)
        break
    }
  }

  const handleResetFilters = () => {
    trackEvent('filters_reset')
    resetFilters()
    setActiveFilter(null)
  }

  const handleDownloadFiltered = () => {
    if (!canvas) return
    
    trackEvent('filtered_image_download', {
      active_filter: activeFilter,
      brightness,
      contrast,
      saturation
    })
    
    const link = document.createElement('a')
    link.download = `palm-filtered-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="filter-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950 border-amber-200 dark:border-amber-800 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-amber-900 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              {t('filters.title')}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filter Presets */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('filters.presets')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {filterPresets.map((preset) => (
                <Button
                  key={preset.id}
                  variant={activeFilter === preset.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetFilter(preset)}
                  className={`filter-button text-xs transition-all duration-200 ${
                    activeFilter === preset.id
                      ? 'filter-preset-active bg-amber-600 hover:bg-amber-700 text-white shadow-lg scale-105'
                      : 'border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300'
                  }`}
                >
                  {currentLanguage === 'zh' ? preset.name : preset.nameEn}
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Controls */}
          <Tabs defaultValue="basic" className="filter-tabs w-full">
            <TabsList className="grid w-full grid-cols-3 bg-amber-100 relative overflow-hidden">
              <TabsTrigger value="basic" className="text-xs data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                {t('filters.basic')}
              </TabsTrigger>
              <TabsTrigger value="color" className="text-xs data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                {t('filters.color')}
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-xs data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                {t('filters.effects')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              {/* Brightness */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  {t('filters.brightness')}
                  <Badge variant="outline" className="filter-value-badge ml-auto text-xs">
                    {brightness > 0 ? `+${brightness}` : brightness}
                  </Badge>
                </Label>
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                  max={100}
                  min={-100}
                  step={1}
                  className="filter-slider w-full"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <Contrast className="w-4 h-4" />
                  {t('filters.contrast')}
                  <Badge variant="outline" className="filter-value-badge ml-auto text-xs">
                    {contrast > 0 ? `+${contrast}` : contrast}
                  </Badge>
                </Label>
                <Slider
                  value={[contrast]}
                  onValueChange={(value) => setContrast(value[0])}
                  max={100}
                  min={-100}
                  step={1}
                  className="filter-slider w-full"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  {t('filters.saturation')}
                  <Badge variant="outline" className="filter-value-badge ml-auto text-xs">
                    {saturation}%
                  </Badge>
                </Label>
                <Slider
                  value={[saturation]}
                  onValueChange={(value) => setSaturation(value[0])}
                  max={200}
                  min={0}
                  step={1}
                  className="filter-slider w-full"
                />
              </div>

              {/* Sharpness */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {t('filters.sharpness')}
                  <Badge variant="outline" className="filter-value-badge ml-auto text-xs">
                    {sharpness > 0 ? `+${sharpness}` : sharpness}
                  </Badge>
                </Label>
                <Slider
                  value={[sharpness]}
                  onValueChange={(value) => setSharpness(value[0])}
                  max={100}
                  min={-50}
                  step={1}
                  className="filter-slider w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="color" className="space-y-4 mt-4">
              {/* Temperature */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  {t('filters.temperature')}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {temperature > 0 ? `+${temperature}` : temperature}
                  </Badge>
                </Label>
                <Slider
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  max={100}
                  min={-100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Tint */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  {t('filters.tint')}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {tint}°
                  </Badge>
                </Label>
                <Slider
                  value={[tint]}
                  onValueChange={(value) => setTint(value[0])}
                  max={180}
                  min={-180}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Sepia */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  {t('filters.sepia')}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {sepia}%
                  </Badge>
                </Label>
                <Slider
                  value={[sepia]}
                  onValueChange={(value) => setSepia(value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4 mt-4">
              {/* Blur */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {t('filters.blur')}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {blur}px
                  </Badge>
                </Label>
                <Slider
                  value={[blur]}
                  onValueChange={(value) => setBlur(value[0])}
                  max={10}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Vintage */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <Waves className="w-4 h-4" />
                  {t('filters.vintage')}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {vintage}%
                  </Badge>
                </Label>
                <Slider
                  value={[vintage]}
                  onValueChange={(value) => setVintage(value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Vignette */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t('filters.vignette')}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {vignette}%
                  </Badge>
                </Label>
                <Slider
                  value={[vignette]}
                  onValueChange={(value) => setVignette(value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-amber-200">
            <Button
              onClick={handleResetFilters}
              variant="outline"
              size="sm"
              className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('filters.reset')}
            </Button>
            <Button
              onClick={handleDownloadFiltered}
              variant="default"
              size="sm"
              className="download-ready flex-1 bg-amber-600 hover:bg-amber-700 text-white filter-button"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('filters.download')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}