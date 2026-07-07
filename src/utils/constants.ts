export const NAV_ITEMS = [
  { key: 'feed', label: '首页' },
  { key: 'discover', label: '发现' },
  { key: 'create', label: '创作' },
  { key: 'radio', label: '电台' },
  { key: 'me', label: '我的' },
] as const

export type NavKey = (typeof NAV_ITEMS)[number]['key']
