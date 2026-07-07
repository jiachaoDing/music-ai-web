import { NAV_ITEMS, type NavKey } from '../utils/constants'

type BottomNavProps = {
  active: NavKey
  onNavigate: (key: NavKey) => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {NAV_ITEMS.map((item) => (
        <button
          className={active === item.key ? 'bottom-nav__item is-active' : 'bottom-nav__item'}
          key={item.key}
          type="button"
          onClick={() => onNavigate(item.key)}
        >
          <span className={`bottom-nav__icon bottom-nav__icon--${item.key}`} aria-hidden="true" />
          <strong>{item.label}</strong>
        </button>
      ))}
    </nav>
  )
}
