/**
 * Root component — code-split routing, protected routes, page transitions.
 *
 * React.lazy + Suspense means each page bundle is fetched only when
 * the user first navigates to that route, keeping the initial JS payload small.
 * AnimatePresence receives location.key so it detects route changes correctly.
 */
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import { ROUTES } from './utils/constants'
import CustomCursor from './components/cursor/CustomCursor'
import ErrorBoundary from './components/ErrorBoundary'

// ── Lazy page imports (code splitting) ───────────────────────────────
const LandingPage       = lazy(() => import('./pages/LandingPage'))
const LoginPage         = lazy(() => import('./pages/LoginPage'))
const SignupPage        = lazy(() => import('./pages/SignupPage'))
const Dashboard         = lazy(() => import('./pages/Dashboard'))
const ResumeUpload      = lazy(() => import('./pages/ResumeUpload'))
const ATSScore          = lazy(() => import('./pages/ATSScore'))
const InterviewAnalyzer = lazy(() => import('./pages/InterviewAnalyzer'))
const Recommendations   = lazy(() => import('./pages/Recommendations'))
const HRDashboard       = lazy(() => import('./pages/HRDashboard'))
const Analytics         = lazy(() => import('./pages/Analytics'))
const Profile           = lazy(() => import('./pages/Profile'))
const Settings          = lazy(() => import('./pages/Settings'))
const JobsPage          = lazy(() => import('./pages/JobsPage'))

// ── Loading fallback ──────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/30 text-xs font-mono tracking-wider">Loading...</p>
    </div>
  </div>
)

// ── Route guards ──────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user)   return <Navigate to={ROUTES.login} replace />
  return children
}

const HRRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user)   return <Navigate to={ROUTES.login} replace />
  if (user.role !== 'hr') return <Navigate to={ROUTES.dashboard} replace />
  return children
}

// Redirect already-logged-in users away from login/signup
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (user)    return <Navigate to={user.role === 'hr' ? ROUTES.hr : ROUTES.dashboard} replace />
  return children
}

// ── App ───────────────────────────────────────────────────────────────
export default function App() {
  const location = useLocation()

  return (
    <ErrorBoundary>
      <CustomCursor />
      <Suspense fallback={<PageLoader />}>
        {/* key=location.pathname tells AnimatePresence when route changed */}
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path={ROUTES.home}   element={<LandingPage />} />
            <Route path={ROUTES.login}  element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path={ROUTES.signup} element={<GuestRoute><SignupPage /></GuestRoute>} />

            {/* Candidate-protected */}
            <Route path={ROUTES.dashboard}       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path={ROUTES.resume}          element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
            <Route path={ROUTES.ats}             element={<ProtectedRoute><ATSScore /></ProtectedRoute>} />
            <Route path={ROUTES.interview}       element={<ProtectedRoute><InterviewAnalyzer /></ProtectedRoute>} />
            <Route path={ROUTES.recommendations} element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
            <Route path={ROUTES.jobs}            element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
            <Route path={ROUTES.profile}         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path={ROUTES.settings}        element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* HR-only */}
            <Route path={ROUTES.hr}          element={<HRRoute><HRDashboard /></HRRoute>} />
            <Route path={ROUTES.hrAnalytics} element={<HRRoute><Analytics /></HRRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  )
}
