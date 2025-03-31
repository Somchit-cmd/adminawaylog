// CSP Directives
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:", "blob:"],
  'font-src': ["'self'", "data:", "https:"],
  'connect-src': [
    "'self'",
    "https://*.firebaseio.com",
    "https://*.googleapis.com",
    "https://*.google.com",
    "wss://*.firebaseio.com"
  ],
  'frame-src': ["'self'", "https://*.firebaseapp.com"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

// Generate CSP string
const generateCsp = () => {
  return Object.entries(cspDirectives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
};

// Security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': generateCsp(),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}; 