const themes = ['清晨通勤', '深夜自习', '雨天散步', '运动燃脂', '睡前放空', '代码专注']

export function RadioPage() {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <span>电台</span>
        <h1>此刻心情电台</h1>
        <p>展示 14 个心情场景，后续接入纯音乐生成任务。</p>
      </div>
      <div className="mode-grid">
        {themes.map((theme) => (
          <button className="mode-card" type="button" key={theme}>
            <strong>{theme}</strong>
            <span>生成一段适合此刻的 BGM</span>
          </button>
        ))}
      </div>
    </section>
  )
}
