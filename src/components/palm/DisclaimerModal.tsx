import { AlertTriangle, Shield, Eye, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLanguageStore } from '@/store/language-store'

interface DisclaimerModalProps {
  open: boolean
  onAccept: () => void
}

export default function DisclaimerModal({ open, onAccept }: DisclaimerModalProps) {
  const { t } = useLanguageStore()
  
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-6 h-6 text-amber-500" />
            {t('disclaimer.title')}
          </DialogTitle>
          <DialogDescription>
            {t('disclaimer.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {/* Main Warning */}
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong className="text-base">{t('disclaimer.main_warning')}</strong>
              </AlertDescription>
            </Alert>

            {/* Service Nature */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                服務性質
              </h3>
              <div className="space-y-2 text-sm leading-relaxed pl-6">
                <p>• <strong>娛樂性質：</strong>本服務提供的手相分析純屬娛樂性質，基於傳統手相學說法，不具有科學實證基礎。</p>
                <p>• <strong>技術限制：</strong>分析結果由人工智慧算法產生，可能存在誤差，不應作為人生決策的唯一依據。</p>
                <p>• <strong>個人化程度：</strong>解讀內容為一般性描述，無法完全反映個人的獨特情況。</p>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                免責聲明
              </h3>
              <div className="space-y-2 text-sm leading-relaxed pl-6">
                <p>• <strong>醫療建議：</strong>本服務不提供任何醫療診斷、治療建議或健康指導，如有健康疑慮請諮詢專業醫師。</p>
                <p>• <strong>法律建議：</strong>本服務不提供任何法律意見或建議，法律問題請諮詢合格律師。</p>
                <p>• <strong>投資建議：</strong>本服務不提供任何投資、理財建議，投資決策請諮詢專業理財顧問。</p>
                <p>• <strong>人生決策：</strong>重要的人生決策應基於理性分析和專業諮詢，而非手相解讀結果。</p>
              </div>
            </div>

            {/* Privacy */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-500" />
                隱私保護
              </h3>
              <div className="space-y-2 text-sm leading-relaxed pl-6">
                <p>• <strong>圖片處理：</strong>您上傳的照片僅在瀏覽器本地處理，不會上傳至服務器。</p>
                <p>• <strong>資料保存：</strong>分析結果僅保存在您的設備上，我們不會收集或儲存您的個人資料。</p>
                <p>• <strong>匿名使用：</strong>本服務可匿名使用，無需提供個人身份資訊。</p>
              </div>
            </div>

            {/* Accuracy */}
            <div className="space-y-3">
              <h3 className="font-semibold">準確性說明</h3>
              <div className="space-y-2 text-sm leading-relaxed pl-6">
                <p>• 手相學缺乏科學實證基礎，被學術界歸類為偽科學</p>
                <p>• 分析結果受照片品質、光線條件、拍攝角度等因素影響</p>
                <p>• 人工智慧分析存在不確定性，結果僅供參考娛樂</p>
                <p>• 相同照片可能在不同時間產生不同分析結果</p>
              </div>
            </div>

            {/* Age Restriction */}
            <div className="space-y-3">
              <h3 className="font-semibold">使用限制</h3>
              <div className="space-y-2 text-sm leading-relaxed pl-6">
                <p>• 建議 18 歲以上成年人使用</p>
                <p>• 未成年人需在監護人同意下使用</p>
                <p>• 請勿過度依賴分析結果</p>
                <p>• 如有心理困擾，請尋求專業心理諮詢</p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col gap-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              點擊「我了解並同意」表示您已閱讀並理解上述條款，同意將本服務僅用於娛樂目的，
              並不會將分析結果作為重要決策的依據。
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={onAccept}
            className="w-full"
            size="lg"
          >
            {t('disclaimer.accept')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}