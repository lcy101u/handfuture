import React, { useCallback, useState } from 'react';
import { Upload, X, Play, Square, Download, Settings, Image, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useBatchStore } from '@/store/batch-store';
import { useLanguageStore } from '@/store/language-store';
import { useAnalyticsStore } from '@/store/analytics-store';
import { cn } from '@/lib/utils';

export function BatchProcessor() {
  const { currentLanguage, t } = useLanguageStore();
  const { trackEvent } = useAnalyticsStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    images,
    isProcessing,
    currentProcessingIndex,
    totalImages,
    completedImages,
    globalFilters,
    applyGlobalFilters,
    selectedPreset,
    addImages,
    removeImage,
    clearBatch,
    startBatchProcessing,
    stopBatchProcessing,
    updateGlobalFilters,
    toggleGlobalFilters,
    applyPresetToBatch,
    exportBatch,
    reorderImages,
  } = useBatchStore();

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length > 0) {
      addImages(imageFiles);
      trackEvent('batch_images_added', {
        count: imageFiles.length,
        language: currentLanguage,
      });
    }
  }, [addImages, trackEvent, currentLanguage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleStartProcessing = async () => {
    trackEvent('batch_processing_started', {
      imageCount: images.length,
      applyGlobalFilters,
      selectedPreset,
      language: currentLanguage,
    });
    
    await startBatchProcessing();
    
    trackEvent('batch_processing_completed', {
      imageCount: completedImages,
      language: currentLanguage,
    });
  };

  const progressPercentage = totalImages > 0 ? (completedImages / totalImages) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">
            {t('batch.title')}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t('batch.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {t('batch.uploadTitle')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('batch.uploadSubtitle')}
            </p>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="batch-upload"
            />
            
            <Button asChild>
              <label htmlFor="batch-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {t('batch.selectFiles')}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Global Settings */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>{t('batch.globalSettings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="global-filters"
                checked={applyGlobalFilters}
                onCheckedChange={toggleGlobalFilters}
              />
              <Label htmlFor="global-filters">
                {t('batch.applyGlobalFilters')}
              </Label>
            </div>

            {applyGlobalFilters && (
              <div className="space-y-4">
                <div>
                  <Label>{t('batch.preset')}</Label>
                  <Select value={selectedPreset} onValueChange={applyPresetToBatch}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t('filters.none')}</SelectItem>
                      <SelectItem value="natural">{t('filters.presets.natural')}</SelectItem>
                      <SelectItem value="enhanced">{t('filters.presets.enhanced')}</SelectItem>
                      <SelectItem value="dramatic">{t('filters.presets.dramatic')}</SelectItem>
                      <SelectItem value="vintage">{t('filters.presets.vintage')}</SelectItem>
                      <SelectItem value="professional">{t('filters.presets.professional')}</SelectItem>
                      <SelectItem value="mystical">{t('filters.presets.mystical')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(globalFilters).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="flex items-center justify-between">
                        {t(`filters.${key}`)}
                        <Badge variant="secondary" className="ml-2">
                          {value}
                        </Badge>
                      </Label>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => 
                          updateGlobalFilters({ [key]: newValue })
                        }
                        min={key === 'blur' ? 0 : -50}
                        max={50}
                        step={1}
                        className="filter-slider"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Batch Controls */}
      {images.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {images.length} {t('batch.images')}
                </Badge>
                
                {isProcessing && (
                  <Badge variant="secondary">
                    {t('batch.processing')} {currentProcessingIndex + 1}/{totalImages}
                  </Badge>
                )}
                
                {completedImages > 0 && !isProcessing && (
                  <Badge variant="default" className="bg-green-500">
                    {completedImages} {t('batch.completed')}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isProcessing ? (
                  <Button
                    onClick={handleStartProcessing}
                    disabled={images.length === 0}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {t('batch.startProcessing')}
                  </Button>
                ) : (
                  <Button variant="destructive" onClick={stopBatchProcessing}>
                    <Square className="w-4 h-4 mr-2" />
                    {t('batch.stopProcessing')}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={exportBatch}
                  disabled={completedImages === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('batch.exportAll')}
                </Button>
                
                <Button variant="outline" onClick={clearBatch}>
                  <X className="w-4 h-4 mr-2" />
                  {t('batch.clearAll')}
                </Button>
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{t('batch.progress')}</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Image Grid/List */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('batch.imageList')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "gap-4",
              viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "space-y-4"
            )}>
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={cn(
                    "relative border rounded-lg overflow-hidden transition-all hover:shadow-md",
                    viewMode === 'list' && "flex items-center p-4",
                    image.processed && "ring-2 ring-green-500",
                    isProcessing && currentProcessingIndex === index && "ring-2 ring-blue-500 animate-pulse"
                  )}
                >
                  <div className={cn(
                    "relative",
                    viewMode === 'grid' ? "aspect-square" : "w-16 h-16 flex-shrink-0"
                  )}>
                    <img
                      src={image.preview}
                      alt={`Batch image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {image.processed && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <Badge className="bg-green-500 text-white">
                          {t('batch.processed')}
                        </Badge>
                      </div>
                    )}
                    
                    {isProcessing && currentProcessingIndex === index && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <Badge className="bg-blue-500 text-white animate-pulse">
                          {t('batch.processing')}...
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className={cn(
                    "p-3",
                    viewMode === 'list' && "flex-1 ml-4"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium truncate">
                        {image.file.name}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{(image.file.size / 1024 / 1024).toFixed(2)} MB</div>
                      
                      {image.processed && image.analysis && (
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {t('batch.analyzed')}
                          </Badge>
                          
                          {image.downloadUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = image.downloadUrl!;
                                link.download = `processed-${image.file.name}`;
                                link.click();
                              }}
                              className="w-full mt-2"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {t('batch.download')}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}