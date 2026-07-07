export const discoverStyles = `
.discover-suite {
  --cream: #fbfafd;
  --mist: #f5f7fb;
  --glass: rgba(255, 255, 255, 0.78);
  --line-soft: rgba(15, 23, 42, 0.08);
  --pink: #ea4c89;
  --orange: #fb923c;
  --blue: #38bdf8;
  --green: #34d399;
  --yellow: #facc15;
  --ink-soft: #24203a;
  gap: clamp(16px, 2.4vw, 28px);
  margin: -8px;
  border-radius: 24px;
  padding: clamp(12px, 2vw, 22px);
  background:
    radial-gradient(circle at 8% 8%, rgba(234, 76, 137, 0.11), transparent 28%),
    radial-gradient(circle at 88% 12%, rgba(56, 189, 248, 0.11), transparent 26%),
    linear-gradient(135deg, var(--cream), var(--mist));
}

.discover-suite span {
  color: inherit;
}

.discover-hero,
.playground-stage,
.playground-rail,
.overview-lead,
.overview-mini-card,
.overview-stat,
.overview-card,
.dashed-box,
.fortune-draft-card,
.generated-song {
  border: 1px solid rgba(255, 255, 255, 0.86);
  border-radius: 16px;
  background: var(--glass);
  box-shadow: 0 16px 46px rgba(31, 41, 55, 0.07);
  backdrop-filter: blur(18px);
}

.discover-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(14px, 2vw, 24px);
  padding: clamp(20px, 3.5vw, 38px);
  color: var(--ink-soft);
  background:
    radial-gradient(circle at 78% 22%, rgba(234, 76, 137, 0.18), transparent 26%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.86), rgba(255, 245, 250, 0.78));
}

.discover-hero span,
.section-title span,
.stage-heading span,
.stage-hero span,
.rail-title,
.dashed-box > span,
.overview-lead span,
.overview-mini-card span,
.overview-card span,
.fortune-draft-card span,
.fortune-poster span,
.generated-song span {
  color: var(--pink);
  font-size: clamp(11px, 1.2vw, 13px);
  font-weight: 860;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.discover-hero h1,
.overview-lead h2,
.stage-hero h2,
.fortune-daily h2 {
  margin: 8px 0;
  max-width: 860px;
  color: #0d0c22;
  font-size: clamp(28px, 4.8vw, 58px);
  line-height: 1.02;
}

.discover-hero p,
.overview-lead p,
.overview-mini-card p,
.stage-hero p,
.fortune-daily p,
.generated-song p {
  margin: 0;
  max-width: 760px;
  color: var(--muted);
  font-size: clamp(14px, 1.45vw, 17px);
  line-height: 1.65;
}

.discover-hero__actions,
.fortune-actions,
.generated-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.discover-hero__actions button,
.overview-lead button,
.overview-mini-card button,
.overview-card button,
.fortune-actions button,
.generated-actions button,
.battle-new-actions button,
.stage-heading button,
.dashed-box button,
.battle-song button:not(.song-cover),
.fortune-poster button {
  min-height: clamp(38px, 4.7vw, 48px);
  border-radius: 999px;
  padding: 0 clamp(14px, 2.5vw, 24px);
  font-size: clamp(12px, 1.5vw, 15px);
  font-weight: 850;
}

.discover-hero__actions button:last-child,
.stage-heading button,
.generated-actions button:last-child {
  border-color: var(--line-soft);
  color: var(--text);
  background: #ffffff;
}

.discover-tabs {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(6px, 1vw, 12px);
}

.discover-tabs button {
  min-width: 0;
  min-height: clamp(36px, 4.8vw, 48px);
  border: 0;
  border-radius: 999px;
  padding: 0 clamp(6px, 1.5vw, 18px);
  color: var(--text);
  background: rgba(255, 255, 255, 0.72);
  font-size: clamp(11px, 1.75vw, 15px);
  font-weight: 850;
  white-space: nowrap;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
}

.discover-tabs button.is-active,
.discover-tabs button:hover {
  color: var(--theme-dark);
  background: #fff0f6;
  box-shadow: none;
}

.form-note {
  margin: 0;
  border: 1px solid rgba(234, 76, 137, 0.18);
  border-radius: 12px;
  padding: 12px 14px;
  color: var(--theme-dark);
  background: rgba(255, 240, 246, 0.74);
}

.discover-overview {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(280px, 0.88fr);
  gap: clamp(14px, 2vw, 22px);
}

.overview-lead {
  display: grid;
  align-content: space-between;
  gap: 22px;
  min-height: clamp(250px, 30vw, 380px);
  padding: clamp(20px, 3.5vw, 36px);
  background:
    radial-gradient(circle at 88% 12%, color-mix(in srgb, var(--feature-color) 18%, white), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 247, 251, 0.84));
}

.overview-side {
  display: grid;
  gap: clamp(14px, 2vw, 22px);
}

.overview-mini-card,
.overview-card {
  display: grid;
  align-content: space-between;
  gap: 16px;
  min-height: 178px;
  padding: clamp(18px, 3vw, 28px);
  color: var(--text);
  text-align: left;
}

.overview-mini-card--challenge,
.overview-card {
  background:
    radial-gradient(circle at 86% 18%, color-mix(in srgb, var(--feature-color, var(--pink)) 20%, white), transparent 34%),
    rgba(255, 255, 255, 0.78);
}

.overview-mini-card--battle {
  background:
    radial-gradient(circle at 86% 18%, rgba(139, 92, 246, 0.16), transparent 34%),
    rgba(255, 255, 255, 0.78);
}

.overview-mini-card strong,
.overview-card strong {
  color: var(--text);
  font-size: clamp(22px, 3vw, 34px);
  line-height: 1.1;
}

.overview-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.overview-stat {
  display: grid;
  gap: 8px;
  padding: clamp(14px, 2vw, 20px);
}

.overview-stat span,
.overview-stat small,
.overview-card small,
.rail-card small,
.compact-song span,
.battle-song span,
.preview-song span,
.battle-song small {
  color: var(--muted);
}

.overview-stat strong {
  overflow-wrap: anywhere;
  color: var(--text);
  font-size: clamp(24px, 4vw, 42px);
  line-height: 1;
}

.overview-challenges {
  display: grid;
  grid-column: 1 / -1;
  gap: 14px;
}

.overview-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.section-title {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.section-title h2,
.stage-heading h2,
.dashed-box h3,
.fortune-draft-card h2 {
  margin: 0;
  color: #0d0c22;
  font-size: clamp(24px, 3.6vw, 42px);
  line-height: 1.08;
}

.playground-shell {
  display: grid;
  grid-template-columns: minmax(132px, 0.16fr) minmax(0, 1fr) minmax(132px, 0.16fr);
  gap: clamp(12px, 2vw, 20px);
  align-items: stretch;
}

.challenge-playground {
  grid-template-columns: minmax(132px, 0.17fr) minmax(0, 1fr);
}

.playground-rail {
  display: grid;
  align-content: start;
  gap: 14px;
  max-height: min(760px, calc(100vh - 220px));
  overflow: auto;
  padding: 14px;
  scrollbar-width: thin;
}

.rail-card {
  display: grid;
  justify-items: center;
  gap: 8px;
  border: 0;
  border-radius: 16px;
  padding: 8px;
  color: var(--text);
  text-align: center;
  background: transparent;
  box-shadow: none;
}

.rail-card:hover,
.rail-card.is-active {
  color: var(--theme-dark);
  background: rgba(255, 240, 246, 0.82);
  box-shadow: none;
}

.rail-cover {
  display: grid;
  place-items: center;
  width: clamp(72px, 7vw, 100px);
  aspect-ratio: 1;
  border-radius: 28%;
  color: #ffffff;
  font-size: clamp(22px, 4vw, 36px);
  font-weight: 900;
  background:
    radial-gradient(circle at 24% 22%, color-mix(in srgb, var(--cover-color, var(--pink)) 68%, white), transparent 38%),
    linear-gradient(135deg, var(--cover-color, var(--pink)), #312e81);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.genre-cover {
  background:
    linear-gradient(45deg, color-mix(in srgb, var(--cover-color) 76%, white) 0 25%, transparent 25% 50%, color-mix(in srgb, var(--cover-color) 58%, #ffffff) 50% 75%, transparent 75%),
    linear-gradient(135deg, var(--cover-color), #ffffff);
  background-size: 22px 22px, auto;
}

.rail-card strong {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: clamp(12px, 1.5vw, 14px);
  line-height: 1.2;
}

.rail-card small {
  display: -webkit-box;
  overflow: hidden;
  max-width: 120px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 11px;
  line-height: 1.35;
}

.playground-stage {
  display: grid;
  gap: clamp(14px, 2vw, 22px);
  padding: clamp(16px, 3vw, 30px);
}

.stage-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.stage-hero {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  padding: clamp(18px, 3vw, 32px);
  background:
    radial-gradient(circle at 88% 22%, color-mix(in srgb, var(--feature-color) 18%, white), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 250, 245, 0.9));
}

.dual-box,
.battle-new-layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(260px, 0.46fr) auto minmax(0, 0.54fr);
  gap: clamp(12px, 2.2vw, 26px);
  align-items: stretch;
}

.dashed-box {
  display: grid;
  align-content: start;
  gap: 14px;
  padding: clamp(16px, 2.6vw, 26px);
  background: rgba(255, 255, 255, 0.66);
}

.dashed-box--pink {
  border: 2px dashed rgba(234, 76, 137, 0.42);
}

.dashed-box--orange {
  border: 2px dashed rgba(251, 146, 60, 0.52);
}

.dashed-box--blue {
  border: 2px dashed rgba(56, 189, 248, 0.48);
}

.dashed-box--green {
  border: 2px dashed rgba(52, 211, 153, 0.46);
}

.dashed-box--yellow {
  border: 2px dashed rgba(250, 204, 21, 0.58);
}

.dashed-box label {
  display: grid;
  gap: 8px;
  color: var(--text);
  font-weight: 780;
}

.dashed-box input,
.dashed-box select,
.battle-lyric-box input {
  min-height: 46px;
  border: 1px solid var(--line-soft);
  border-radius: 12px;
  color: var(--text);
  background: rgba(255, 255, 255, 0.86);
}

.axis-node {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 44px;
}

.axis-node::before {
  content: '';
  position: absolute;
  top: 8%;
  bottom: 8%;
  left: 50%;
  width: 2px;
  border-radius: 999px;
  background: linear-gradient(var(--pink), var(--orange));
}

.axis-node span,
.versus,
.battle-divider strong {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: clamp(42px, 6vw, 64px);
  height: clamp(42px, 6vw, 64px);
  border: 6px solid #ffffff;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--pink), #8b5cf6);
  font-size: clamp(12px, 1.6vw, 16px);
  font-weight: 950;
  box-shadow: 0 14px 28px rgba(234, 76, 137, 0.2);
}

.work-list {
  display: grid;
  gap: 10px;
}

.compact-song {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  border: 1px solid var(--line-soft);
  border-radius: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.78);
}

.compact-song p {
  margin: 4px 0 0;
  color: var(--muted);
  line-height: 1.45;
}

.mini-cover {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 54px;
  border: 0;
  border-radius: 28%;
  padding: 0;
  color: #ffffff;
  background:
    radial-gradient(circle at 22% 20%, color-mix(in srgb, var(--cover-color) 72%, white), transparent 36%),
    linear-gradient(135deg, var(--cover-color), #312e81);
}

.mini-cover span {
  position: absolute;
  top: -8px;
  left: -8px;
  display: grid;
  place-items: center;
  min-width: 26px;
  min-height: 26px;
  border: 2px solid #ffffff;
  border-radius: 999px;
  color: #ffffff;
  background: var(--pink);
  font-size: 11px;
  font-weight: 900;
}

.battle-duel-frame {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(12px, 3vw, 30px);
  border-radius: 16px;
  padding: clamp(14px, 3vw, 28px);
  background:
    linear-gradient(#fff 1px, transparent 1px),
    linear-gradient(90deg, #fff 1px, transparent 1px),
    rgba(255, 255, 255, 0.48);
  background-size: 22px 22px;
}

.battle-song,
.preview-song {
  display: grid;
  justify-items: center;
  gap: 10px;
  min-width: 0;
  text-align: center;
}

.battle-song {
  border-radius: 16px;
  padding: clamp(10px, 2vw, 18px);
  background: rgba(255, 255, 255, 0.66);
}

.battle-song--a,
.preview-song--a {
  border: 2px dotted rgba(234, 76, 137, 0.55);
}

.battle-song--b,
.preview-song--b {
  border: 2px dotted rgba(56, 189, 248, 0.62);
}

.battle-cover {
  width: 100%;
  max-width: min(210px, 100%);
  min-height: 0;
  aspect-ratio: 1;
  border-radius: 28%;
}

.battle-song button:not(.song-cover) {
  width: min(140px, 100%);
}

.battle-song.is-voted button:not(.song-cover) {
  background: linear-gradient(135deg, var(--pink), #8b5cf6);
}

.battle-divider {
  display: grid;
  justify-items: center;
  gap: 10px;
}

.battle-divider::before {
  content: '';
  display: block;
  width: 2px;
  height: clamp(48px, 8vw, 92px);
  border-radius: 999px;
  background: linear-gradient(var(--pink), var(--blue));
}

.battle-divider::after {
  content: '';
  display: block;
  width: 2px;
  height: clamp(48px, 8vw, 92px);
  border-radius: 999px;
  background: linear-gradient(var(--blue), var(--pink));
}

.battle-progress {
  position: relative;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  height: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--blue);
}

.battle-progress span {
  position: absolute;
  inset: 0 auto 0 0;
  display: block;
  border-radius: inherit;
  background: var(--pink);
}

.battle-progress strong,
.battle-progress em {
  position: relative;
  z-index: 1;
  padding: 0 8px;
  color: #ffffff;
  font-size: 10px;
  font-style: normal;
  line-height: 12px;
}

.battle-progress em {
  justify-self: end;
}

.battle-lyric-box {
  display: grid;
  gap: 8px;
}

.battle-lyric-box input {
  min-height: 58px;
  border-radius: 999px;
  padding: 0 22px;
  background: rgba(255, 246, 250, 0.82);
}

.battle-new-stage {
  width: min(1120px, 100%);
  margin: 0 auto;
}

.battle-preview-shell {
  justify-items: stretch;
}

.battle-preview {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  width: 100%;
}

.preview-song {
  padding: 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.66);
}

.battle-new-actions {
  display: grid;
  justify-items: center;
}

.battle-new-actions button {
  width: min(520px, 100%);
  min-height: 56px;
}

.fortune-dashboard {
  display: grid;
  gap: clamp(14px, 2vw, 22px);
}

.fortune-top-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 2vw, 22px);
}

.fortune-daily {
  align-content: space-between;
  min-height: clamp(280px, 34vw, 420px);
  background:
    radial-gradient(circle at 80% 18%, color-mix(in srgb, var(--feature-color) 20%, white), transparent 34%),
    rgba(255, 255, 255, 0.72);
}

.metric-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.metric-row strong {
  border-radius: 999px;
  padding: 7px 10px;
  color: var(--text);
  background: rgba(255, 255, 255, 0.74);
  font-size: clamp(12px, 1.4vw, 13px);
}

.calendar-panel {
  display: grid;
  gap: 16px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: clamp(6px, 1vw, 10px);
}

.calendar-grid button {
  position: relative;
  display: grid;
  place-items: center;
  gap: 3px;
  min-height: 0;
  aspect-ratio: 1;
  border: 1px solid transparent;
  border-radius: 28%;
  color: var(--text);
  background: rgba(255, 255, 255, 0.56);
  box-shadow: none;
}

.calendar-grid button::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--day-color);
}

.calendar-grid button.is-checked {
  background: color-mix(in srgb, var(--day-color) 10%, white);
}

.calendar-grid button.is-active {
  border-color: var(--day-color);
  color: #ffffff;
  background: var(--day-color);
}

.calendar-grid button.is-active span,
.calendar-grid button.is-active strong {
  color: #ffffff;
}

.calendar-grid span {
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: clamp(10px, 1.5vw, 12px);
}

.fortune-draft-card {
  display: grid;
  grid-template-columns: minmax(0, 0.62fr) minmax(260px, 0.38fr);
  gap: clamp(14px, 2vw, 20px);
  padding: clamp(18px, 3vw, 30px);
  background:
    radial-gradient(circle at 16% 12%, rgba(234, 76, 137, 0.1), transparent 30%),
    radial-gradient(circle at 84% 18%, rgba(52, 211, 153, 0.12), transparent 30%),
    rgba(255, 255, 255, 0.72);
}

.fortune-draft-card pre {
  margin: 14px 0 0;
  white-space: pre-wrap;
  color: var(--muted);
  font-size: clamp(14px, 1.5vw, 16px);
  line-height: 1.8;
}

.fortune-poster {
  display: grid;
  align-content: space-between;
  gap: 14px;
  border-radius: 16px;
  padding: clamp(16px, 2.5vw, 24px);
  color: var(--text);
  background: linear-gradient(135deg, rgba(255, 245, 250, 0.9), rgba(240, 253, 250, 0.86));
}

.fortune-poster p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}

.generated-song {
  display: grid;
  gap: 14px;
  padding: clamp(18px, 3vw, 30px);
  background:
    radial-gradient(circle at 84% 12%, color-mix(in srgb, var(--feature-color) 16%, white), transparent 32%),
    linear-gradient(135deg, rgba(255, 245, 250, 0.94), rgba(240, 249, 255, 0.9));
}

@media (max-width: 1080px) {
  .playground-shell,
  .challenge-playground {
    grid-template-columns: 1fr;
  }

  .playground-rail {
    display: flex;
    max-height: none;
    overflow-x: auto;
    padding: 12px;
    scrollbar-width: none;
  }

  .playground-rail::-webkit-scrollbar {
    display: none;
  }

  .rail-title {
    align-self: center;
    min-width: max-content;
  }

  .rail-card {
    flex: 0 0 112px;
  }

  .genre-rail {
    order: 3;
  }

  .battle-stage-card {
    order: 2;
  }
}

@media (max-width: 900px) {
  .discover-hero,
  .discover-overview,
  .fortune-top-grid,
  .fortune-draft-card {
    grid-template-columns: 1fr;
  }

  .overview-panel,
  .overview-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dual-box,
  .battle-new-layout {
    grid-template-columns: 1fr;
  }

  .axis-node {
    min-height: 38px;
  }

  .axis-node::before {
    top: 50%;
    bottom: auto;
    right: 8%;
    left: 8%;
    width: auto;
    height: 2px;
  }
}

@media (max-width: 640px) {
  .discover-suite {
    margin: -6px -4px;
    padding: 10px;
  }

  .discover-hero {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .discover-hero h1 {
    font-size: clamp(27px, 8vw, 34px);
  }

  .discover-hero__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .discover-hero__actions button {
    min-height: 40px;
    padding: 0 10px;
  }

  .discover-tabs {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 6px;
  }

  .discover-tabs button {
    min-height: 34px;
    padding: 0 3px;
    font-size: clamp(10px, 2.8vw, 12px);
  }

  .overview-panel,
  .overview-card-grid {
    grid-template-columns: 1fr;
  }

  .overview-lead,
  .overview-mini-card,
  .overview-card {
    min-height: 150px;
  }

  .playground-stage,
  .playground-rail,
  .dashed-box,
  .fortune-draft-card,
  .generated-song {
    border-radius: 14px;
  }

  .playground-stage {
    padding: 12px;
  }

  .rail-card {
    flex-basis: 92px;
    padding: 6px;
  }

  .rail-cover {
    width: 64px;
  }

  .rail-card small {
    display: none;
  }

  .stage-heading {
    display: grid;
    justify-items: start;
  }

  .battle-duel-frame {
    grid-template-columns: minmax(0, 1fr) 34px minmax(0, 1fr);
    gap: 6px;
    padding: 10px;
    border-radius: 14px;
  }

  .battle-song {
    gap: 6px;
    padding: 8px;
    border-radius: 13px;
  }

  .battle-cover {
    max-width: none;
  }

  .battle-song div strong,
  .preview-song strong {
    display: block;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
  }

  .battle-song div span,
  .battle-song small {
    display: none;
  }

  .battle-song button:not(.song-cover) {
    min-height: 30px;
    padding: 0 8px;
    font-size: 11px;
  }

  .battle-divider::before,
  .battle-divider::after {
    height: 34px;
  }

  .battle-divider strong {
    width: 34px;
    height: 34px;
    border-width: 4px;
    font-size: 10px;
  }

  .battle-lyric-box input {
    min-height: 46px;
    padding: 0 14px;
  }

  .battle-preview {
    grid-template-columns: 1fr;
  }

  .versus {
    justify-self: center;
  }

  .calendar-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .fortune-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fortune-actions button:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 380px) {
  .discover-tabs button {
    font-size: 10px;
  }

  .calendar-grid {
    gap: 5px;
  }
}
`
