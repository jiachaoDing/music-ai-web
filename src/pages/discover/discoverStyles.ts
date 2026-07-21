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
.challenge-work-panel {
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(6px, 1vw, 10px);
}

.discover-mobile-launcher,
.discover-mobile-home {
  display: none;
}

.battle-workspace {
  display: grid;
  gap: clamp(14px, 2vw, 20px);
}

.battle-mode-switch {
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 4px;
  padding: 4px;
  border: 1px solid rgba(234, 76, 137, 0.16);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 10px 30px rgba(52, 38, 78, 0.06);
}

.battle-mode-switch button {
  min-height: 38px;
  padding: 0 18px;
  border: 0;
  border-radius: 10px;
  color: var(--theme-muted);
  background: transparent;
  font-weight: 800;
}

.battle-mode-switch button.is-active,
.battle-mode-switch button:hover {
  color: var(--theme-dark);
  background: #fff0f6;
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
  grid-template-columns: 1fr;
  gap: clamp(12px, 2vw, 18px);
}

.overview-lead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: clamp(180px, 20vw, 240px);
  padding: clamp(18px, 3vw, 30px);
  background:
    radial-gradient(circle at 88% 12%, color-mix(in srgb, var(--feature-color) 16%, white), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 247, 251, 0.84));
}

.overview-side {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  grid-template-columns: clamp(190px, 16vw, 230px) minmax(0, 1fr) clamp(170px, 14vw, 210px);
  gap: clamp(12px, 1.8vw, 18px);
  align-items: stretch;
}

.playground-rail {
  display: grid;
  align-content: start;
  gap: 18px;
  width: 100%;
  min-width: 0;
  height: min(650px, calc(100vh - 190px));
  max-height: min(650px, calc(100vh - 190px));
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  scrollbar-color: rgba(234, 76, 137, 0.32) transparent;
  scrollbar-width: thin;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
}

.playground-rail::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

.playground-rail::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(234, 76, 137, 0.3);
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
  min-width: 0;
}

.battle-rail-left .rail-card {
  grid-template-columns: 46px minmax(0, 1fr);
  align-items: center;
  justify-items: stretch;
  gap: 11px;
  width: 100%;
  min-height: 82px;
  border: 1px solid rgba(234, 76, 137, 0.14);
  padding: 12px;
  text-align: left;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(255, 247, 251, 0.9));
}

.battle-rail-left .rail-card:hover,
.battle-rail-left .rail-card.is-active {
  border-color: rgba(234, 76, 137, 0.34);
  background: linear-gradient(135deg, #fff0f6, #fff9f2);
}

.rail-battle-mark {
  display: grid;
  place-items: center;
  width: 46px;
  aspect-ratio: 1;
  border-radius: 14px;
  color: #d83f78;
  background:
    radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.92), transparent 30%),
    linear-gradient(135deg, #ffd6e7, #ffe6bf);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .04em;
}

.rail-card-copy {
  display: grid;
  min-width: 0;
  gap: 7px;
}

.battle-rail-left .rail-card small {
  display: block;
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
  display: block;
  overflow: visible;
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  font-size: 13px;
  line-height: 1.35;
}

.rail-card small {
  display: block;
  overflow: visible;
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  font-size: 11px;
  line-height: 1.45;
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

.stage-heading__actions,
.battle-delete-confirm__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
}

.stage-heading .battle-delete-button,
.battle-delete-confirm .battle-delete-button {
  border-color: rgba(220, 38, 38, 0.22);
  color: #c0262d;
  background: #fff5f5;
}

.stage-heading .battle-delete-button:hover,
.battle-delete-confirm .battle-delete-button:hover {
  border-color: #dc2626;
  color: #ffffff;
  background: #dc2626;
}

.battle-missing-state {
  min-height: 280px;
}

.battle-delete-confirm__actions {
  width: 100%;
}

.battle-delete-confirm__actions button {
  flex: 1 1 140px;
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
  border-radius: 22px;
}

.battle-cover .song-cover__image {
  object-fit: cover;
}

