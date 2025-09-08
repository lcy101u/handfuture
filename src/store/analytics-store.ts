import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ShareEvent {
  id: string
  timestamp: string
  platform: string
  contentType: 'analysis' | 'general' | 'image'
  analysisTopics?: string[]
  handedness?: 'Left' | 'Right'
  confidence?: number
  userAgent: string
  referrer: string
  sessionId: string
}

export interface AnalyticsEvent {
  id: string
  timestamp: string
  event: string
  data: Record<string, any>
  sessionId: string
  userAgent: string
  path: string
}

export interface SessionData {
  id: string
  startTime: string
  endTime?: string
  pageViews: number
  analysisCount: number
  shareCount: number
  totalTimeSpent: number
  bounceRate: boolean
  deviceType: 'mobile' | 'tablet' | 'desktop'
  userAgent: string
  referrer: string
}

export interface SharePerformance {
  platform: string
  totalShares: number
  analysisShares: number
  generalShares: number
  imageDownloads: number
  avgConfidenceScore: number
  topTopics: string[]
  conversionRate: number // shares per analysis
  lastShare: string
}

interface AnalyticsState {
  // Session tracking
  currentSession: SessionData | null
  shareEvents: ShareEvent[]
  analyticsEvents: AnalyticsEvent[]
  
  // Performance metrics
  sharePerformance: Record<string, SharePerformance>
  totalAnalyses: number
  totalShares: number
  totalSessions: number
  
  // Actions
  initSession: () => void
  endSession: () => void
  trackShare: (platform: string, contentType: 'analysis' | 'general' | 'image', metadata?: any) => void
  trackEvent: (event: string, data?: Record<string, any>) => void
  trackAnalysis: () => void
  trackPageView: (path: string) => void
  getShareInsights: () => ShareInsights
  exportAnalytics: () => AnalyticsExport
}

export interface ShareInsights {
  totalShares: number
  topPlatforms: Array<{ platform: string; shares: number; percentage: number }>
  sharesByContentType: Record<string, number>
  avgSharesPerSession: number
  shareConversionRate: number
  topSharedTopics: Array<{ topic: string; count: number }>
  dailyShares: Array<{ date: string; shares: number }>
  performanceMetrics: {
    bestPerformingPlatform: string
    highestEngagementTime: string
    avgConfidenceOfSharedAnalyses: number
  }
}

export interface AnalyticsExport {
  summary: {
    totalSessions: number
    totalAnalyses: number
    totalShares: number
    avgSessionDuration: number
    bounceRate: number
    shareConversionRate: number
  }
  shareEvents: ShareEvent[]
  analyticsEvents: AnalyticsEvent[]
  sharePerformance: Record<string, SharePerformance>
  generatedAt: string
}

