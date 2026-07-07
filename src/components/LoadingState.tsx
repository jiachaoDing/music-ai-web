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