.battle-song__title {
  width: auto !important;
  min-height: 0 !important;
  border: 0;
  border-radius: 0 !important;
  padding: 0 !important;
  color: var(--text);
  background: transparent !important;
  font-size: clamp(17px, 1.8vw, 21px) !important;
  font-weight: 900 !important;
  line-height: 1.2;
}

.battle-song__title:hover,
.battle-song__title:focus-visible {
  color: var(--pink);
  background: transparent !important;
  box-shadow: none;
  transform: none;
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

.insight-card:hover,
.insight-card:focus-visible {
  border-color: rgba(139, 92, 246, 0.24);
  color: var(--text);
  background: linear-gradient(135deg, rgba(250, 247, 255, 0.96), rgba(239, 246, 255, 0.92));
  box-shadow: 0 8px 24px rgba(52, 38, 78, 0.08);
  transform: translateY(-1px);
}

.insight-card--create:hover,
.insight-card--create:focus-visible {
  border-color: rgba(56, 189, 248, 0.3);
  background: linear-gradient(135deg, rgba(240, 249, 255, 0.96), rgba(236, 253, 245, 0.94));
}

.challenge-lab {
  display: grid;
  grid-template-columns: clamp(200px, 17vw, 250px) minmax(0, 1fr);
  gap: clamp(12px, 1.8vw, 18px);
  align-items: start;
}

.battle-rail-left,
.challenge-rail {
  position: sticky;
  top: 88px;
}

@media (min-width: 1181px) {
  .challenge-rail {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
    height: min(680px, calc(100vh - 190px));
    max-height: min(680px, calc(100vh - 190px));
    padding: 14px 12px 22px;
    overflow-x: hidden;
    overflow-y: scroll;
    scrollbar-gutter: stable;
    scrollbar-color: rgba(234, 76, 137, 0.56) rgba(234, 76, 137, 0.08);
    scrollbar-width: auto;
    mask-image: none;
  }

  .challenge-rail::-webkit-scrollbar {
    display: block;
    width: 9px;
  }

  .challenge-rail::-webkit-scrollbar-track {
    border-radius: 999px;
    background: rgba(234, 76, 137, 0.08);
  }

  .challenge-rail::-webkit-scrollbar-thumb {
    min-height: 48px;
    border: 2px solid rgba(255, 255, 255, 0.9);
    border-radius: 999px;
    background: rgba(234, 76, 137, 0.55);
  }

  .challenge-rail .rail-title {
    position: sticky;
    z-index: 2;
    top: -14px;
    margin: -2px -2px 0;
    padding: 10px 4px 8px;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(12px);
  }

  .challenge-rail .rail-card {
    width: 100%;
    min-height: 210px;
    align-content: start;
    gap: 10px;
    border: 1px solid rgba(234, 76, 137, 0.12);
    border-radius: 16px;
    padding: 14px 12px 16px;
    background: rgba(255, 255, 255, 0.72);
  }

  .challenge-rail .rail-card:hover,
  .challenge-rail .rail-card.is-active {
    border-color: rgba(234, 76, 137, 0.34);
    background: linear-gradient(135deg, rgba(255, 240, 246, 0.96), rgba(255, 249, 242, 0.92));
  }

  .challenge-rail .rail-cover {
    width: 82px;
  }

  .challenge-rail .rail-card strong {
    font-size: 13px;
    line-height: 1.4;
  }

  .challenge-rail .rail-card small {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    font-size: 11px;
    line-height: 1.55;
  }
}

.challenge-empty-work{grid-column:1/-1;border:1px dashed var(--line-soft);border-radius:12px;padding:24px;color:var(--muted);text-align:center;background:rgba(255,255,255,.56)}

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

.challenge-participants {
  display: grid;
  gap: 9px;
  border-top: 1px solid rgba(15, 23, 42, 0.07);
  padding-top: 14px;
}

.challenge-participants > span {
  color: var(--theme-dark);
  font-size: 12px;
  font-weight: 850;
  letter-spacing: .04em;
}

.challenge-participants > div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.challenge-participant {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid rgba(234, 76, 137, 0.14);
  border-radius: 999px;
  padding: 7px 11px;
  background: rgba(255, 245, 250, 0.78);
}

.challenge-participant strong {
  font-size: 12px;
}

.challenge-participant small {
  color: var(--muted);
  font-size: 10px;
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
  width: 100%;
  max-width: none;
  margin: 0;
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
  position: fixed;
  inset: 0;
  z-index: 95;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(8px);
}

.share-card-sheet {
  display: grid;
  gap: 14px;
  width: min(360px, calc(100vw - 36px));
  max-height: calc(100vh - 36px);
  border: 1px solid var(--line-soft);
  border-radius: 18px;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
}

.share-card-preview {
  display: grid;
  gap: 12px;
  border-radius: 18px;
  padding: 14px;
  color: var(--text);
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.9);
}

