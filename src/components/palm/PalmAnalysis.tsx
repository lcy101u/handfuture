import { Heart, Brain, Briefcase, Zap, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { usePalmStore } from '@/store/palm-store'

const topicIcons = {
  '感情': Heart,
  '心智/學習': Brain,
  '職涯': Briefcase,
  '能量/生活節奏': Zap
}

const topicColors = {
  '感情': 'text-red-500',
  '心智/學習': 'text-blue-500',
  '職涯': 'text-green-500',
  '能量/生活節奏': 'text-amber-500'
}

export default function PalmAnalysis() {
  const { analysis } = usePalmStore()

  if (!analysis) return null

  return (
    <div className="space-y-6">
      {/* Quality Warnings */}
      {analysis.qualityWarnings.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {analysis.qualityWarnings.map((warning, index) => (
                <p key={index}>• {warning}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Analysis Cards */}
      <div className="space-y-4">
        {analysis.interpretation.map((item, index) => {
          const Icon = topicIcons[item.topic as keyof typeof topicIcons] || TrendingUp
          const colorClass = topicColors[item.topic as keyof typeof topicColors] || 'text-primary'
          
          return (
            <Card key={index} className="palm-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className={`w-5 h-5 ${colorClass}`} />
                    {item.topic}
                  </CardTitle>
                  <Badge 
                    variant={item.confidence >= 0.7 ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    信心度 {Math.round(item.confidence * 100)}%
                  </Badge>
                </div>
                <Progress 
                  value={item.confidence * 100} 
                  className="h-2"
                />
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {item.text}
                </p>
                
                {/* Evidence */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">分析依據：</p>
                  <div className="flex flex-wrap gap-1">
                    {item.evidence.map((evidence, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {evidence}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Palm Lines Summary */}
      <Card className="palm-card">
        <CardHeader>
          <CardTitle>掌紋特徵</CardTitle>
          <CardDescription>
            主要掌紋的基本特徵分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analysis.lines).map(([lineKey, line]) => {
              if (!line) return null
              
              return (
                <div key={lineKey} className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-primary rounded-full" />
                    {line.name}
                  </h4>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>長度</span>
                      <span>{(line.length * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>清晰度</span>
                      <span>{(line.clarity * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>斷裂</span>
                      <span>{line.breaks} 處</span>
                    </div>
                    {line.islands > 0 && (
                      <div className="flex justify-between">
                        <span>島紋</span>
                        <span>{line.islands} 個</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timestamp */}
      <div className="text-center text-xs text-muted-foreground">
        分析時間：{new Date(analysis.timestamp).toLocaleString('zh-TW')}
      </div>
    </div>
  )
}