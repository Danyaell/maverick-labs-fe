const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!rawApiBaseUrl) {
  throw new Error('Missing environment variable: VITE_API_BASE_URL')
}

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '')