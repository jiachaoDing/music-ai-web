type LoadingStateProps = {
  title?: string
  description?: string
}

export function LoadingState({
  title = '加载中',
  description = '正在获取最新内容',
}: LoadingStateProps) {
  return (
    <div className="state-box">
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  )
}

export function PageLoadingState() {
  return (
    <div className="page-loading-state" role="status" aria-label="正在加载页面">
      <span className="page-loading-spinner" aria-hidden="true" />
      <span className="sr-only">正在加载页面</span>
    </div>
  )
}
