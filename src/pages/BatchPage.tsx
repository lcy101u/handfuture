import React from 'react';
import { BatchProcessor } from '@/components/palm/BatchProcessor';
import { useLanguageStore } from '@/store/language-store';
import { useAnalyticsStore } from '@/store/analytics-store';

export function BatchPage() {
  const { t } = useLanguageStore();
  const { trackPageView } = useAnalyticsStore();

  React.useEffect(() => {
    trackPageView('/batch');
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950">
      <div className="container mx-auto px-4 py-8">
        <BatchProcessor />
      </div>
    </div>
  );
}