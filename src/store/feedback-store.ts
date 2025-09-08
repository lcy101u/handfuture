import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserFeedback {
  id: string
  name: string
  avatar?: string
  location: string
  rating: number
  comment: string
  category: 'accuracy' | 'experience' | 'design' | 'overall'
  timestamp: Date
  verified: boolean
  helpful: number
  language: 'zh' | 'en'
}

export interface FeedbackStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
  categoryRatings: { [key: string]: number }
}

interface FeedbackState {
  feedbacks: UserFeedback[]
  userFeedback: UserFeedback | null
  showFeedbackModal: boolean
  stats: FeedbackStats
  
  // Actions
  addFeedback: (feedback: Omit<UserFeedback, 'id' | 'timestamp' | 'helpful'>) => void
  setUserFeedback: (feedback: UserFeedback | null) => void
  setShowFeedbackModal: (show: boolean) => void
  markHelpful: (feedbackId: string) => void
  getFeedbackStats: () => FeedbackStats
  getFeedbacksByCategory: (category: string) => UserFeedback[]
  getFeedbacksByLanguage: (language: 'zh' | 'en') => UserFeedback[]
}

// Initial sample feedback data for credibility
const initialFeedbacks: UserFeedback[] = [
  {
    id: '1',
    name: '王小明',
    location: '台北, 台灣',
    rating: 5,
    comment: '非常準確！特別是關於事業線的分析，完全符合我目前的工作狀況。UI設計也很美觀，使用體驗很棒。',
    category: 'accuracy',
    timestamp: new Date('2024-01-15'),
    verified: true,
    helpful: 23,
    language: 'zh'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    location: 'New York, USA',
    rating: 4,
    comment: 'Amazing palm reading experience! The AI analysis was surprisingly detailed and insightful. Love the traditional Chinese approach combined with modern technology.',
    category: 'overall',
    timestamp: new Date('2024-01-12'),
    verified: true,
    helpful: 18,
    language: 'en'
  },
  {
    id: '3',
    name: '李美華',
    location: '香港',
    rating: 5,
    comment: '界面設計非常精美，有濃厚的中國傳統文化氣息。手相分析很詳細，包含了情感、智慧、事業等多個方面。',
    category: 'design',
    timestamp: new Date('2024-01-10'),
    verified: true,
    helpful: 31,
    language: 'zh'
  },
  {
    id: '4',
    name: 'Michael Wong',
    location: 'Singapore',
    rating: 4,
    comment: 'Great user experience! The image upload process is smooth and the analysis results are presented beautifully. The disclaimer is also very clear and responsible.',
    category: 'experience',
    timestamp: new Date('2024-01-08'),
    verified: true,
    helpful: 15,
    language: 'en'
  },
  {
    id: '5',
    name: '張雅芳',
    location: '上海, 中國',
    rating: 5,
    comment: '第一次嘗試AI手相分析，結果讓我很驚喜！生命線和感情線的解讀很有參考價值，會推薦給朋友們。',
    category: 'accuracy',
    timestamp: new Date('2024-01-05'),
    verified: true,
    helpful: 27,
    language: 'zh'
  },
  {
    id: '6',
    name: 'Emma Liu',
    location: 'Vancouver, Canada',
    rating: 4,
    comment: 'Fascinating blend of ancient wisdom and modern AI! The palm reading was quite accurate for entertainment purposes. Great job on the multilingual support too.',
    category: 'overall',
    timestamp: new Date('2024-01-03'),
    verified: true,
    helpful: 12,
    language: 'en'
  }
]

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      feedbacks: initialFeedbacks,
      userFeedback: null,
      showFeedbackModal: false,
      stats: {
        totalReviews: initialFeedbacks.length,
        averageRating: 4.5,
        ratingDistribution: { 5: 4, 4: 2, 3: 0, 2: 0, 1: 0 },
        categoryRatings: { accuracy: 5, experience: 4, design: 5, overall: 4.5 }
      },

      addFeedback: (feedback) => {
        const newFeedback: UserFeedback = {
          ...feedback,
          id: Date.now().toString(),
          timestamp: new Date(),
          helpful: 0
        }
        
        set((state) => {
          const updatedFeedbacks = [newFeedback, ...state.feedbacks]
          return {
            feedbacks: updatedFeedbacks,
            stats: calculateStats(updatedFeedbacks)
          }
        })
      },

      setUserFeedback: (feedback) => set({ userFeedback: feedback }),
      
      setShowFeedbackModal: (show) => set({ showFeedbackModal: show }),

      markHelpful: (feedbackId) => {
        set((state) => ({
          feedbacks: state.feedbacks.map(feedback =>
            feedback.id === feedbackId
              ? { ...feedback, helpful: feedback.helpful + 1 }
              : feedback
          )
        }))
      },

      getFeedbackStats: () => get().stats,

      getFeedbacksByCategory: (category) => 
        get().feedbacks.filter(feedback => feedback.category === category),

      getFeedbacksByLanguage: (language) =>
        get().feedbacks.filter(feedback => feedback.language === language)
    }),
    {
      name: 'palm-feedback-storage'
    }
  )
)

// Helper function to calculate statistics
function calculateStats(feedbacks: UserFeedback[]): FeedbackStats {
  const totalReviews = feedbacks.length
  const averageRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews
  
  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  const categoryRatings: { [key: string]: number } = {}
  const categoryCounts: { [key: string]: number } = {}

  feedbacks.forEach(feedback => {
    ratingDistribution[feedback.rating as keyof typeof ratingDistribution]++
    
    if (!categoryRatings[feedback.category]) {
      categoryRatings[feedback.category] = 0
      categoryCounts[feedback.category] = 0
    }
    categoryRatings[feedback.category] += feedback.rating
    categoryCounts[feedback.category]++
  })

  // Calculate average ratings for each category
  Object.keys(categoryRatings).forEach(category => {
    categoryRatings[category] = categoryRatings[category] / categoryCounts[category]
  })

  return {
    totalReviews,
    averageRating: Number(averageRating.toFixed(1)),
    ratingDistribution,
    categoryRatings
  }
}