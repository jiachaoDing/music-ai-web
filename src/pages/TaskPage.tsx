import type { AiTask } from '../types/task'

type TaskPageProps = {
  task: AiTask
  onOpenSong: () => void
}

export function TaskPage({ task, onOpenSong }: TaskPageProps) {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <span>生成状态</span>
        <h1>{task.stage ?? 'AI 任务处理中'}</h1>
        <p>后续接入任务轮询，展示 queued、running、done、error。</p>
      </div>
      <section className="task-panel">
        <div className="progress-bar">
          <span style={{ width: `${task.progress}%` }} />
        </div>
        <strong>{task.progress}%</strong>
        <p>当前状态：{task.status}</p>
        <button type="button" onClick={onOpenSong}>
          查看生成结果
        </button>
      </section>
    </section>
  )
}
