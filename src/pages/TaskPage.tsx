type TaskPageProps = {
  task: {
    status: 'running' | 'done' | 'error'
    stage: string
    description: string
    progress: number
    canOpenSong: boolean
  }
  onOpenSong: () => void
}

export function TaskPage({ task, onOpenSong }: TaskPageProps) {
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
        <p>当前状态：{task.status === 'running' ? '生成中' : task.status === 'done' ? '已完成' : '失败'}</p>
        <button type="button" disabled={!task.canOpenSong} onClick={onOpenSong}>
          {buttonLabel}
        </button>
      </section>
    </section>
  )
}
