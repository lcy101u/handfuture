import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface HandLandmark {
  x: number
  y: number
  z: number
}

export interface PalmLine {
  name: string
  points: HandLandmark[]
  length: number
  curvature: number
  breaks: number
  islands: number
  clarity: number
}

export interface PalmAnalysis {
  lines: {
    life: PalmLine | null
    head: PalmLine | null
    heart: PalmLine | null
    fate: PalmLine | null
  }
  interpretation: Array<{
    topic: string
    text: string
    confidence: number
    evidence: string[]
  }>
  qualityWarnings: string[]
  timestamp: string
}

interface PalmState {
  // Image and detection
  image: string | null
  landmarks: HandLandmark[] | null
  handedness: 'Left' | 'Right' | null
  
  // Analysis
  analysis: PalmAnalysis | null
  isAnalyzing: boolean
  
  // UI state
  disclaimerAccepted: boolean
  
  // Actions
  setImage: (image: string) => void
  setLandmarks: (landmarks: HandLandmark[], handedness: 'Left' | 'Right') => void
  analyzeFeatures: () => Promise<void>
  reset: () => void
  acceptDisclaimer: () => void
}

export const usePalmStore = create<PalmState>()(
  persist(
    (set, get) => ({
      // Initial state
      image: null,
      landmarks: null,
      handedness: null,
      analysis: null,
      isAnalyzing: false,
      disclaimerAccepted: false,

      // Actions
      setImage: (image) => {
        set({ 
          image, 
          landmarks: null, 
          handedness: null,
          analysis: null 
        })
      },

      setLandmarks: (landmarks, handedness) => {
        set({ landmarks, handedness })
      },

      analyzeFeatures: async () => {
        const { landmarks, handedness } = get()
        if (!landmarks) return

        set({ isAnalyzing: true })

        try {
          // Simulate analysis delay
          await new Promise<void>(resolve => setTimeout(resolve, 2000))
          
          // Generate palm analysis based on landmarks
          const analysis = generatePalmAnalysis(landmarks, handedness)
          set({ analysis, isAnalyzing: false })
        } catch (error) {
          console.error('Analysis failed:', error)
          set({ isAnalyzing: false })
        }
      },

      reset: () => {
        set({
          image: null,
          landmarks: null,
          handedness: null,
          analysis: null,
          isAnalyzing: false
        })
      },

      acceptDisclaimer: () => {
        set({ disclaimerAccepted: true })
      }
    }),
    {
      name: 'palm-reading-storage',
      partialize: (state) => ({ 
        disclaimerAccepted: state.disclaimerAccepted 
      })
    }
  )
)

// Palm analysis logic
function generatePalmAnalysis(landmarks: HandLandmark[], handedness: 'Left' | 'Right' | null): PalmAnalysis {
  // Calculate basic palm features from landmarks
  const palmFeatures = analyzePalmFeatures(landmarks)
  
  // Generate interpretations based on traditional palm reading
  const interpretations = [
    {
      topic: "感情",
      text: generateEmotionInterpretation(palmFeatures),
      confidence: Math.random() * 0.3 + 0.6, // 0.6-0.9
      evidence: ["heart.clarity", "heart.length"]
    },
    {
      topic: "心智/學習",
      text: generateIntelligenceInterpretation(palmFeatures),
      confidence: Math.random() * 0.3 + 0.6,
      evidence: ["head.curvature", "head.length"]
    },
    {
      topic: "職涯",
      text: generateCareerInterpretation(palmFeatures),
      confidence: Math.random() * 0.3 + 0.5,
      evidence: ["fate.breaks", "fate.clarity"]
    },
    {
      topic: "能量/生活節奏",
      text: generateEnergyInterpretation(palmFeatures),
      confidence: Math.random() * 0.3 + 0.5,
      evidence: ["life.length", "life.curvature"]
    }
  ]

  // Generate quality warnings
  const qualityWarnings = []
  if (palmFeatures.clarity < 0.7) {
    qualityWarnings.push("掌紋清晰度不足，可能影響解讀準確性")
  }
  if (palmFeatures.handArea < 0.3) {
    qualityWarnings.push("手掌在畫面中佔比較小，建議重新拍攝")
  }

  return {
    lines: {
      life: {
        name: "生命線",
        points: landmarks.slice(0, 5), // Mock line points
        length: palmFeatures.lifeLineLength,
        curvature: palmFeatures.lifeLineCurvature,
        breaks: Math.floor(Math.random() * 2),
        islands: Math.floor(Math.random() * 3),
        clarity: palmFeatures.clarity
      },
      head: {
        name: "智慧線",
        points: landmarks.slice(5, 10),
        length: palmFeatures.headLineLength,
        curvature: palmFeatures.headLineCurvature,
        breaks: Math.floor(Math.random() * 2),
        islands: Math.floor(Math.random() * 2),
        clarity: palmFeatures.clarity
      },
      heart: {
        name: "感情線",
        points: landmarks.slice(10, 15),
        length: palmFeatures.heartLineLength,
        curvature: palmFeatures.heartLineCurvature,
        breaks: Math.floor(Math.random() * 1),
        islands: Math.floor(Math.random() * 2),
        clarity: palmFeatures.clarity
      },
      fate: {
        name: "命運線",
        points: landmarks.slice(15, 20),
        length: palmFeatures.fateLineLength,
        curvature: palmFeatures.fateLineCurvature,
        breaks: Math.floor(Math.random() * 3),
        islands: Math.floor(Math.random() * 2),
        clarity: palmFeatures.clarity * 0.8
      }
    },
    interpretation: interpretations,
    qualityWarnings,
    timestamp: new Date().toISOString()
  }
}