.share-card-canvas {
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 14px;
  background: #0a0813;
  box-shadow: 0 18px 46px rgba(15, 23, 42, 0.18);
}

.share-card-preview small {
  color: var(--muted);
  text-align: center;
  line-height: 1.5;
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

@media (max-width: 1180px) {
  .playground-shell,
  .challenge-lab {
    grid-template-columns: 1fr;
  }

  .playground-rail {
    display: flex;
    max-height: none;
    height: auto;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 10px;
    scrollbar-width: none;
    mask-image: linear-gradient(to right, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%);
  }

  .battle-rail-left,
  .challenge-rail {
    position: static;
  }

  .playground-rail::-webkit-scrollbar {
    display: none;
  }

  .rail-title {
    align-self: center;
    min-width: max-content;
  }

  .rail-card {
    flex: 0 0 min(180px, 42vw);
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
  .challenge-flow {
    grid-template-columns: 1fr;
  }

  .overview-side {
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
  .discover-suite--launcher > :not(style):not(.discover-mobile-launcher) {
    display: none !important;
  }

  .discover-suite:not(.discover-suite--launcher) .discover-hero,
  .discover-suite:not(.discover-suite--launcher) .discover-tabs {
    display: none;
  }

  .discover-suite--launcher .discover-mobile-launcher {
    display: grid;
    gap: 18px;
    min-height: calc(100dvh - 190px);
    border: 1px solid rgba(255, 255, 255, 0.78);
    border-radius: 24px;
    padding: 22px 16px;
    background:
      radial-gradient(circle at 88% 5%, rgba(84, 199, 236, 0.18), transparent 30%),
      radial-gradient(circle at 8% 14%, rgba(234, 76, 137, 0.18), transparent 34%),
      linear-gradient(155deg, rgba(255, 248, 252, 0.98), rgba(246, 248, 255, 0.96));
    box-shadow: 0 20px 55px rgba(76, 53, 94, 0.1);
  }

  .discover-mobile-launcher__heading {
    display: grid;
    gap: 7px;
  }

  .discover-mobile-launcher__heading span {
    color: var(--pink);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .discover-mobile-launcher__heading h1 {
    margin: 0;
    color: var(--theme-dark);
    font-size: clamp(28px, 8vw, 36px);
    line-height: 1.05;
  }

  .discover-mobile-launcher__heading p {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.55;
  }

  .discover-mobile-launcher__grid {
    display: grid;
    gap: 12px;
  }

  .discover-mobile-launcher__grid button {
    position: relative;
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr);
    grid-template-rows: auto auto auto;
    gap: 3px 14px;
    align-items: center;
    min-height: 116px;
    overflow: hidden;
    border: 1px solid rgba(234, 76, 137, 0.14);
    border-radius: 20px;
    padding: 16px;
    color: var(--text);
    text-align: left;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 12px 30px rgba(57, 40, 75, 0.07);
  }

  .discover-mobile-launcher__grid button:nth-child(2) {
    border-color: rgba(139, 92, 246, 0.18);
  }

  .discover-mobile-launcher__grid button:nth-child(3) {
    border-color: rgba(56, 189, 248, 0.2);
  }

  .discover-mobile-launcher__grid i {
    grid-row: 1 / -1;
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 20px;
    color: #ffffff;
    background: linear-gradient(145deg, #f78fb8, #7566d9);
    font-size: 21px;
    font-style: normal;
    font-weight: 900;
    box-shadow: 0 10px 24px rgba(133, 82, 151, 0.18);
  }

  .discover-mobile-launcher__grid button:nth-child(2) i {
    background: linear-gradient(145deg, #8b5cf6, #4f7bd9);
  }

  .discover-mobile-launcher__grid button:nth-child(3) i {
    background: linear-gradient(145deg, #54c7ec, #7066cf);
  }

  .discover-mobile-launcher__grid span {
    align-self: end;
    color: var(--pink);
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .discover-mobile-launcher__grid strong {
    font-size: 21px;
    line-height: 1.12;
  }

  .discover-mobile-launcher__grid small {
    align-self: start;
    color: var(--muted);
    font-size: 11px;
    line-height: 1.4;
  }

  .discover-curator-entry {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 3px 12px;
    align-items: center;
    min-height: 72px;
    border: 1px solid rgba(234, 76, 137, 0.15);
    border-radius: 18px;
    padding: 13px 16px;
    color: var(--text);
    text-align: left;
    background: linear-gradient(135deg, rgba(255, 240, 246, 0.8), rgba(245, 243, 255, 0.82));
  }

  .discover-curator-entry span {
    color: var(--pink);
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .discover-curator-entry strong {
    font-size: 14px;
  }

  .discover-curator-entry b {
    grid-column: 2;
    grid-row: 1 / 3;
    font-size: 24px;
  }

  .discover-mobile-home {
    display: block;
    width: fit-content;
    min-height: 34px;
    border: 1px solid rgba(234, 76, 137, 0.15);
    border-radius: 999px;
    padding: 0 14px;
    color: var(--theme-dark);
    background: rgba(255, 255, 255, 0.82);
    font-size: 12px;
    font-weight: 800;
  }
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
    padding: 6px;
  }

  .rail-cover {
    width: 60px;
  }

  .rail-card small {
    display: none;
  }

  .insight-rail {
    align-items: stretch;
    gap: 10px;
  }

  .insight-rail .rail-title {
    padding: 0 4px;
  }

  .insight-rail .insight-card {
    flex: 0 0 142px;
    width: 142px;
    min-height: 94px;
    padding: 12px;
  }

  .insight-rail .insight-card strong {
    overflow-wrap: anywhere;
    word-break: normal;
    font-size: 14px;
    line-height: 1.35;
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
    grid-template-columns: minmax(0, 1fr) 34px minmax(0, 1fr);
    align-items: center;
    gap: 7px;
  }

  .battle-preview .versus {
    justify-self: center;
    width: 34px;
    height: 34px;
    border-width: 4px;
    font-size: 10px;
  }

  .battle-preview .preview-song {
    align-self: stretch;
    align-content: start;
    gap: 7px;
    padding: 8px;
  }

  .battle-preview .battle-cover {
    width: min(112px, 100%);
    max-width: 112px;
    justify-self: center;
  }

  .battle-preview .preview-song span {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 11px;
    line-height: 1.35;
  }

  .battle-preview-shell {
    padding: 12px;
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

@media (max-width: 640px) {
  .discover-suite {
    gap: 12px;
    margin: -10px -8px;
    border-radius: 14px;
    padding: 8px;
  }

  .discover-hero {
    gap: 10px;
    border-radius: 16px;
    padding: 14px;
  }

  .discover-hero h1 {
    margin: 4px 0;
    font-size: clamp(22px, 6.4vw, 27px);
    line-height: 1.08;
  }

  .discover-hero p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 12px;
    line-height: 1.45;
  }

  .discover-hero__actions {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .discover-hero__actions::-webkit-scrollbar,
  .discover-tabs::-webkit-scrollbar,
  .overview-card-grid::-webkit-scrollbar {
    display: none;
  }

  .discover-hero__actions button {
    flex: 1 0 auto;
    min-height: 36px;
    font-size: 12px;
  }

  .discover-tabs {
    display: flex;
    gap: 7px;
    margin: 0 -8px;
    padding: 0 8px 2px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .discover-tabs button {
    flex: 0 0 auto;
    min-height: 34px;
    padding: 0 14px;
    font-size: 12px;
  }

  .section-title h2,
  .stage-heading h2,
  .dashed-box h3,
  .fortune-draft-card h2 {
    font-size: clamp(20px, 5.8vw, 24px);
  }

  .overview-lead {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
    padding: 16px;
  }

  .overview-lead h2 {
    font-size: 25px;
  }

  .overview-lead button {
    width: 100%;
    min-height: 38px;
  }

  .overview-side {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .overview-mini-card {
    align-content: start;
    gap: 9px;
    min-height: 170px;
    padding: 13px;
  }

  .overview-mini-card strong {
    font-size: 17px;
    line-height: 1.2;
  }

  .overview-mini-card p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 11px;
    line-height: 1.4;
  }

  .overview-mini-card button {
    align-self: end;
    width: 100%;
    min-height: 34px;
    margin-top: auto;
    padding: 0 8px;
    font-size: 11px;
  }

  .overview-card-grid {
    display: flex;
    gap: 10px;
    margin: 0 -8px;
    padding: 0 8px 4px;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
  }

  .overview-card {
    flex: 0 0 min(76vw, 280px);
    min-height: 126px;
    padding: 14px;
    scroll-snap-align: start;
  }

  .overview-card strong {
    font-size: 19px;
  }

  .playground-shell,
  .challenge-lab {
    gap: 10px;
  }

  .playground-rail,
  .battle-rail-left,
  .challenge-rail {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: min(74vw, 278px);
    gap: 10px;
    height: auto;
    max-height: none;
    padding: 10px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x proximity;
  }

  .playground-rail .rail-title {
    display: none;
  }

  .rail-card,
  .battle-rail-left .rail-card,
  .challenge-rail .rail-card {
    min-height: 72px;
    scroll-snap-align: start;
  }

  .challenge-main-stage,
  .challenge-work-panel,
  .dashed-box,
  .fortune-draft-card {
    padding: 14px;
  }

  .challenge-banner {
    grid-template-columns: minmax(0, 1fr) 54px;
    align-items: center;
    min-height: 0;
    padding: 14px;
  }

  .challenge-banner h2 {
    font-size: 25px;
  }

  .challenge-badge {
    width: 54px;
  }

  .challenge-flow {
    gap: 10px;
  }

  .challenge-prompt-card,
  .challenge-form-panel {
    padding: 14px;
  }

  .challenge-prompt-card strong {
    font-size: 18px;
  }

  .battle-duel-frame {
    grid-template-columns: 1fr;
    gap: 9px;
    padding: 10px;
  }

  .battle-song {
    grid-template-columns: 84px minmax(0, 1fr) auto;
    align-items: center;
    justify-items: stretch;
    gap: 10px;
    padding: 10px;
    text-align: left;
  }

  .battle-song .battle-cover {
    grid-row: 1 / span 2;
    width: 84px;
    max-width: 84px;
  }

  .battle-song div strong {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 14px;
    white-space: normal;
  }

  .battle-song div span {
    display: block;
    margin-top: 3px;
    font-size: 10px;
  }

  .battle-song button:not(.song-cover) {
    width: auto;
    min-width: 62px;
    min-height: 34px;
    padding: 0 9px;
  }

  .battle-song small {
    display: block;
    grid-column: 2 / -1;
    font-size: 10px;
  }

  .battle-divider {
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
  }

  .battle-divider::before,
  .battle-divider::after {
    width: 100%;
    height: 2px;
  }

  .battle-progress {
    grid-column: 1;
  }

  .insight-rail {
    display: flex;
    padding: 10px;
    overflow-x: auto;
  }

  .fortune-top-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .fortune-daily {
    min-height: 0;
    padding: 14px;
  }

  .fortune-daily__art {
    max-height: 112px;
    border-radius: 12px;
  }

  .fortune-daily h2 {
    font-size: 25px;
  }

  .metric-row {
    gap: 5px;
  }

  .metric-row strong {
    padding: 5px 8px;
    font-size: 10px;
  }

  .fortune-actions {
    grid-template-columns: 1fr 1fr;
    gap: 7px;
  }

  .fortune-actions button,
  .fortune-actions button:last-child {
    grid-column: auto;
    min-height: 38px;
    padding: 0 8px;
    font-size: 11px;
  }

  .fortune-actions button:first-child {
    grid-column: 1 / -1;
  }

  .calendar-panel {
    gap: 9px;
    padding: 12px;
  }

  .calendar-grid {
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 4px;
  }

  .calendar-grid button {
    border-radius: 10px;
    aspect-ratio: 0.82;
    padding: 2px;
  }

  .calendar-grid button strong {
    font-size: 12px;
  }

  .calendar-grid span {
    display: none;
  }

  .calendar-grid button::after {
    width: 4px;
    height: 4px;
  }

  .fortune-draft-card {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .fortune-draft-card pre {
    max-height: 180px;
    overflow: auto;
    font-size: 12px;
    line-height: 1.55;
  }

  .fortune-poster {
    gap: 8px;
    padding: 12px;
  }

  .share-card-panel {
    padding: 12px;
  }

  .share-card-sheet {
    width: min(330px, calc(100vw - 24px));
    padding: 12px;
  }

  .generated-song {
    gap: 8px;
    padding: 14px;
  }

  .discover-suite--battles {
    width: auto;
    max-width: calc(100% + 16px);
    overflow-x: clip;
  }

  .discover-suite--battles .discover-hero__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: visible;
  }

  .discover-suite--battles .discover-hero__actions button {
    min-width: 0;
  }

  .discover-suite--battles .battle-new-stage,
  .discover-suite--battles .battle-new-layout,
  .discover-suite--battles .battle-new-form,
  .discover-suite--battles .battle-preview-shell,
  .discover-suite--battles .battle-preview,
  .discover-suite--battles .preview-song {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  .discover-suite--battles .battle-new-stage {
    overflow: hidden;
  }

  .discover-suite--battles .battle-new-stage .stage-heading {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 8px;
  }

  .discover-suite--battles .battle-new-stage .stage-heading button {
    width: auto;
    min-width: max-content;
    min-height: 36px;
    padding: 0 10px;
    font-size: 11px;
  }

  .discover-suite--battles .topic-input-row,
  .discover-suite--battles input,
  .discover-suite--battles select {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  .discover-suite--battles .battle-preview {
    grid-template-columns: minmax(0, 1fr) 30px minmax(0, 1fr);
    gap: 5px;
  }

  .discover-suite--battles .battle-preview .versus {
    width: 30px;
    height: 30px;
  }

  .discover-suite--battles .battle-preview .preview-song {
    padding: 6px;
  }

  .discover-suite--battles .battle-preview .battle-cover {
    width: min(94px, 100%);
    max-width: 94px;
  }

  .challenge-rail {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-flow: row;
    grid-auto-columns: auto;
    gap: 8px;
    height: auto;
    max-height: 246px;
    padding: 8px;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-snap-type: none;
    mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - 18px), transparent 100%);
  }

  .challenge-rail .rail-card {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr);
    align-items: center;
    justify-items: stretch;
    gap: 8px;
    min-height: 76px;
    border: 1px solid rgba(234, 76, 137, 0.12);
    border-radius: 12px;
    padding: 8px;
    text-align: left;
    background: rgba(255, 255, 255, 0.72);
  }

  .challenge-rail .rail-card.is-active {
    border-color: rgba(234, 76, 137, 0.34);
    background: linear-gradient(135deg, #fff0f6, #fff9f2);
  }

  .challenge-rail .rail-cover {
    width: 44px;
    border-radius: 12px;
    font-size: 18px;
  }

  .challenge-rail .rail-card strong {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 12px;
    line-height: 1.3;
  }

  .challenge-rail .rail-card small {
    display: none;
  }
}

@media (max-height: 760px) {
  .share-card-sheet {
    width: min(320px, calc(100vw - 28px));
    gap: 10px;
    padding: 12px;
  }

  .share-card-canvas {
    max-height: calc(100vh - 176px);
  }
}
`
