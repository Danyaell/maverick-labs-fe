export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)

  if (!response.ok) {
    const details = await response.text()
    const message = details ? `${response.status} ${response.statusText}: ${details}` : `${response.status} ${response.statusText}`
    throw new Error(message)
  }

  return response.json() as Promise<T>
}
