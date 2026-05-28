/**
 * Axios instance with base URL, auth interceptors, and namespaced API helpers.
 * Each namespace (authAPI, resumeAPI, …) wraps raw axios calls so pages
 * never construct URLs themselves — they use the typed helpers instead.
 */
import axios from 'axios'
import { API } from './constants'

// ── Axios instance ─────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
})

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — but NOT for /api/auth/me (session-restore ping)
// so AuthContext can clear the token silently without a redirect loop.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url    = error.config?.url || ''
    const is401  = error.response?.status === 401
    const isMePing = url.includes('/api/auth/me')

    if (is401 && !isMePing) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ── Namespaced API helpers ────────────────────────────────────────────

export const authAPI = {
  login:  (email, password) =>
    api.post(API.auth.login, { email, password }).then(r => r.data),
  signup: (data) =>
    api.post(API.auth.signup, data).then(r => r.data),
  getMe:  () =>
    api.get(API.auth.me).then(r => r.data),
}

export const resumeAPI = {
  upload: (file, onProgress) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(API.resume.upload, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }).then(r => r.data)
  },
  getMy:  () => api.get(API.resume.my).then(r => r.data),
  list:   () => api.get(API.resume.list).then(r => r.data),
}

export const atsAPI = {
  score: (resumeText, jobDescription) =>
    api.post(API.ats, { resume_text: resumeText, job_description: jobDescription })
       .then(r => r.data),
}

export const interviewAPI = {
  analyze: (data) => api.post(API.interview, data).then(r => r.data),
}

export const recommendationsAPI = {
  get: () => api.get(API.recommendations).then(r => r.data),
}

export const jobsAPI = {
  list:   (params) => api.get(API.jobs, { params }).then(r => r.data),
  get:    (id)     => api.get(`${API.jobs}/${id}`).then(r => r.data),
  create: (data)   => api.post(API.jobs, data).then(r => r.data),
  remove: (id)     => api.delete(`${API.jobs}/${id}`).then(r => r.data),
}

export const usersAPI = {
  updateProfile: (data) => api.put(API.users.profile, data).then(r => r.data),
  getStats:      ()     => api.get(API.users.stats).then(r => r.data),
}

export const hrAPI = {
  getCandidates: () => api.get(API.hr.candidates).then(r => r.data),
  getAnalytics:  () => api.get(API.hr.analytics).then(r => r.data),
}
