import { MessageCircleQuestion } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REFLECTION_CARDS } from "@/lib/reflection-engine";
import { useLanguageStore } from "@/store/language-store";
import { usePalmStore } from "@/store/palm-store";

export default function ReflectionResult() {
  const reflectionKey = usePalmStore((state) => state.reflectionKey);
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);

  if (!reflectionKey) return null;

  const card = REFLECTION_CARDS[reflectionKey][currentLanguage];

  return (
    <Card className="palm-card" aria-labelledby="reflection-card-title">
      <CardHeader>
        <CardTitle
          id="reflection-card-title"
          className="flex items-center gap-2"
        >
          <MessageCircleQuestion className="h-5 w-5" aria-hidden="true" />
          {card.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium leading-relaxed">{card.prompt}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {card.context}
        </p>
        <Alert>
          <AlertDescription>{card.disclaimer}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
