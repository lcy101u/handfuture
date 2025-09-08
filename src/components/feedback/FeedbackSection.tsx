import React from 'react'
import { Star, ThumbsUp, MessageCircle, Users, TrendingUp, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useFeedbackStore } from '@/store/feedback-store'
import { useLanguageStore } from '@/store/language-store'
import { useAnalyticsStore } from '@/store/analytics-store'

const FeedbackSection: React.FC = () => {
  const { 
    feedbacks, 
    stats, 
    setShowFeedbackModal, 
    markHelpful,
    getFeedbacksByLanguage 
  } = useFeedbackStore()
  
  const { currentLanguage: language, t } = useLanguageStore()
  const { trackEvent } = useAnalyticsStore()

  // Filter feedbacks by current language
  const currentLanguageFeedbacks = getFeedbacksByLanguage(language).slice(0, 6)

  const handleWriteReview = () => {
    setShowFeedbackModal(true)
    trackEvent('feedback_write_clicked', { source: 'feedback_section' })
  }

  const handleHelpful = (feedbackId: string) => {
    markHelpful(feedbackId)
    trackEvent('feedback_helpful_clicked', { feedbackId })
  }

  const renderStars = (rating: number, size = 'sm') => {
    return (
      <div className={`flex gap-1 ${size === 'lg' ? 'gap-2' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-amber-50/50 to-white">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            {t('feedback.title')}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('feedback.subtitle')}
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Users className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium">{stats.totalReviews}+ {t('feedback.users')}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              {renderStars(Math.round(stats.averageRating))}
              <span className="text-sm font-medium">{stats.averageRating}/5</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">{t('feedback.verified')}</span>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-amber-600 mb-1">{stats.totalReviews}</div>
              <div className="text-sm text-gray-600">{t('feedback.totalReviews')}</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-amber-600 mb-1">{stats.averageRating}</div>
              <div className="text-sm text-gray-600">{t('feedback.averageRating')}</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
              <div className="text-sm text-gray-600">{t('feedback.satisfaction')}</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-blue-600 mb-1">95%</div>
              <div className="text-sm text-gray-600">{t('feedback.recommend')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">{t('feedback.ratingDistribution')}</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
                
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Reviews */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentLanguageFeedbacks.map((feedback) => (
            <Card key={feedback.id} className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={feedback.avatar} />
                    <AvatarFallback className="bg-amber-100 text-amber-700">
                      {feedback.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{feedback.name}</h4>
                      {feedback.verified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          <Shield className="w-3 h-3 mr-1" />
                          {t('feedback.verifiedUser')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{feedback.location}</p>
                    <p className="text-xs text-gray-400">{formatDate(feedback.timestamp)}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  {renderStars(feedback.rating)}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {t(`feedback.category.${feedback.category}`)}
                  </Badge>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-4">{feedback.comment}</p>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpful(feedback.id)}
                    className="text-gray-600 hover:text-amber-600"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {feedback.helpful}
                  </Button>
                  <div className="text-xs text-gray-400">
                    {t('feedback.helpful')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-8">
              <MessageCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('feedback.shareExperience')}</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {t('feedback.shareDescription')}
              </p>
              <Button 
                onClick={handleWriteReview}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('feedback.writeReview')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default FeedbackSection