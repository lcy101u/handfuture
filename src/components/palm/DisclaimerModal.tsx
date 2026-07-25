import { AlertTriangle, Eye, Info, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguageStore } from "@/store/language-store";

interface DisclaimerModalProps {
  open: boolean;
  onAccept: () => void;
}

const copy = {
  zh: {
    title: "使用條款與免責聲明",
    subtitle: "請先了解這項瀏覽器內娛樂功能如何運作。",
    warning: "這是非科學的文化娛樂與自我反思工具。",
    serviceTitle: "偵測與選卡方式",
    service:
      "模型只偵測 21 個手部關節位置，不會辨識或解讀掌紋、掌褶，也不會測量性格、能力、健康或命運。反思卡只依手部幾何固定選擇。",
    decisionsTitle: "重要決策",
    decisions:
      "請勿根據反思卡做出醫療、心理健康、法律、財務、工作、關係或其他重大決策；需要協助時，請諮詢合格專業人士。",
    privacyTitle: "隱私保護",
    privacy:
      "照片只在您的瀏覽器中處理，不會由本功能上傳。重新上傳或重設時，先前的照片與結果會從目前工作階段清除。",
    final:
      "按下同意代表您了解：這張卡不是科學評估或未來預測，只能作為娛樂性的反思起點。",
    accept: "我了解並同意（僅供娛樂與反思）",
  },
  en: {
    title: "Terms of Use & Disclaimer",
    subtitle: "Please understand how this in-browser entertainment feature works.",
    warning:
      "This is a non-scientific tool for cultural entertainment and self-reflection.",
    serviceTitle: "Detection and card selection",
    service:
      "The model detects only 21 hand-joint positions. It does not identify or interpret palm creases, and it does not measure personality, ability, health, or destiny. Hand geometry only makes the card selection deterministic.",
    decisionsTitle: "Consequential decisions",
    decisions:
      "Do not rely on a reflection card for medical, mental-health, legal, financial, employment, relationship, or other consequential decisions. Consult a qualified professional when needed.",
    privacyTitle: "Privacy",
    privacy:
      "The photo is processed only in your browser and is not uploaded by this feature. Uploading another image or resetting clears the prior photo and result from the current session.",
    final:
      "By accepting, you understand that the card is not a scientific assessment or a forecast, only an entertainment prompt for reflection.",
    accept: "I understand and agree (entertainment and reflection only)",
  },
} as const;

export default function DisclaimerModal({
  open,
  onAccept,
}: DisclaimerModalProps) {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const text = copy[currentLanguage];

  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent className="max-h-[80vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-amber-500" aria-hidden="true" />
            {text.title}
          </DialogTitle>
          <DialogDescription>{text.subtitle}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle
                className="h-5 w-5 text-amber-600"
                aria-hidden="true"
              />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>{text.warning}</strong>
              </AlertDescription>
            </Alert>

            <section className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <Info className="h-4 w-4 text-blue-500" aria-hidden="true" />
                {text.serviceTitle}
              </h3>
              <p className="pl-6 text-sm leading-relaxed">{text.service}</p>
            </section>

            <section className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <AlertTriangle
                  className="h-4 w-4 text-red-500"
                  aria-hidden="true"
                />
                {text.decisionsTitle}
              </h3>
              <p className="pl-6 text-sm leading-relaxed">{text.decisions}</p>
            </section>

            <section className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <Eye className="h-4 w-4 text-green-500" aria-hidden="true" />
                {text.privacyTitle}
              </h3>
              <p className="pl-6 text-sm leading-relaxed">{text.privacy}</p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col gap-3">
          <Alert>
            <Info className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-xs">{text.final}</AlertDescription>
          </Alert>
          <Button type="button" onClick={onAccept} className="w-full" size="lg">
            {text.accept}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
