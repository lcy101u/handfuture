import React, { useState } from 'react'
import { Star, X, Camera, MessageCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useFeedbackStore } from '@/store/feedback-store'
import { useLanguageStore } from '@/store/language-store'
import { useAnalyticsStore } from '@/store/analytics-store'

const FeedbackModal: React.FC = () => {
  const { showFeedbackModal, setShowFeedbackModal, addFeedback } = useFeedbackStore()
  const { currentLanguage: language, t } = useLanguageStore()
  const { trackEvent } = useAnalyticsStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 0,
    category: '',
    comment: ''
  })

  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.location || !formData.rating || !formData.category || !formData.comment) {
      toast({
        title: t('feedback.error'),
        description: t('feedback.fillAllFields'),
        variant: 'destructive'
      })
      return
    }

    if (formData.comment.length < 20) {
      toast({
        title: t('feedback.error'),
        description: t('feedback.commentTooShort'),
        variant: 'destructive'
      })
      return
    }

    addFeedback({
      name: formData.name,
      location: formData.location,
      rating: formData.rating,
      category: formData.category as any,
      comment: formData.comment,
      verified: false,
      language
    })

    // Track analytics
    trackEvent('feedback_submitted', {
      rating: formData.rating,
      category: formData.category,
      language,
      commentLength: formData.comment.length
    })

    toast({
      title: t('feedback.success'),
      description: t('feedback.thankYou'),
    })

    // Reset form and close modal
    setFormData({
      name: '',
      location: '',
      rating: 0,
      category: '',
      comment: ''
    })
    setShowFeedbackModal(false)
  }

  const handleClose = () => {
    setShowFeedbackModal(false)
    trackEvent('feedback_modal_closed', { completed: false })
  }

  const categories = [
    { value: 'accuracy', label: t('feedback.category.accuracy') },
    { value: 'experience', label: t('feedback.category.experience') },
    { value: 'design', label: t('feedback.category.design') },
    { value: 'overall', label: t('feedback.category.overall') }
  ]

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setFormData({ ...formData, rating: star })}
            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredRating || formData.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="w-6 h-6 text-amber-600" />
            {t('feedback.writeReview')}
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('feedback.form.name')} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('feedback.form.namePlaceholder')}
              className="focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">{t('feedback.form.location')} *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={t('feedback.form.locationPlaceholder')}
              className="focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>{t('feedback.form.rating')} *</Label>
            <div className="flex items-center gap-4">
              {renderStars()}
              {formData.rating > 0 && (
                <Badge variant="secondary">
                  {formData.rating}/5 {t('feedback.stars')}
                </Badge>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">{t('feedback.form.category')} *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="focus:ring-amber-500 focus:border-amber-500">
                <SelectValue placeholder={t('feedback.form.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">{t('feedback.form.comment')} *</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder={t('feedback.form.commentPlaceholder')}
              rows={4}
              className="focus:ring-amber-500 focus:border-amber-500 resize-none"
            />
            <div className="text-xs text-gray-500">
              {formData.comment.length}/500 {t('feedback.form.characters')} 
              ({Math.max(0, 20 - formData.comment.length)} {t('feedback.form.minimum')})
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <Camera className="w-4 h-4 inline mr-2" />
              {t('feedback.privacy')}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              {t('feedback.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackModal