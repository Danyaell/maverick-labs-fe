const rawApiBaseUrl:string = import.meta.env.VITE_API_BASE_URL as string

if (!rawApiBaseUrl) {
  throw new Error('Missing environment variable: VITE_API_BASE_URL')
}

export const API_BASE_URL: string = rawApiBaseUrl.replace(/\/$/, '')