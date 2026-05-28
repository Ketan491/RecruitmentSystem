/**
 * App-wide constants — routes, API paths, and config values.
 * Centralising these means a single rename here propagates everywhere.
 */

// ── Route paths ───────────────────────────────────────────────────────
export const ROUTES = {
  home:            '/',
  login:           '/login',
  signup:          '/signup',

  // Candidate routes
  dashboard:       '/dashboard',
  resume:          '/resume',
  ats:             '/ats',
  interview:       '/interview',
  recommendations: '/recommendations',
  jobs:            '/jobs',
  profile:         '/profile',
  settings:        '/settings',

  // HR-only routes
  hr:              '/hr',
  hrAnalytics:     '/hr/analytics',
}

// ── API namespaces ────────────────────────────────────────────────────
export const API = {
  auth: {
    login:  '/api/auth/login',
    signup: '/api/auth/signup',
    me:     '/api/auth/me',
  },
  resume: {
    upload: '/api/resume/upload',
    my:     '/api/resume/my',
    list:   '/api/resume/list',
  },
  ats:             '/api/ats/score',
  interview:       '/api/interview/analyze',
  recommendations: '/api/recommendations',
  jobs:            '/api/jobs',
  users: {
    profile: '/api/users/profile',
    stats:   '/api/users/stats',
  },
  hr: {
    candidates: '/api/hr/candidates',
    analytics:  '/api/hr/analytics',
  },
}

// ── App config ────────────────────────────────────────────────────────
export const APP_NAME = 'RecruitAI'
export const MAX_RESUME_SIZE_MB = 5
export const SUPPORTED_FILE_TYPES = ['.pdf']
