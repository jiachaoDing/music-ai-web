type BackButtonProps = {
  label?: string
  onClick: () => void
  className?: string
}

export function BackButton({ label = '返回', onClick, className = '' }: BackButtonProps) {
  return (
    <button
      className={`echo-back-button ${className}`.trim()}
      type="button"
      onClick={onClick}
      aria-label={label}
    >
      <span aria-hidden="true">←</span>
      {label}
    </button>
  )
}
