export function formatDuration(seconds?: number) {
  if (!seconds) return '--:--'

  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60

  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

export function formatCount(count: number) {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return String(count)
}
