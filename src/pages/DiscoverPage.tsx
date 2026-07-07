import { mockBattles, mockChallenges, mockFortune } from '../mock/discovery'

export function DiscoverPage() {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <span>Discover</span>
        <h1>时运曲、话题挑战与 PK 擂台</h1>
        <p>聚合社区玩法入口，后续逐步接入挑战详情、投票和时运日历。</p>
      </div>
      <section className="fortune-card">
        <strong>今日时运：{mockFortune.keyword}</strong>
        <span>社交电量 {mockFortune.battery}% · 幸运数字 {mockFortune.luckyNumber}</span>
        <p>{mockFortune.encourage}</p>
      </section>
      <div className="two-column">
        <section className="content-panel">
          <h2>话题挑战</h2>
          {mockChallenges.map((challenge) => (
            <article className="list-item" key={challenge.id}>
              <strong>{challenge.emoji} {challenge.title}</strong>
              <span>{challenge.description}</span>
            </article>
          ))}
        </section>
        <section className="content-panel">
          <h2>PK 擂台</h2>
          {mockBattles.map((battle) => (
            <article className="list-item" key={battle.id}>
              <strong>{battle.topic}</strong>
              <span>{battle.votesA} : {battle.votesB}</span>
            </article>
          ))}
        </section>
      </div>
    </section>
  )
}
