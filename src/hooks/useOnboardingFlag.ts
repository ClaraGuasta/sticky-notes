import { useCallback, useState } from 'react';

const STORAGE_KEY = 'sticky-notes:onboarding-done';

const readFlag = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false; // storage can be unavailable (e.g. disabled by privacy settings)
  }
};

export function useOnboardingFlag() {
  const [isDone, setIsDone] = useState(readFlag);

  const markDone = useCallback(() => {
    setIsDone(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // non-critical: worst case the tip shows again next session
    }
  }, []);

  return { isDone, markDone };
}