const rawApiBaseUrl:string = import.meta.env.VITE_API_BASE_URL as string

if (!rawApiBaseUrl) {
  throw new Error('Missing environment variable: VITE_API_BASE_URL')
}

export const API_BASE_URL: string = rawApiBaseUrl.replace(/\/$/, '')

const DEFAULT_API_DOCS_URL = 'https://maverick-labs-be-production.up.railway.app/swagger-ui.html'

const rawApiDocsUrl = import.meta.env.VITE_API_DOCS_URL as string | undefined
const resolvedApiDocsUrl =
  rawApiDocsUrl && rawApiDocsUrl.trim().length > 0 ? rawApiDocsUrl : DEFAULT_API_DOCS_URL

export const API_DOCS_URL: string = resolvedApiDocsUrl.replace(/\/$/, '')

export const BACKEND_REPOSITORY_URL = 'https://github.com/Danyaell/maverick-labs-be'