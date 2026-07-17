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
  gap: clamp(14px, 2vw, 24px);
  margin: -8px;
  border-radius: 20px;
  padding: clamp(10px, 1.6vw, 18px);
  background:
    radial-gradient(circle at 8% 8%, rgba(234, 76, 137, 0.09), transparent 28%),
    radial-gradient(circle at 88% 12%, rgba(56, 189, 248, 0.09), transparent 26%),
    linear-gradient(135deg, var(--cream), var(--mist));
}

.discover-suite span {
  color: inherit;
}

.discover-hero,
.playground-stage,
.playground-rail,
.challenge-main-stage,
.overview-lead,
.overview-mini-card,
.overview-stat,
.overview-card,
.dashed-box,
.fortune-draft-card,
.generated-song,
.challenge-work-panel,
.share-card-panel {
  border: 1px solid rgba(255, 255, 255, 0.86);
  border-radius: 16px;
  background: var(--glass);
  box-shadow: 0 12px 34px rgba(31, 41, 55, 0.06);
  backdrop-filter: blur(18px);
}

.discover-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(12px, 2vw, 20px);
  padding: clamp(18px, 3vw, 30px);
  color: var(--ink-soft);
  background:
    radial-gradient(circle at 78% 22%, rgba(234, 76, 137, 0.14), transparent 26%),
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
.generated-song span,
.challenge-banner span,
.challenge-prompt-card span,
.share-card-preview span,
.discover-modal span,
.insight-card span {
  color: var(--pink);
  font-size: 12px;
  font-weight: 820;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.discover-hero h1,
.overview-lead h2,
.stage-hero h2,
.fortune-daily h2,
.challenge-banner h2 {
  margin: 6px 0;
  max-width: 820px;
  color: #0d0c22;
  font-size: clamp(26px, 4vw, 46px);
  line-height: 1.06;
}

.discover-hero p,
.overview-lead p,
.overview-mini-card p,
.stage-hero p,
.fortune-daily p,
.generated-song p,
.challenge-banner p,
.challenge-prompt-card p {
  margin: 0;
  max-width: 720px;
  color: var(--muted);
  font-size: clamp(13px, 1.25vw, 15px);
  line-height: 1.62;
}

.discover-hero__actions,
.fortune-actions,
.generated-actions,
.share-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.discover-hero__actions button,
.overview-lead button,
.overview-mini-card button,
.fortune-actions button,
.generated-actions button,
.battle-new-actions button,
.stage-heading button,
.dashed-box button,
.battle-song button:not(.song-cover),
.fortune-poster button,
.share-card-actions button,
.discover-modal button,
.topic-input-row button {
  min-height: 40px;
  border-radius: 999px;
  padding: 0 clamp(12px, 2vw, 20px);
  font-size: 14px;
  font-weight: 800;
}

.discover-hero__actions button:last-child,
.stage-heading button,
.generated-actions button:last-child,
.share-card-actions button:last-child {
  border-color: var(--line-soft);
  color: var(--text);
  background: #ffffff;
}

.discover-tabs {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(6px, 1vw, 10px);
}

.discover-tabs button {
  min-width: 0;
  min-height: 40px;
  border: 0;
  border-radius: 999px;
  padding: 0 clamp(6px, 1.2vw, 14px);
  color: var(--text);
  background: rgba(255, 255, 255, 0.72);
  font-size: clamp(11px, 1.55vw, 14px);
  font-weight: 800;
  white-space: nowrap;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
}

.discover-tabs button.is-active,
.discover-tabs button:hover {
  color: var(--theme-dark);
  background: #fff0f6;
  box-shadow: none;
}

.discover-overview {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(280px, 0.88fr);
  gap: clamp(12px, 2vw, 18px);
}

.overview-lead {
  display: grid;
  align-content: space-between;
  gap: 18px;
  min-height: clamp(220px, 26vw, 330px);
  padding: clamp(18px, 3vw, 30px);
  background:
    radial-gradient(circle at 88% 12%, color-mix(in srgb, var(--feature-color) 16%, white), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 247, 251, 0.84));
}

