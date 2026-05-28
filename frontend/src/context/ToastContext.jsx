/**
 * Custom toast notification system.
 * Replaces the react-hot-toast dependency with a zero-dependency
 * animated toast context that matches the app's glass aesthetic.
 *
 * Usage:
 *   const { toast } = useToast()
 *   toast.success('Resume uploaded!')
 *   toast.error('Something went wrong.')
 *   toast.info('Analyzing your data...')
 *   toast.warning('File size is near the limit.')
 */
import { createContext, useContext, useState, useCallback, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: { Icon: CheckCircle, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  error:   { Icon: XCircle,     color: 'text-rose-400',    border: 'border-rose-500/30',    bg: 'bg-rose-500/10'    },
  warning: { Icon: AlertCircle, color: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/10'   },
  info:    { Icon: Info,        color: 'text-blue-400',    border: 'border-blue-500/30',    bg: 'bg-blue-500/10'    },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  let counter = 0

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = `toast-${Date.now()}-${++counter}`
    setToasts((t) => [...t.slice(-4), { id, message, type }]) // max 5 at once
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [dismiss])

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error:   (msg, dur) => addToast(msg, 'error',   dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info:    (msg, dur) => addToast(msg, 'info',    dur),
    dismiss,
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 w-80 pointer-events-none"
      >
        <AnimatePresence initial={false}>
          {toasts.map(({ id, message, type }) => {
            const { Icon, color, border, bg } = ICONS[type] || ICONS.info
            return (
              <motion.div
                key={id}
                role="alert"
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0,  scale: 1    }}
                exit={{    opacity: 0, x: 60, scale: 0.9  }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${border} ${bg} backdrop-blur-md p-3.5 shadow-lg`}
              >
                <Icon className={`${color} shrink-0 mt-0.5`} size={18} />
                <p className="text-white/90 text-sm leading-snug flex-1">{message}</p>
                <button
                  onClick={() => dismiss(id)}
                  aria-label="Dismiss notification"
                  className="text-white/30 hover:text-white/70 transition-colors shrink-0"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
