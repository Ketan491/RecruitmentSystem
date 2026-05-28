/**
 * React Error Boundary — catches rendering errors anywhere in the tree
 * and shows a friendly recovery screen instead of a blank white page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 */
import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production you'd send this to a monitoring service
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="text-red-400" size={28} />
            </div>
          </div>

          <div>
            <h1 className="text-white text-xl font-semibold mb-2">
              Something went wrong
            </h1>
            <p className="text-white/50 text-sm leading-relaxed">
              An unexpected error occurred. You can try refreshing the page
              or return to the dashboard.
            </p>
          </div>

          {/* Show error detail in development only */}
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-left text-xs text-red-300/70 bg-red-950/30 border border-red-500/10 rounded-xl p-4 overflow-auto max-h-40">
              {this.state.error.message}
            </pre>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors"
            >
              <RefreshCw size={14} />
              Try again
            </button>
            <a
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
            >
              Go to dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