.overview-side {
  display: grid;
  gap: clamp(12px, 2vw, 18px);
}

.overview-mini-card,
.overview-card {
  display: grid;
  align-content: space-between;
  gap: 14px;
  min-height: 154px;
  padding: clamp(16px, 2.4vw, 24px);
  color: var(--text);
  text-align: left;
}

.overview-mini-card--challenge,
.overview-card {
  background:
    radial-gradient(circle at 86% 18%, color-mix(in srgb, var(--feature-color, var(--pink)) 17%, white), transparent 34%),
    rgba(255, 255, 255, 0.78);
}

.overview-mini-card--battle {
  background:
    radial-gradient(circle at 86% 18%, rgba(139, 92, 246, 0.14), transparent 34%),
    rgba(255, 255, 255, 0.78);
}

.overview-mini-card strong,
.overview-card strong {
  color: var(--text);
  font-size: clamp(20px, 2.5vw, 30px);
  line-height: 1.12;
}

.overview-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.overview-stat {
  display: grid;
  gap: 7px;
  padding: clamp(13px, 1.8vw, 18px);
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
  font-size: clamp(22px, 3.2vw, 36px);
  line-height: 1;
}

.overview-challenges {
  display: grid;
  grid-column: 1 / -1;
  gap: 12px;
}

.overview-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
}

.section-title h2,
.stage-heading h2,
.dashed-box h3,
.fortune-draft-card h2,
.discover-modal h2 {
  margin: 0;
  color: #0d0c22;
  font-size: clamp(22px, 3vw, 34px);
  line-height: 1.08;
}

.playground-shell {
  display: grid;
  grid-template-columns: minmax(126px, 0.16fr) minmax(0, 1fr) minmax(150px, 0.18fr);
  gap: clamp(12px, 1.8vw, 18px);
  align-items: stretch;
}

.playground-rail {
  display: grid;
  align-content: start;
  gap: 12px;
  max-height: min(650px, calc(100vh - 190px));
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  scrollbar-color: rgba(234, 76, 137, 0.32) transparent;
  scrollbar-width: thin;
  scroll-behavior: smooth;
}

.rail-scroll {
  mask-image: linear-gradient(to bottom, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%);
}

