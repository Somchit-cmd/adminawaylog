import { toast } from "sonner";

// Input sanitization
export const sanitizeInput = (input: string | null | undefined): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Basic XSS prevention
    .replace(/[&'"]/g, '') // Additional character sanitization
    .trim();
};

// Rate limiting for exports
const exportRateLimit = {
  lastExport: 0,
  cooldownPeriod: 5000, // 5 seconds between exports
};

export const checkExportRateLimit = (): boolean => {
  const now = Date.now();
  if (now - exportRateLimit.lastExport < exportRateLimit.cooldownPeriod) {
    toast.error("Please wait a few seconds before exporting again");
    return false;
  }
  exportRateLimit.lastExport = now;
  return true;
};

// Search throttling
const searchThrottle = {
  timer: null as NodeJS.Timeout | null,
  lastSearch: 0,
  minDelay: 300, // Minimum time between searches (ms)
};

export const throttleSearch = (callback: () => void): void => {
  if (searchThrottle.timer) {
    clearTimeout(searchThrottle.timer);
  }

  const now = Date.now();
  const timeSinceLastSearch = now - searchThrottle.lastSearch;

  if (timeSinceLastSearch < searchThrottle.minDelay) {
    searchThrottle.timer = setTimeout(() => {
      callback();
      searchThrottle.lastSearch = Date.now();
    }, searchThrottle.minDelay - timeSinceLastSearch);
  } else {
    callback();
    searchThrottle.lastSearch = now;
  }
};

// Error handling
export const handleError = (error: unknown, defaultMessage: string = "An error occurred"): string => {
  console.error("Error details:", error);
  if (error instanceof Error) {
    // Only return generic error message in production
    return process.env.NODE_ENV === 'production' 
      ? defaultMessage 
      : error.message;
  }
  return defaultMessage;
}; 