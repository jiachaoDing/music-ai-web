type TaskPageProps = {
  task: {
    status: 'queued' | 'running' | 'done' | 'error'
    stage: string
    description: string
    progress: number
    canOpenSong: boolean
    queueAhead?: number
    active?: number
    maxConcurrency?: number
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
        {task.status === 'queued' ? (
          <div className="task-queue" aria-label="任务排队状态">
            <div>
              <span>前方请求</span>
              <strong>{task.queueAhead ?? 0}</strong>
            </div>
            <div>
              <span>占用通道</span>
              <strong>{task.active ?? '--'}</strong>
            </div>
            <div>
              <span>通道上限</span>
              <strong>{task.maxConcurrency ?? '--'}</strong>
            </div>
          </div>
        ) : null}
        <div className="progress-bar">
          <span style={{ width: `${task.progress}%` }} />
        </div>
        <strong className="task-progress-value">{task.progress}%</strong>
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