.rail-card {
  display: grid;
  justify-items: center;
  gap: 7px;
  border: 0;
  border-radius: 14px;
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
  width: clamp(66px, 6vw, 88px);
  aspect-ratio: 1;
  border-radius: 28%;
  color: #ffffff;
  font-size: clamp(20px, 3vw, 30px);
  font-weight: 900;
  background:
    radial-gradient(circle at 24% 22%, color-mix(in srgb, var(--cover-color, var(--pink)) 68%, white), transparent 38%),
    linear-gradient(135deg, var(--cover-color, var(--pink)), #312e81);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.1);
}

.rail-card strong {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 13px;
  line-height: 1.2;
}

.rail-card small {
  display: -webkit-box;
  overflow: hidden;
  max-width: 118px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 11px;
  line-height: 1.35;
}

.playground-stage {
  display: grid;
  gap: clamp(12px, 1.8vw, 18px);
  padding: clamp(14px, 2.3vw, 24px);
}

.stage-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.battle-duel-frame {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(10px, 2.4vw, 24px);
  border-radius: 16px;
  padding: clamp(12px, 2.4vw, 24px);
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
  gap: 9px;
  min-width: 0;
  text-align: center;
}

.battle-song {
  border-radius: 16px;
  padding: clamp(9px, 1.8vw, 16px);
  background: rgba(255, 255, 255, 0.66);
}

.battle-song--a,
.preview-song--a {
  border: 2px dotted rgba(234, 76, 137, 0.5);
}

.battle-song--b,
.preview-song--b {
  border: 2px dotted rgba(56, 189, 248, 0.58);
}

.battle-cover {
  width: 100%;
  max-width: min(178px, 100%);
  min-height: 0;
  aspect-ratio: 1;
  border-radius: 28%;
}

.battle-song button:not(.song-cover) {
  width: min(132px, 100%);
}

.battle-song.is-voted button:not(.song-cover) {
  background: linear-gradient(135deg, var(--pink), #8b5cf6);
}

.battle-divider {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.battle-divider::before,
.battle-divider::after {
  content: '';
  display: block;
  width: 2px;
  height: clamp(42px, 6vw, 76px);
  border-radius: 999px;
  background: linear-gradient(var(--pink), var(--blue));
}

.battle-divider strong,
.versus,
.axis-node span {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: clamp(38px, 5vw, 56px);
  height: clamp(38px, 5vw, 56px);
  border: 5px solid #ffffff;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--pink), #8b5cf6);
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 12px 24px rgba(234, 76, 137, 0.18);
}

.battle-progress {
  position: relative;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  height: 11px;
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
  line-height: 11px;
}

.battle-progress em {
  justify-self: end;
}

.battle-lyric-box {
  display: grid;
  gap: 8px;
}

.battle-lyric-box input {
  min-height: 48px;
  border-radius: 999px;
  padding: 0 18px;
  background: rgba(255, 246, 250, 0.82);
}

.insight-rail {
  gap: 10px;
}

.insight-card {
  display: grid;
  gap: 8px;
  min-height: 104px;
  border: 1px solid rgba(234, 76, 137, 0.12);
  border-radius: 14px;
  padding: 14px;
  color: var(--text);
  text-align: left;
  background: linear-gradient(135deg, rgba(255, 245, 250, 0.86), rgba(240, 249, 255, 0.72));
  box-shadow: none;
}

.insight-card strong {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 15px;
  line-height: 1.25;
}

.insight-card--create {
  border-color: rgba(56, 189, 248, 0.2);
  background: linear-gradient(135deg, rgba(240, 249, 255, 0.9), rgba(240, 253, 250, 0.8));
}

.challenge-lab {
  display: grid;
  grid-template-columns: minmax(128px, 0.17fr) minmax(0, 1fr);
  gap: clamp(12px, 1.8vw, 18px);
}

.challenge-main-stage {
  display: grid;
  gap: clamp(12px, 1.8vw, 18px);
  padding: clamp(14px, 2.2vw, 24px);
}

.challenge-banner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  border-radius: 16px;
  padding: clamp(18px, 2.8vw, 28px);
  background:
    radial-gradient(circle at 86% 22%, color-mix(in srgb, var(--feature-color) 20%, white), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 250, 245, 0.86));
}

.challenge-badge {
  display: grid;
  place-items: center;
  width: clamp(76px, 9vw, 118px);
  aspect-ratio: 1;
  border-radius: 28%;
  color: #ffffff;
  background: linear-gradient(135deg, var(--feature-color), #8b5cf6);
  font-size: clamp(28px, 5vw, 46px);
  font-weight: 900;
}

.challenge-flow {
  display: grid;
  grid-template-columns: minmax(220px, 0.36fr) minmax(0, 0.64fr);
  gap: 14px;
}

.challenge-prompt-card {
  display: grid;
  align-content: space-between;
  gap: 14px;
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: 16px;
  padding: clamp(16px, 2.2vw, 22px);
  background: linear-gradient(135deg, rgba(240, 249, 255, 0.9), rgba(255, 255, 255, 0.72));
}

.challenge-prompt-card strong {
  font-size: clamp(18px, 2.3vw, 26px);
  line-height: 1.18;
}

.dashed-box {
  display: grid;
  align-content: start;
  gap: 12px;
  padding: clamp(14px, 2.2vw, 22px);
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
  font-weight: 760;
}

.dashed-box input,
.dashed-box select,
.battle-lyric-box input {
  min-height: 42px;
  border: 1px solid var(--line-soft);
  border-radius: 12px;
  color: var(--text);
  background: rgba(255, 255, 255, 0.86);
}

.topic-input-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.topic-input-row button {
  min-width: 72px;
  padding: 0 14px;
}

.axis-node {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 40px;
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

.work-list {
  display: grid;
  gap: 10px;
}

.work-list--masonry {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.challenge-work-panel {
  display: grid;
  gap: 12px;
  padding: clamp(14px, 2.2vw, 22px);
}

.challenge-work-panel .section-title > strong {
  border-radius: 999px;
  padding: 7px 10px;
  color: var(--theme-dark);
  background: #fff0f6;
  font-size: 13px;
}

.compact-song {
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr);
  gap: 10px;
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
  min-height: 50px;
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
  min-width: 24px;
  min-height: 24px;
  border: 2px solid #ffffff;
  border-radius: 999px;
  color: #ffffff;
  background: var(--pink);
  font-size: 10px;
  font-weight: 900;
}

.battle-new-stage {
  width: min(1040px, 100%);
  margin: 0 auto;
}

.battle-new-layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(260px, 0.46fr) auto minmax(0, 0.54fr);
  gap: clamp(12px, 2vw, 22px);
  align-items: stretch;
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
  width: min(480px, 100%);
  min-height: 50px;
}

.fortune-dashboard {
  display: grid;
  gap: clamp(12px, 1.8vw, 18px);
}

.fortune-top-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(12px, 1.8vw, 18px);
}

.fortune-daily {
  align-content: space-between;
  min-height: clamp(240px, 29vw, 340px);
  background:
    radial-gradient(circle at 80% 18%, color-mix(in srgb, var(--feature-color) 18%, white), transparent 34%),
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
  font-size: 12px;
}

.calendar-panel {
  display: grid;
  gap: 14px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: clamp(5px, 0.8vw, 8px);
}

.calendar-grid button {
  position: relative;
  display: grid;
  place-items: center;
  gap: 2px;
  min-height: 0;
  aspect-ratio: 1;
  border: 1px solid transparent;
  border-radius: 24%;
  color: var(--text);
  background: rgba(255, 255, 255, 0.56);
  box-shadow: none;
}

.calendar-grid button::after {
  content: '';
  width: 5px;
  height: 5px;
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
  font-size: 11px;
}

.fortune-draft-card {
  display: grid;
  grid-template-columns: minmax(0, 0.62fr) minmax(250px, 0.38fr);
  gap: clamp(12px, 1.8vw, 18px);
  padding: clamp(16px, 2.5vw, 26px);
  background:
    radial-gradient(circle at 16% 12%, rgba(234, 76, 137, 0.09), transparent 30%),
    radial-gradient(circle at 84% 18%, rgba(52, 211, 153, 0.1), transparent 30%),
    rgba(255, 255, 255, 0.72);
}

.fortune-draft-card pre {
  margin: 12px 0 0;
  white-space: pre-wrap;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.75;
}

.fortune-poster {
  display: grid;
  align-content: space-between;
  gap: 12px;
  border-radius: 16px;
  padding: clamp(14px, 2.2vw, 20px);
  color: var(--text);
  background: linear-gradient(135deg, rgba(255, 245, 250, 0.9), rgba(240, 253, 250, 0.86));
}

.fortune-poster p {
  margin: 0;
  color: var(--muted);
  line-height: 1.62;
}

.compact-song__title,
.battle-song__title,
.battle-preview__title {
  min-height: 0;
  border: 0;
  padding: 0;
  color: inherit;
  text-align: left;
  background: transparent;
  box-shadow: none;
  font: inherit;
  font-weight: 800;
}

.compact-song__title:hover,
.battle-song__title:hover,
.battle-preview__title:hover {
  color: var(--pink);
  transform: none;
  box-shadow: none;
}

.fortune-daily__art {
  width: 100%;
  max-height: 190px;
  border-radius: 18px;
  object-fit: cover;
}

.share-card-preview__art {
  width: 100%;
  max-height: 180px;
  border-radius: 16px;
  object-fit: cover;
}

.share-card-preview__qr {
  width: 86px;
  height: 86px;
  margin-top: 12px;
  border-radius: 10px;
  object-fit: contain;
  background: white;
}

.share-card-panel {
  display: grid;
  grid-template-columns: minmax(0, 360px) minmax(180px, 1fr);
  gap: 14px;
  align-items: center;
  padding: clamp(14px, 2vw, 20px);
}

.share-card-preview {
  display: grid;
  align-content: end;
  gap: 12px;
  min-height: 360px;
  border-radius: 18px;
  padding: 24px;
  color: var(--text);
  background:
    radial-gradient(circle at 22% 18%, color-mix(in srgb, var(--feature-color) 26%, white), transparent 34%),
    linear-gradient(145deg, #ffffff, #fff5fa);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.9);
}

.share-card-preview h2 {
  margin: 0;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1;
}

.share-card-preview p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.share-card-preview div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.share-card-preview strong {
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

.generated-song {
  display: grid;
  gap: 12px;
  padding: clamp(16px, 2.5vw, 26px);
  background:
    radial-gradient(circle at 84% 12%, color-mix(in srgb, var(--feature-color) 14%, white), transparent 32%),
    linear-gradient(135deg, rgba(255, 245, 250, 0.94), rgba(240, 249, 255, 0.9));
}

.discover-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(13, 12, 34, 0.22);
  backdrop-filter: blur(10px);
}

.discover-modal {
  display: grid;
  gap: 12px;
  width: min(420px, 100%);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 18px;
  padding: 22px;
  background:
    radial-gradient(circle at 88% 12%, rgba(234, 76, 137, 0.12), transparent 28%),
    rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
}

.discover-modal p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}

@media (max-width: 1080px) {
  .playground-shell,
  .challenge-lab {
    grid-template-columns: 1fr;
  }

  .playground-rail {
    display: flex;
    max-height: none;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 10px;
    scrollbar-width: none;
    mask-image: linear-gradient(to right, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%);
  }

  .playground-rail::-webkit-scrollbar {
    display: none;
  }

  .rail-title {
    align-self: center;
    min-width: max-content;
  }

  .rail-card {
    flex: 0 0 106px;
  }

  .insight-rail {
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
  .fortune-draft-card,
  .challenge-flow,
  .share-card-panel {
    grid-template-columns: 1fr;
  }

  .overview-panel,
  .overview-card-grid,
  .work-list--masonry {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

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
    padding: 16px;
  }

  .discover-hero h1 {
    font-size: clamp(25px, 7vw, 32px);
  }

  .discover-hero__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .discover-hero__actions button {
    min-height: 38px;
    padding: 0 10px;
  }

  .discover-tabs {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 5px;
  }

  .discover-tabs button {
    min-height: 32px;
    padding: 0 3px;
    font-size: clamp(10px, 2.8vw, 12px);
  }

  .overview-panel,
  .overview-card-grid,
  .work-list--masonry {
    grid-template-columns: 1fr;
  }

  .overview-lead,
  .overview-mini-card,
  .overview-card {
    min-height: 136px;
  }

  .playground-stage,
  .playground-rail,
  .dashed-box,
  .fortune-draft-card,
  .generated-song,
  .challenge-main-stage,
  .challenge-work-panel {
    border-radius: 14px;
  }

  .playground-stage,
  .challenge-main-stage {
    padding: 12px;
  }

  .rail-card {
    flex-basis: 88px;
    padding: 6px;
  }

  .rail-cover {
    width: 60px;
  }

  .rail-card small {
    display: none;
  }

  .stage-heading,
  .challenge-banner {
    display: grid;
    justify-items: start;
  }

  .challenge-badge {
    width: 68px;
  }

  .battle-duel-frame {
    grid-template-columns: minmax(0, 1fr) 32px minmax(0, 1fr);
    gap: 6px;
    padding: 9px;
    border-radius: 14px;
  }

  .battle-song {
    gap: 6px;
    padding: 7px;
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
    font-size: 12px;
  }

  .battle-song div span,
  .battle-song small {
    display: none;
  }

  .battle-song button:not(.song-cover) {
    min-height: 30px;
    padding: 0 7px;
    font-size: 11px;
  }

  .battle-divider::before,
  .battle-divider::after {
    height: 30px;
  }

  .battle-divider strong {
    width: 32px;
    height: 32px;
    border-width: 4px;
    font-size: 10px;
  }

  .battle-lyric-box input {
    min-height: 44px;
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

  .topic-input-row {
    grid-template-columns: 1fr;
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
