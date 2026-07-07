import type { SongMode } from '../types/song'

const modes: Array<[SongMode, string, string]> = [
  ['song', '常规创作', '一句话灵感生成完整歌曲'],
  ['meme', '梗歌制造机', '把热梗和吐槽变成旋律'],
  ['emotion', '情绪炼歌', '用今天的心情生成歌曲'],
  ['photo', '看图写歌', '上传图片补充文字要求'],
  ['foryou', '为 TA 写歌', '给指定对象写一首歌'],
]

type CreatePageProps = {
  onOpenForm: (mode: SongMode) => void
}

export function CreatePage({ onOpenForm }: CreatePageProps) {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <span>Create</span>
        <h1>选择创作方式</h1>
        <p>从普通歌曲、情绪日记、梗歌到为 TA 写歌，先进入统一创作表单。</p>
      </div>
      <section className="maker-banner">
        <div>
          <strong>AI 音乐制作人</strong>
          <span>一句话主题生成概念 EP，适合后续专辑流程扩展</span>
        </div>
        <button type="button" onClick={() => onOpenForm('album')}>
          开始制作
        </button>
      </section>
      <div className="mode-grid">
        {modes.map(([key, title, description]) => (
          <button className="mode-card" type="button" key={key} onClick={() => onOpenForm(key)}>
            <strong>{title}</strong>
            <span>{description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
