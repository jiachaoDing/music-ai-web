type TaskPageProps = {
  task: {
    status: 'running' | 'done' | 'error'
    stage: string
    description: string
    progress: number
    canOpenSong: boolean
  }
  onOpenSong: () => void
  onReturnToChallenge?: () => void
  challengeTitle?: string
}

export function TaskPage({ task, onOpenSong, onReturnToChallenge, challengeTitle }: TaskPageProps) {
  const buttonLabel =
    task.status === 'error'
      ? '返回继续调整'
      : task.canOpenSong
        ? '查看生成结果'
        : '生成中...'

  return (
    <section className="page-stack">
      <div className="page-heading">
        <span>生成状态</span>
        <h1>{task.stage}</h1>
        <p>{task.description}</p>
      </div>
      <section className="task-panel">
        <div className="progress-bar">
          <span style={{ width: `${task.progress}%` }} />
        </div>
        <strong>{task.progress}%</strong>
        <button type="button" disabled={!task.canOpenSong} onClick={onOpenSong}>
          {buttonLabel}
        </button>
        {task.status === 'done' && onReturnToChallenge ? (
          <button type="button" onClick={onReturnToChallenge}>返回话题「{challengeTitle}」</button>
        ) : null}
      </section>
    </section>
  )
}
