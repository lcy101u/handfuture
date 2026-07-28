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
  onClose: () => void;
  onAccept: () => void;
}

export default function DisclaimerModal({
  open,
  onClose,
  onAccept,
}: DisclaimerModalProps) {
  const t = useLanguageStore((state) => state.t);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        className="max-h-[80vh] max-w-2xl"
        closeLabel={t("dialog.close")}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-amber-500" aria-hidden="true" />
            {t("disclaimer.title")}
          </DialogTitle>
          <DialogDescription>{t("disclaimer.subtitle")}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle
                className="h-5 w-5 text-amber-600"
                aria-hidden="true"
              />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>{t("disclaimer.warning")}</strong>
              </AlertDescription>
            </Alert>

            <section className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <Info className="h-4 w-4 text-blue-500" aria-hidden="true" />
                {t("disclaimer.serviceTitle")}
              </h3>
              <p className="pl-6 text-sm leading-relaxed">
                {t("disclaimer.service")}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <AlertTriangle
                  className="h-4 w-4 text-red-500"
                  aria-hidden="true"
                />
                {t("disclaimer.decisionsTitle")}
              </h3>
              <p className="pl-6 text-sm leading-relaxed">
                {t("disclaimer.decisions")}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <Eye className="h-4 w-4 text-green-500" aria-hidden="true" />
                {t("disclaimer.privacyTitle")}
              </h3>
              <p className="pl-6 text-sm leading-relaxed">
                {t("disclaimer.privacy")}
              </p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col gap-3">
          <Alert>
            <Info className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-xs">
              {t("disclaimer.final")}
            </AlertDescription>
          </Alert>
          <Button type="button" onClick={onAccept} className="w-full" size="lg">
            {t("disclaimer.accept")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
