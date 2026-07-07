import type { CSSProperties } from 'react'
import type { BattleRecord, ChallengeRecord, ChallengeSongRef, FortuneRecord } from './types'

type DiscoverHomePageProps = {
  challenges: ChallengeRecord[]
  challengeSongRefs: ChallengeSongRef[]
  battles: BattleRecord[]
  todayFortune: FortuneRecord
  onOpenChallenge: (challengeId: string) => void
  onNavigateFortune: () => void
  onNavigateBattles: () => void
}

export function DiscoverHomePage({
  challenges,
  challengeSongRefs,
  battles,
  todayFortune,
  onOpenChallenge,
  onNavigateFortune,
  onNavigateBattles,
}: DiscoverHomePageProps) {
  const featuredChallenge = challenges[0]
  const activeWorks = challengeSongRefs.length
  const battleVotes = battles.reduce((total, battle) => total + battle.aVotes + battle.bVotes, 0)

  return (
    <div className="discover-overview">
      <section className="overview-lead" style={{ '--feature-color': todayFortune.luckyColor.hex } as CSSProperties}>
        <div>
          <span>今日推荐</span>
          <h2>{todayFortune.keyword}电量 {todayFortune.battery}%</h2>
          <p>连续签到 {todayFortune.streak} 天，生成一首带着今日关键词的时运曲。</p>
        </div>
        <button type="button" onClick={onNavigateFortune}>进入时运日历</button>
      </section>

      <section className="overview-side">
        <article className="overview-mini-card overview-mini-card--challenge" style={{ '--feature-color': featuredChallenge.color } as CSSProperties}>
          <span>灵感入口</span>
          <strong>{featuredChallenge.title}</strong>
          <p>{featuredChallenge.desc}</p>
          <button type="button" onClick={() => onOpenChallenge(featuredChallenge.id)}>参与挑战</button>
        </article>
        <article className="overview-mini-card overview-mini-card--battle">
          <span>PK 擂台</span>
          <strong>{battles.length} 场对决开放中</strong>
          <p>听完两首歌，再把票投给更打动你的那一边。</p>
          <button type="button" onClick={onNavigateBattles}>进入擂台</button>
        </article>
      </section>

      <section className="overview-panel">
        <div className="overview-stat">
          <span>话题作品</span>
          <strong>{activeWorks}</strong>
          <small>首作品正在挑战中</small>
        </div>
        <div className="overview-stat">
          <span>PK 投票</span>
          <strong>{battleVotes}</strong>
          <small>票已投入擂台</small>
        </div>
        <div className="overview-stat">
          <span>时运曲</span>
          <strong>{todayFortune.keyword}</strong>
          <small>{todayFortune.mood.name}</small>
        </div>
      </section>

      <section className="overview-challenges">
        <div className="section-title">
          <div>
            <span>Topic Picks</span>
            <h2>正在发生的话题</h2>
          </div>
        </div>
        <div className="overview-card-grid">
          {challenges.map((challenge) => (
            <button
              className="overview-card"
              key={challenge.id}
              style={{ '--feature-color': challenge.color } as CSSProperties}
              type="button"
              onClick={() => onOpenChallenge(challenge.id)}
            >
              <span>话题挑战</span>
              <strong>{challenge.title}</strong>
              <small>{challengeSongRefs.filter((ref) => ref.challengeId === challenge.id).length} 首作品已参与</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
