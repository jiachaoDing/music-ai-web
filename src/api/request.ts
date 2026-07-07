const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

type ApiResult<T> = {
  code?: number
  message?: string
  data?: T
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('echo_token')

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  const result = (await response.json()) as ApiResult<T> | T

  if (!response.ok) {
    const message =
      typeof result === 'object' && result !== null && 'message' in result && result.message
        ? result.message
        : '请求失败'
    throw new Error(message)
  }

  if (typeof result === 'object' && result !== null && 'data' in result) {
    return result.data as T
  }

  return result as T
}