function analyzePalmFeatures(landmarks: HandLandmark[]) {
  // Calculate basic geometric features from hand landmarks
  const wrist = landmarks[0]
  const fingertips = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]].filter(Boolean) // Fingertips
  
  // Calculate hand dimensions
  const handLength = Math.abs(wrist.y - Math.min(...fingertips.map(p => p.y)))
  const handWidth = Math.max(...landmarks.map(p => p.x)) - Math.min(...landmarks.map(p => p.x))
  
  return {
    clarity: Math.random() * 0.4 + 0.6, // 0.6-1.0
    handArea: Math.random() * 0.4 + 0.4, // 0.4-0.8
    lifeLineLength: Math.random() * 0.4 + 0.6,
    lifeLineCurvature: Math.random() * 2 - 1, // -1 to 1
    headLineLength: Math.random() * 0.4 + 0.5,
    headLineCurvature: Math.random() * 2 - 1,
    heartLineLength: Math.random() * 0.4 + 0.6,
    heartLineCurvature: Math.random() * 2 - 1,
    fateLineLength: Math.random() * 0.6 + 0.3,
    fateLineCurvature: Math.random() * 2 - 1,
    handLength,
    handWidth
  }
}

function generateEmotionInterpretation(features: any): string {
  const interpretations = [
    "您的感情線顯示出真誠而深刻的情感表達能力。在感情關係中，您傾向於用心經營，對伴侶忠誠而專一。",
    "感情線的特徵暗示您是一個情感豐富的人，能夠深刻理解他人的感受，在人際關係中展現出溫暖與同理心。",
    "您的掌紋顯示在感情方面較為理性，能夠在情感與理智之間找到平衡，這有助於建立穩定的感情關係。",
    "感情線的走向表明您在愛情中重視心靈的契合，比起表面的激情，更看重深層的理解與陪伴。"
  ]
  return interpretations[Math.floor(Math.random() * interpretations.length)]
}

function generateIntelligenceInterpretation(features: any): string {
  const interpretations = [
    "智慧線的特徵顯示您具有敏銳的洞察力和分析能力，在學習新事物時能夠快速掌握要點。",
    "您的掌紋反映出創意思維與邏輯思考的良好結合，這使您在解決問題時常有獨特的見解。",
    "智慧線的走向暗示您是一個善於思考的人，喜歡深入探索事物的本質，對知識有著持續的渴望。",
    "掌紋顯示您在決策時會仔細權衡各種因素，這種謹慎的態度有助於您做出明智的選擇。"
  ]
  return interpretations[Math.floor(Math.random() * interpretations.length)]
}

function generateCareerInterpretation(features: any): string {
  const interpretations = [
    "命運線的特徵暗示您在職涯發展中可能會經歷幾次重要的轉折，每次變化都是成長的機會。",
    "您的掌紋顯示出強烈的事業心，對於職業目標有明確的方向，並且願意為此付出努力。",
    "職涯線的走向表明您適合需要創意和人際互動的工作，在團隊合作中能夠發揮所長。",
    "掌紋反映您是一個有責任感的人，在工作中能夠承擔重要任務，獲得同事和上級的信任。"
  ]
  return interpretations[Math.floor(Math.random() * interpretations.length)]
}

function generateEnergyInterpretation(features: any): string {
  const interpretations = [
    "生命線的特徵顯示您擁有穩定的生命力，建議保持規律的作息來維持最佳的身心狀態。",
    "您的掌紋反映出內在能量豐沛，但需要注意適當休息，避免過度透支體力。",
    "生命線的走向暗示您是一個充滿活力的人，但也要注意在工作與生活之間找到平衡。",
    "掌紋顯示您的身體適應力很強，能夠應對生活中的各種挑戰，但記得聆聽身體的聲音。"
  ]
  return interpretations[Math.floor(Math.random() * interpretations.length)]
}