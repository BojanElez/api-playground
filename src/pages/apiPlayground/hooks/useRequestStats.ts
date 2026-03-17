import { useMemo } from 'react';
import type { IRequestItem } from '../types';

type TRequestStats = {
  totalRequests: number;
  hasRequests: boolean;
  successPercentage: number;
  failedPercentage: number;
};

export const useRequestStats = (requests: IRequestItem[]): TRequestStats => {
  return useMemo(() => {
    let successCount = 0;
    let failedCount = 0;

    for (const item of requests) {
      if (item.requestState === 'success') {
        successCount += 1;
      }

      if (item.requestState === 'failed') {
        failedCount += 1;
      }
    }

    const totalRequests = requests.length;
    const successPercentage =
      totalRequests === 0 ? 0 : Math.round((successCount / totalRequests) * 100);
    const failedPercentage =
      totalRequests === 0 ? 0 : Math.round((failedCount / totalRequests) * 100);

    return {
      totalRequests,
      hasRequests: totalRequests > 0,
      successPercentage,
      failedPercentage,
    };
  }, [requests]);
};