const generateId = () => Math.random().toString(36).substr(2, 9)
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      shareEvents: [],
      analyticsEvents: [],
      sharePerformance: {},
      totalAnalyses: 0,
      totalShares: 0,
      totalSessions: 0,

      // Actions
      initSession: () => {
        const existingSession = get().currentSession
        if (existingSession && !existingSession.endTime) {
          // Update existing session
          set((state) => ({
            currentSession: {
              ...existingSession,
              pageViews: existingSession.pageViews + 1
            }
          }))
          return
        }

        // Create new session
        const sessionId = generateSessionId()
        const deviceType = getDeviceType()
        
        const newSession: SessionData = {
          id: sessionId,
          startTime: new Date().toISOString(),
          pageViews: 1,
          analysisCount: 0,
          shareCount: 0,
          totalTimeSpent: 0,
          bounceRate: false,
          deviceType,
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct'
        }

        set((state) => ({
          currentSession: newSession,
          totalSessions: state.totalSessions + 1
        }))

        // Track session start event
        get().trackEvent('session_start', {
          deviceType,
          referrer: document.referrer || 'direct'
        })
      },

      endSession: () => {
        const session = get().currentSession
        if (!session) return

        const endTime = new Date().toISOString()
        const totalTimeSpent = new Date(endTime).getTime() - new Date(session.startTime).getTime()
        const bounceRate = session.pageViews === 1 && session.analysisCount === 0

        set((state) => ({
          currentSession: {
            ...session,
            endTime,
            totalTimeSpent,
            bounceRate
          }
        }))

        // Track session end event
        get().trackEvent('session_end', {
          duration: totalTimeSpent,
          pageViews: session.pageViews,
          analysisCount: session.analysisCount,
          shareCount: session.shareCount,
          bounceRate
        })
      },

      trackShare: (platform, contentType, metadata = {}) => {
        const session = get().currentSession
        if (!session) return

        const shareEvent: ShareEvent = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          platform,
          contentType,
          analysisTopics: metadata.topics || [],
          handedness: metadata.handedness,
          confidence: metadata.confidence,
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct',
          sessionId: session.id
        }

        // Update session share count
        const updatedSession = {
          ...session,
          shareCount: session.shareCount + 1
        }

        // Update platform performance
        const currentPerformance = get().sharePerformance[platform] || {
          platform,
          totalShares: 0,
          analysisShares: 0,
          generalShares: 0,
          imageDownloads: 0,
          avgConfidenceScore: 0,
          topTopics: [],
          conversionRate: 0,
          lastShare: ''
        }

        const updatedPerformance: SharePerformance = {
          ...currentPerformance,
          totalShares: currentPerformance.totalShares + 1,
          [contentType === 'analysis' ? 'analysisShares' : contentType === 'image' ? 'imageDownloads' : 'generalShares']: 
            currentPerformance[contentType === 'analysis' ? 'analysisShares' : contentType === 'image' ? 'imageDownloads' : 'generalShares'] + 1,
          lastShare: shareEvent.timestamp,
          avgConfidenceScore: metadata.confidence ? 
            (currentPerformance.avgConfidenceScore * currentPerformance.analysisShares + metadata.confidence) / (currentPerformance.analysisShares + 1) :
            currentPerformance.avgConfidenceScore
        }

        // Update topic tracking
        if (metadata.topics && metadata.topics.length > 0) {
          const topicCounts: Record<string, number> = {}
          currentPerformance.topTopics.forEach(topic => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1
          })
          metadata.topics.forEach((topic: string) => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1
          })
          updatedPerformance.topTopics = Object.entries(topicCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([topic]) => topic)
        }

        // Calculate conversion rate
        updatedPerformance.conversionRate = get().totalAnalyses > 0 ? 
          updatedPerformance.totalShares / get().totalAnalyses : 0

        set((state) => ({
          currentSession: updatedSession,
          shareEvents: [...state.shareEvents, shareEvent],
          sharePerformance: {
            ...state.sharePerformance,
            [platform]: updatedPerformance
          },
          totalShares: state.totalShares + 1
        }))

        // Track share event
        get().trackEvent('share', {
          platform,
          contentType,
          ...metadata
        })
      },

      trackEvent: (event, data = {}) => {
        const session = get().currentSession
        if (!session) return

        const analyticsEvent: AnalyticsEvent = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          event,
          data,
          sessionId: session.id,
          userAgent: navigator.userAgent,
          path: window.location.pathname
        }

        set((state) => ({
          analyticsEvents: [...state.analyticsEvents, analyticsEvent]
        }))

        // Console log for development (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Analytics Event:', event, data)
        }
      },

      trackAnalysis: () => {
        const session = get().currentSession
        if (!session) return

        const updatedSession = {
          ...session,
          analysisCount: session.analysisCount + 1
        }

        set((state) => ({
          currentSession: updatedSession,
          totalAnalyses: state.totalAnalyses + 1
        }))

        get().trackEvent('analysis_completed')
      },

      trackPageView: (path) => {
        const session = get().currentSession
        if (!session) return

        get().trackEvent('page_view', { path })
      },

      getShareInsights: (): ShareInsights => {
        const { shareEvents, sharePerformance, totalAnalyses, totalSessions, totalShares } = get()
        
        // Calculate top platforms
        const platformCounts = Object.entries(sharePerformance)
          .map(([platform, perf]) => ({
            platform,
            shares: perf.totalShares,
            percentage: totalShares > 0 ? Math.round((perf.totalShares / totalShares) * 100) : 0
          }))
          .sort((a, b) => b.shares - a.shares)

        // Calculate shares by content type
        const sharesByContentType = shareEvents.reduce((acc, event) => {
          acc[event.contentType] = (acc[event.contentType] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        // Calculate top shared topics
        const topicCounts: Record<string, number> = {}
        shareEvents.forEach(event => {
          event.analysisTopics?.forEach(topic => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1
          })
        })
        const topSharedTopics = Object.entries(topicCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([topic, count]) => ({ topic, count }))

        // Calculate daily shares (last 7 days)
        const now = new Date()
        const dailyShares = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          const dayShares = shareEvents.filter(event => 
            event.timestamp.split('T')[0] === dateStr
          ).length
          return { date: dateStr, shares: dayShares }
        }).reverse()

        // Performance metrics
        const bestPerformingPlatform = platformCounts[0]?.platform || 'none'
        const avgConfidenceOfSharedAnalyses = shareEvents
          .filter(event => event.confidence)
          .reduce((sum, event) => sum + (event.confidence || 0), 0) / 
          shareEvents.filter(event => event.confidence).length || 0

        return {
          totalShares,
          topPlatforms: platformCounts,
          sharesByContentType,
          avgSharesPerSession: totalSessions > 0 ? totalShares / totalSessions : 0,
          shareConversionRate: totalAnalyses > 0 ? totalShares / totalAnalyses : 0,
          topSharedTopics,
          dailyShares,
          performanceMetrics: {
            bestPerformingPlatform,
            highestEngagementTime: getMostActiveHour(shareEvents),
            avgConfidenceOfSharedAnalyses
          }
        }
      },

      exportAnalytics: (): AnalyticsExport => {
        const state = get()
        const insights = state.getShareInsights()
        
        return {
          summary: {
            totalSessions: state.totalSessions,
            totalAnalyses: state.totalAnalyses,
            totalShares: state.totalShares,
            avgSessionDuration: calculateAvgSessionDuration(state.analyticsEvents),
            bounceRate: calculateBounceRate(state.analyticsEvents),
            shareConversionRate: insights.shareConversionRate
          },
          shareEvents: state.shareEvents,
          analyticsEvents: state.analyticsEvents,
          sharePerformance: state.sharePerformance,
          generatedAt: new Date().toISOString()
        }
      }
    }),
    {
      name: 'palm-analytics-storage',
      partialize: (state) => ({
        shareEvents: state.shareEvents,
        analyticsEvents: state.analyticsEvents,
        sharePerformance: state.sharePerformance,
        totalAnalyses: state.totalAnalyses,
        totalShares: state.totalShares,
        totalSessions: state.totalSessions
      })
    }
  )
)

// Helper functions
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const userAgent = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet'
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'mobile'
  }
  return 'desktop'
}

function getMostActiveHour(events: ShareEvent[]): string {
  const hourCounts: Record<string, number> = {}
  events.forEach(event => {
    const hour = new Date(event.timestamp).getHours()
    const hourStr = `${hour.toString().padStart(2, '0')}:00`
    hourCounts[hourStr] = (hourCounts[hourStr] || 0) + 1
  })
  
  const mostActiveHour = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)[0]
  
  return mostActiveHour ? mostActiveHour[0] : '12:00'
}

function calculateAvgSessionDuration(events: AnalyticsEvent[]): number {
  const sessionDurations = events
    .filter(event => event.event === 'session_end')
    .map(event => event.data.duration || 0)
  
  return sessionDurations.length > 0 ? 
    sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length : 0
}

function calculateBounceRate(events: AnalyticsEvent[]): number {
  const sessionEndEvents = events.filter(event => event.event === 'session_end')
  const bounces = sessionEndEvents.filter(event => event.data.bounceRate).length
  
  return sessionEndEvents.length > 0 ? (bounces / sessionEndEvents.length) * 100 : 0
}