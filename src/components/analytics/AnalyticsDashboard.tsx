import { useState } from 'react'
import { BarChart3, TrendingUp, Users, Share2, Download, Eye, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAnalyticsStore } from '@/store/analytics-store'

export default function AnalyticsDashboard() {
  const { 
    shareEvents, 
    analyticsEvents, 
    sharePerformance, 
    totalAnalyses, 
    totalShares, 
    totalSessions,
    getShareInsights,
    exportAnalytics 
  } = useAnalyticsStore()
  
  const [activeTab, setActiveTab] = useState('overview')
  
  const insights = getShareInsights()

  const handleExport = () => {
    const data = exportAnalytics()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `palm-reading-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">社交分享效果與用戶行為分析</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總分析次數</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">
              累計手相分析次數
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總分享次數</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShares}</div>
            <p className="text-xs text-muted-foreground">
              轉換率: {(insights.shareConversionRate * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總訪問數</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              平均每訪問 {insights.avgSharesPerSession.toFixed(1)} 次分享
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">最佳平台</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.performanceMetrics.bestPerformingPlatform}</div>
            <p className="text-xs text-muted-foreground">
              {insights.performanceMetrics.highestEngagementTime} 最活躍
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Sharing Topics</CardTitle>
                <CardDescription>最受歡迎的手相解讀主題</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.topSharedTopics.slice(0, 5).map((topic, index) => (
                  <div key={topic.topic} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm">{topic.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(topic.count / insights.topSharedTopics[0]?.count || 1) * 100} 
                        className="w-16 h-2" 
                      />
                      <span className="text-xs text-muted-foreground">{topic.count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Type Distribution</CardTitle>
                <CardDescription>分享內容類型分佈</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(insights.sharesByContentType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{type}</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(count / Math.max(...Object.values(insights.sharesByContentType))) * 100} 
                        className="w-20 h-2" 
                      />
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>各平台分享效果分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.topPlatforms.map((platform, index) => (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "outline"}>
                          #{index + 1}
                        </Badge>
                        <span className="font-medium capitalize">{platform.platform}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {platform.shares} shares ({platform.percentage}%)
                      </div>
                    </div>
                    <Progress value={platform.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(sharePerformance).map(([platform, perf]) => (
              <Card key={platform}>
                <CardHeader>
                  <CardTitle className="text-base capitalize">{platform}</CardTitle>
                  <CardDescription>Detailed metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Shares:</span>
                    <span className="font-medium">{perf.totalShares}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Analysis Shares:</span>
                    <span className="font-medium">{perf.analysisShares}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Image Downloads:</span>
                    <span className="font-medium">{perf.imageDownloads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Confidence:</span>
                    <span className="font-medium">{(perf.avgConfidenceScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Share:</span>
                    <span className="font-medium text-xs">
                      {perf.lastShare ? new Date(perf.lastShare).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Share Events</CardTitle>
              <CardDescription>最近的分享活動記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shareEvents.slice(-10).reverse().map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{event.platform}</Badge>
                      <div>
                        <div className="text-sm font-medium">{event.contentType}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {event.confidence && (
                        <div className="text-xs text-muted-foreground">
                          Confidence: {(event.confidence * 100).toFixed(1)}%
                        </div>
                      )}
                      {event.analysisTopics && event.analysisTopics.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Topics: {event.analysisTopics.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Shares (Last 7 Days)</CardTitle>
              <CardDescription>過去7天的分享趨勢</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.dailyShares.map((day) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={day.shares === 0 ? 0 : (day.shares / Math.max(...insights.dailyShares.map(d => d.shares)) || 1) * 100} 
                        className="w-20 h-2" 
                      />
                      <span className="text-xs text-muted-foreground w-8 text-right">{day.shares}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>關鍵指標總覽</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {insights.performanceMetrics.bestPerformingPlatform}
                  </div>
                  <div className="text-sm text-muted-foreground">Best Platform</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {insights.performanceMetrics.highestEngagementTime}
                  </div>
                  <div className="text-sm text-muted-foreground">Peak Hour</div>
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {(insights.performanceMetrics.avgConfidenceOfSharedAnalyses * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Confidence of Shared Results</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}