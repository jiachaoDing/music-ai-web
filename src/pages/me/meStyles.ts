export const meStyles = `
.me-page {
  gap: 30px;
}

.me-dashboard,
.me-overview {
  display: grid;
  gap: 22px;
}

.me-overview {
  grid-template-columns: minmax(0, 1fr);
}

.me-dashboard {
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
}

.me-overview-board {
  display: grid;
  gap: 22px;
}

.me-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 6px;
  border: 1px solid rgba(13, 12, 34, 0.06);
  border-radius: 999px;
  background: linear-gradient(180deg, #fffdfd, #fff7fa);
}

.me-tabs button {
  min-height: 46px;
  border: 0;
  border-radius: 999px;
  color: var(--ink);
  background: transparent;
  box-shadow: none;
  font-weight: 800;
}

.me-tabs button:hover {
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.08);
  box-shadow: none;
}

.me-tabs button.is-active {
  color: var(--theme-dark);
  background: linear-gradient(180deg, #fff0f6, #ffe7f1);
  box-shadow: inset 0 0 0 1px rgba(234, 76, 137, 0.12);
}

.me-subtabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.me-subtabs button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  border: 1px solid rgba(13, 12, 34, 0.08);
  border-radius: 999px;
  padding: 0 14px;
  color: var(--ink);
  background: #ffffff;
  box-shadow: none;
  font-weight: 800;
}

.me-subtabs button:hover,
.me-subtabs button.is-active {
  border-color: rgba(234, 76, 137, 0.16);
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.08);
}

.me-subtabs span {
  min-width: 22px;
  border-radius: 999px;
  padding: 2px 7px;
  color: var(--muted);
  background: rgba(13, 12, 34, 0.06);
  font-size: 12px;
}

.me-work-rules {
  display: grid;
  justify-items: end;
  gap: 4px;
  max-width: 360px;
  border-right: 3px solid rgba(234, 76, 137, 0.32);
  padding-right: 14px;
  color: var(--muted);
  text-align: right;
}

.me-work-rules strong {
  color: var(--muted);
  font-size: 15px;
  font-weight: 760;
}

.me-work-rules p {
  margin: 0;
  color: var(--muted-2);
  background: transparent;
  font-size: 13px;
  line-height: 1.45;
}

.me-hero,
.me-panel,
.me-stat-card,
.me-quick-card,
.me-highlight__card {
  position: relative;
  border: 1px solid rgba(13, 12, 34, 0.06);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.96);
}

.me-hero,
.me-panel {
  overflow: hidden;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.05);
  backdrop-filter: blur(18px);
}

.me-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: 26px;
  min-height: 0;
  padding: clamp(28px, 4vw, 48px);
  border-radius: 24px;
  background:
    radial-gradient(circle at 8% 12%, rgba(234, 76, 137, 0.13), transparent 24%),
    radial-gradient(circle at 92% 86%, rgba(84, 199, 236, 0.1), transparent 26%),
    linear-gradient(145deg, rgba(255, 252, 253, 0.98), rgba(249, 247, 255, 0.96)),
    #ffffff;
}

.me-hero__glow {
  position: absolute;
  inset: auto auto -80px -60px;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(234, 76, 137, 0.14), transparent 68%);
  pointer-events: none;
}

.me-hero__identity {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  align-items: start;
  max-width: none;
}

.me-hero__avatar {
  flex: 0 0 104px;
  width: 104px;
  aspect-ratio: 1;
  border: 0;
  color: #ffffff;
  border-radius: 999px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.28), transparent 30%),
    linear-gradient(180deg, #f58ab6, #ea4c89);
  box-shadow: 0 0 0 7px rgba(255, 255, 255, 0.8), 0 18px 42px rgba(155, 93, 153, 0.2);
}

.me-hero__copy {
  display: grid;
  gap: 18px;
}

.me-hero__headline {
  display: flex;
  align-items: center;
  gap: 24px;
}

.me-hero__name {
  display: grid;
  gap: 9px;
  min-width: 0;
}

.me-hero__name > div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.me-hero__name small {
  border-radius: 999px;
  padding: 5px 9px;
  color: #6f5874;
  background: rgba(115, 95, 133, 0.09);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.me-hero__name p {
  font-family: Georgia, 'Songti SC', serif;
  font-size: 14px;
  font-style: italic;
}

.me-hero__copy span,
.me-panel__heading span,
.me-stat-card span,
.me-detail-row span,
.me-highlight__art span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.me-hero__copy h1,
.me-panel__heading h2,
.me-highlight__art strong {
  margin: 0;
  letter-spacing: 0;
}

.me-hero__copy h1 {
  font-size: clamp(38px, 4.1vw, 58px);
  line-height: 0.94;
}

.me-hero__copy p,
.me-panel__heading p,
.me-quick-card p,
.me-highlight__meta p {
  margin: 0;
  color: var(--muted);
  line-height: 1.62;
}

.me-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}

.me-hero__tags i {
  border: 0;
  border-radius: 999px;
  padding: 6px 11px;
  color: #615769;
  background: rgba(112, 94, 128, 0.08);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
}

.me-hero__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  width: 100%;
  margin-top: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.56);
  box-shadow: 0 18px 44px rgba(77, 55, 92, 0.07);
  backdrop-filter: blur(18px);
}

.me-hero__stat {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 9px;
  min-height: 104px;
  border: 0;
  border-radius: 0;
  padding: 19px 12px;
  background: transparent;
  box-shadow: none;
  text-align: center;
}

.me-hero__stat:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 22%;
  right: 0;
  width: 1px;
  height: 56%;
  background: rgba(87, 70, 99, 0.12);
}

.me-hero__stat span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
}

.me-hero__stat strong {
  color: var(--ink);
  font-family: 'Helvetica Neue', 'DIN Alternate', Arial, sans-serif;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1;
  letter-spacing: 0;
}

.me-hero__spotlight {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 6px;
  min-height: 100%;
  padding: 18px 18px;
  border-radius: 8px;
  color: var(--ink);
  background:
    radial-gradient(circle at top right, rgba(234, 76, 137, 0.13), transparent 36%),
    linear-gradient(180deg, #fff8fb, #fffdfd);
  box-shadow:
    inset 0 0 0 1px rgba(234, 76, 137, 0.12),
    0 14px 32px rgba(234, 76, 137, 0.08);
}

.me-hero__badge {
  justify-self: center;
  border-radius: 999px;
  padding: 6px 10px;
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.1);
  font-size: 12px;
  font-weight: 700;
}

.me-hero__spotlight strong {
  font-size: 48px;
  line-height: 1;
  color: var(--theme-dark);
}

.me-hero__spotlight span,
.me-hero__spotlight small {
  color: var(--muted);
}

.me-hero__spotlight small {
  font-size: 13px;
}

.me-hero__disc {
  position: relative;
  display: grid;
  place-items: center;
  width: 108px;
  aspect-ratio: 1;
  margin: 2px 0 6px;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.95) 0 14%, transparent 15%),
    radial-gradient(circle at 30% 32%, rgba(255, 255, 255, 0.28), transparent 18%),
    linear-gradient(180deg, #f693bd, #ea4c89);
  box-shadow:
    inset 0 0 0 14px rgba(18, 17, 39, 0.06),
    inset 0 0 0 30px rgba(18, 17, 39, 0.08),
    0 18px 34px rgba(234, 76, 137, 0.16);
}

.me-hero__disc::before {
  content: '';
  position: absolute;
  inset: 18px;
  border: 1px solid rgba(18, 17, 39, 0.08);
  border-radius: 999px;
}

.me-hero__disc b {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 0 8px rgba(18, 17, 39, 0.08);
}

.me-hero__score {
  display: grid;
  justify-items: center;
  gap: 2px;
  text-align: center;
}

.me-panel {
  display: grid;
  gap: 18px;
  padding: 26px;
}

.me-panel__heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.me-panel__heading h2 {
  font-size: 24px;
}

.me-stats-grid {
  display: grid;
  gap: 14px;
}

.me-stats-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.me-stat-card,
.me-quick-card {
  display: grid;
  gap: 12px;
  padding: 20px;
}

.me-stat-card {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 247, 250, 0.88));
}

.me-stat-card:nth-child(2n) {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 249, 251, 1));
}

.me-stat-card strong,
.me-quick-card strong,
.me-detail-row strong {
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: 0;
  color: var(--ink);
}

.me-quick-card strong {
  font-size: 18px;
}

.me-wallet-card {
  display: grid;
  gap: 12px;
  border: 1px solid rgba(234, 76, 137, 0.14);
  border-radius: 8px;
  padding: 20px;
  background:
    radial-gradient(circle at 88% 10%, rgba(234, 76, 137, 0.16), transparent 34%),
    linear-gradient(135deg, #fff8fb, #ffffff);
}

.me-wallet-card div {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
}

.me-wallet-card span,
.me-ledger-head span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 760;
}

.me-wallet-card strong {
  color: var(--theme-dark);
  font-size: 44px;
  line-height: 0.95;
}

.me-wallet-card p,
.me-ledger-empty {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
}

.me-ledger-card {
  display: grid;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
}

.me-ledger-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.me-ledger-head small {
  color: var(--muted);
  font-size: 12px;
}

.me-ledger-list {
  display: grid;
}

.me-ledger-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 54px;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  padding: 10px 0;
}

.me-ledger-row:first-child {
  border-top: 0;
}

.me-ledger-row div {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.me-ledger-row strong,
.me-ledger-row span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.me-ledger-row strong {
  color: var(--text);
  font-size: 14px;
}

.me-ledger-row span {
  color: var(--muted);
  font-size: 12px;
}

.me-ledger-row b {
  min-width: 54px;
  border-radius: 999px;
  padding: 6px 10px;
  text-align: center;
  font-size: 13px;
}

.me-ledger-row b.is-positive {
  color: #047857;
  background: rgba(16, 185, 129, 0.1);
}

.me-ledger-row b.is-negative {
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.1);
}

.me-studio-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.95fr) minmax(0, 1.05fr);
  gap: 18px;
  align-items: stretch;
}

.me-studio-feature {
  display: grid;
  gap: 18px;
  min-height: 320px;
  padding: 22px;
  border: 1px solid rgba(234, 76, 137, 0.14);
  border-radius: 8px;
  background:
    radial-gradient(circle at top right, rgba(234, 76, 137, 0.12), transparent 28%),
    linear-gradient(180deg, #fff8fb, #fff1f6);
}

.me-studio-feature__visual {
  display: grid;
  justify-items: start;
  gap: 12px;
}

.me-studio-feature__visual span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.me-studio-feature__body {
  display: grid;
  align-content: end;
  gap: 12px;
}

.me-studio-feature__body strong {
  font-size: 34px;
  line-height: 1.04;
  letter-spacing: 0;
}

.me-studio-feature__body p {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.66;
}

.me-studio-feature__meta {
  display: grid;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid rgba(13, 12, 34, 0.08);
}

.me-studio-feature__meta span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
  text-transform: uppercase;
}

.me-studio-feature__meta strong {
  font-size: 18px;
}

.me-studio-deck__disc {
  position: relative;
  display: grid;
  place-items: center;
  width: 160px;
  aspect-ratio: 1;
  margin-bottom: 18px;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.94) 0 14%, transparent 15%),
    linear-gradient(180deg, #f58ab6, #ea4c89);
  box-shadow:
    inset 0 0 0 16px rgba(18, 17, 39, 0.08),
    inset 0 0 0 34px rgba(18, 17, 39, 0.08),
    0 18px 34px rgba(234, 76, 137, 0.14);
}

.me-studio-deck__disc::before {
  content: '';
  position: absolute;
  inset: 18px;
  border: 1px solid rgba(18, 17, 39, 0.08);
  border-radius: 999px;
}

.me-studio-deck__disc b {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 0 0 8px rgba(18, 17, 39, 0.08);
}

.me-studio-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.me-studio-grid .me-quick-card {
  align-content: start;
  min-height: 152px;
  background: linear-gradient(180deg, #ffffff, #fff9fb);
}

.me-studio-grid .me-quick-card span {
  color: var(--theme-dark);
  font-size: 12px;
  font-weight: 760;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.me-studio-grid .me-quick-card strong {
  font-size: 20px;
}

.me-studio-grid .me-quick-card p {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.62;
}

.me-detail-list {
  display: grid;
  gap: 10px;
}

.me-hero__facts {
  display: none;
}

.me-ledger-more,
.me-account-back {
  min-height: 32px;
  border: 0;
  padding: 0 10px;
  color: var(--theme-dark);
  background: transparent;
  box-shadow: none;
  font-size: 12px;
}

.me-detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(13, 12, 34, 0.06);
}

.me-detail-row:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.me-detail-row strong {
  font-size: 15px;
  text-align: right;
}

.me-highlight__card {
  display: grid;
  gap: 0;
  width: 100%;
  padding: 0;
  overflow: hidden;
  color: inherit;
  text-align: left;
  background: #ffffff;
  box-shadow: none;
}

.me-highlight__hero {
  display: grid;
  grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.15fr);
  gap: 0;
}

.me-highlight__card:hover {
  transform: translateY(-2px);
  border-color: rgba(234, 76, 137, 0.18);
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.me-highlight__art {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 16px;
  min-height: 300px;
  padding: 24px;
  color: var(--ink);
  background:
    radial-gradient(circle at 18% 18%, rgba(234, 76, 137, 0.16), transparent 32%),
    radial-gradient(circle at 84% 18%, rgba(234, 76, 137, 0.14), transparent 22%),
    linear-gradient(180deg, #fffafb, #fff3f7);
}

.me-highlight__art span {
  border: 1px solid rgba(234, 76, 137, 0.16);
  border-radius: 999px;
  padding: 5px 9px;
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.08);
}

.me-highlight__art strong {
  max-width: 220px;
  font-size: 28px;
  line-height: 1.04;
  color: var(--ink);
  text-align: center;
}

.me-highlight__disc {
  position: relative;
  display: grid;
  place-items: center;
  width: 176px;
  aspect-ratio: 1;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.95) 0 14%, transparent 15%),
    radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.2), transparent 18%),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--cover-color, #ea4c89) 72%, white),
      var(--cover-color, #ea4c89)
    );
  box-shadow:
    inset 0 0 0 18px rgba(18, 17, 39, 0.08),
    inset 0 0 0 38px rgba(18, 17, 39, 0.08),
    0 20px 38px rgba(234, 76, 137, 0.14);
}

.me-highlight__disc::before {
  content: '';
  position: absolute;
  inset: 20px;
  border: 1px solid rgba(18, 17, 39, 0.08);
  border-radius: 999px;
}

.me-highlight__disc b {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 0 0 8px rgba(18, 17, 39, 0.08);
}

.me-highlight__cover {
  width: min(260px, 78%);
  aspect-ratio: 1;
  border-radius: 8px;
  object-fit: cover;
  box-shadow:
    0 22px 52px rgba(15, 23, 42, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.72);
}

.me-highlight__title {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.me-highlight__details {
  display: grid;
  align-content: center;
  gap: 16px;
  padding: 28px;
}

.me-highlight__details p {
  margin: 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.68;
}

.me-highlight__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(13, 12, 34, 0.08);
}

.me-highlight__summary span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.me-highlight__summary strong {
  display: block;
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.4;
}

.me-highlight__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px 20px;
  border-top: 1px solid rgba(13, 12, 34, 0.08);
}

.me-highlight__wave {
  display: flex;
  align-items: end;
  gap: 6px;
}

.me-highlight__wave i {
  display: block;
  width: 5px;
  border-radius: 999px;
  background: rgba(13, 12, 34, 0.66);
}

.me-highlight__wave i:nth-child(1) {
  height: 14px;
}

.me-highlight__wave i:nth-child(2) {
  height: 24px;
}

.me-highlight__wave i:nth-child(3) {
  height: 18px;
}

.me-highlight__wave i:nth-child(4) {
  height: 28px;
}

.me-highlight__cta {
  color: var(--theme-dark);
  font-size: 14px;
  font-weight: 760;
}

.me-playlist-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.me-playlist-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.me-playlist-actions p {
  margin: 0;
}

.me-create-playlist {
  min-width: 120px;
  border: 0;
  border-radius: 999px;
  background: var(--theme);
}

.me-playlist-card {
  display: grid;
  gap: 14px;
  cursor: pointer;
}

.me-playlist-card:focus-visible {
  outline: 3px solid rgba(234, 76, 137, 0.2);
  outline-offset: 6px;
}

.me-playlist-card:hover .me-playlist-cover {
  transform: translateY(-3px);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
}

.me-playlist-cover {
  position: relative;
  overflow: hidden;
  display: grid;
  align-content: end;
  min-height: 220px;
  padding: 16px;
  border: 1px solid rgba(13, 12, 34, 0.06);
  border-radius: 8px;
  background:
    radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.42), transparent 24%),
    radial-gradient(circle at 82% 18%, rgba(255, 255, 255, 0.24), transparent 22%),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--playlist-color, #9ed9cc) 38%, white),
      var(--playlist-color, #ea4c89)
    );
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}

.me-playlist-cover img,
.me-playlist-detail-cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.me-playlist-cover.has-image::after,
.me-playlist-detail-cover.has-image::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(13, 12, 34, 0.02), rgba(13, 12, 34, 0.36));
  content: '';
}

.me-playlist-cover span {
  position: relative;
  z-index: 1;
  justify-self: start;
  border-radius: 999px;
  padding: 5px 9px;
  color: rgba(13, 12, 34, 0.72);
  background: rgba(255, 255, 255, 0.42);
  font-size: 12px;
  font-weight: 760;
  text-transform: uppercase;
}

.me-playlist-body {
  display: grid;
  gap: 8px;
}

.me-playlist-body strong {
  font-size: 20px;
  line-height: 1.08;
  letter-spacing: 0;
}

.me-playlist-body p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

.me-playlist-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.me-playlist-meta span {
  border-radius: 999px;
  padding: 5px 9px;
  color: var(--muted);
  background: #f7f7f9;
  font-size: 12px;
  font-weight: 700;
}

.me-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(13, 12, 34, 0.18);
  backdrop-filter: blur(8px);
}

.me-modal {
  display: grid;
  gap: 18px;
  width: min(460px, 100%);
  border: 1px solid rgba(13, 12, 34, 0.08);
  border-radius: 8px;
  padding: 22px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.14);
}

.me-modal--wide {
  width: min(860px, 100%);
}

.me-modal__heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
}

.me-modal__heading span,
.me-modal__field span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.me-modal__heading h3 {
  margin: 4px 0 0;
  font-size: 28px;
  line-height: 1;
  letter-spacing: 0;
}

.me-modal__close,
.me-modal__ghost {
  border: 1px solid rgba(13, 12, 34, 0.08);
  color: var(--text);
  background: #ffffff;
  box-shadow: none;
}

.me-modal__close:hover,
.me-modal__ghost:hover {
  background: #f7f7f9;
  box-shadow: none;
}

.me-modal__field {
  display: grid;
  gap: 10px;
}

.me-modal__field input {
  min-height: 50px;
}

.me-modal__field select {
  min-height: 50px;
  border: 1px solid rgba(13, 12, 34, 0.08);
  border-radius: 8px;
  padding: 0 14px;
  color: var(--text);
  background: #ffffff;
  font: inherit;
  font-weight: 700;
}

.me-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.me-playlist-detail-head {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 18px;
  align-items: end;
}

.me-playlist-detail-head p {
  margin: 0 0 8px;
  color: var(--muted);
  font-weight: 700;
}

.me-playlist-play-all {
  min-height: 36px;
  border: 1px solid rgba(234, 76, 137, 0.16);
  border-radius: 999px;
  padding: 0 16px;
  color: #ffffff;
  background: var(--theme);
  box-shadow: 0 12px 24px var(--theme-shadow);
  font-size: 14px;
  font-weight: 800;
}

.me-playlist-play-all:disabled {
  cursor: not-allowed;
  color: var(--muted);
  background: rgba(13, 12, 34, 0.06);
  box-shadow: none;
}

.me-playlist-detail-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.me-playlist-danger {
  min-height: 34px;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 0 11px;
  color: #a73939;
  background: transparent;
  box-shadow: none;
  font-size: 13px;
  font-weight: 700;
}

.me-playlist-danger:hover {
  border-color: rgba(183, 49, 49, 0.16);
  color: #942b2b;
  background: #fff5f4;
  box-shadow: none;
}

.me-playlist-danger:disabled {
  cursor: not-allowed;
  color: var(--muted);
  background: transparent;
  opacity: 0.58;
}

.me-playlist-rename {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: end;
  max-width: 640px;
  margin-top: 4px;
  border: 1px solid rgba(13, 12, 34, 0.08);
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
}

.me-playlist-rename label {
  display: grid;
  gap: 8px;
}

.me-playlist-rename span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.me-playlist-rename input {
  min-height: 40px;
  border-color: rgba(13, 12, 34, 0.1);
  background: #ffffff;
  font-size: 14px;
  font-weight: 650;
}

.me-playlist-rename button {
  min-width: 88px;
  min-height: 40px;
  border-radius: 6px;
  padding: 0 14px;
  font-size: 13px;
  box-shadow: none;
}

.me-playlist-rename button:disabled {
  cursor: not-allowed;
  color: var(--muted);
  background: rgba(13, 12, 34, 0.06);
  border-color: transparent;
  box-shadow: none;
  opacity: 0.72;
}

.me-playlist-detail-cover {
  position: relative;
  overflow: hidden;
  display: grid;
  align-content: end;
  min-height: 160px;
  border: 1px solid rgba(13, 12, 34, 0.06);
  border-radius: 8px;
  padding: 14px;
  background:
    radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.42), transparent 24%),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--playlist-color, #9ed9cc) 38%, white),
      var(--playlist-color, #ea4c89)
    );
}

.me-playlist-detail-cover span {
  position: relative;
  z-index: 1;
  justify-self: start;
  border-radius: 999px;
  padding: 5px 9px;
  color: rgba(13, 12, 34, 0.72);
  background: rgba(255, 255, 255, 0.42);
  font-size: 12px;
  font-weight: 760;
  text-transform: uppercase;
}

.me-playlist-song-list {
  display: grid;
  gap: 10px;
  max-height: min(430px, 52vh);
  overflow: auto;
  padding-right: 4px;
}

.me-playlist-song-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  border: 1px solid rgba(13, 12, 34, 0.07);
  border-radius: 8px;
  padding: 12px;
  background: #ffffff;
}

.me-playlist-song-row > button:first-child {
  display: grid;
  gap: 5px;
  min-height: auto;
  border: 0;
  padding: 0;
  color: var(--text);
  text-align: left;
  background: transparent;
  box-shadow: none;
}

.me-playlist-song-row strong {
  font-size: 16px;
}

.me-playlist-song-row span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.me-playlist-song-row__remove {
  min-height: 38px;
  border: 1px solid rgba(13, 12, 34, 0.08);
  color: var(--muted);
  background: #f7f7f9;
  box-shadow: none;
}

.me-playlist-empty {
  border: 1px dashed rgba(234, 76, 137, 0.22);
  border-radius: 8px;
  padding: 18px;
  color: var(--muted);
  background: rgba(234, 76, 137, 0.05);
  font-weight: 700;
}

.me-highlight__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.me-highlight__stats span {
  border-radius: 999px;
  padding: 5px 10px;
  color: var(--muted);
  background: #f7f7f9;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 980px) {
  .me-overview,
  .me-dashboard {
    grid-template-columns: 1fr;
  }

  .me-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .me-hero {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .me-studio-layout {
    grid-template-columns: 1fr;
  }

  .me-studio-feature {
    min-height: auto;
  }

  .me-studio-grid,
  .me-highlight__hero,
  .me-highlight__summary,
  .me-playlist-grid {
    grid-template-columns: 1fr;
  }

  .me-playlist-actions {
    display: grid;
    justify-items: start;
  }

  .me-playlist-detail-head {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .me-playlist-rename {
    grid-template-columns: 1fr;
  }

  .me-playlist-rename button {
    width: 100%;
  }

  .me-page {
    gap: 18px;
  }

  .me-tabs {
    grid-template-columns: 1fr;
    border-radius: 18px;
  }

  .me-hero,
  .me-panel {
    padding: 18px;
  }

  .me-hero__headline {
    align-items: flex-start;
    gap: 14px;
  }

  .me-hero__copy h1 {
    font-size: 28px;
  }

  .me-hero__tags {
    gap: 8px;
  }

  .me-hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .me-hero__spotlight {
    min-width: 0;
  }

  .me-hero__disc {
    width: 124px;
  }

  .me-panel__heading {
    display: grid;
    align-items: start;
  }

  .me-work-rules {
    justify-items: start;
    max-width: none;
    border-right: 0;
    border-left: 3px solid rgba(234, 76, 137, 0.28);
    padding-right: 0;
    padding-left: 12px;
    text-align: left;
  }

  .me-stats-grid {
    grid-template-columns: 1fr;
  }

  .me-detail-row {
    display: grid;
    justify-content: start;
  }

  .me-detail-row strong {
    text-align: left;
  }

  .me-highlight__art {
    min-height: 180px;
  }

  .me-highlight__disc {
    width: 138px;
  }

  .me-highlight__cover {
    width: min(180px, 82%);
  }

  .me-highlight__art strong {
    font-size: 24px;
  }

  .me-highlight__details,
  .me-highlight__footer {
    padding: 18px;
  }
}

@media (max-width: 640px) {
  .me-page {
    gap: 22px;
    margin: -12px;
    padding: 12px 12px 24px;
    background:
      radial-gradient(circle at 12% 2%, rgba(234, 76, 137, 0.14), transparent 25%),
      radial-gradient(circle at 92% 12%, rgba(84, 199, 236, 0.12), transparent 28%),
      linear-gradient(180deg, #fffafd 0%, #f7f8ff 42%, #ffffff 100%);
  }

  .me-hero,
  .me-panel {
    border-radius: 0;
    padding: 0;
  }

  .me-hero {
    overflow: visible;
    border: 0;
    border-radius: 0;
    padding: 18px 8px 4px;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  .me-hero__copy {
    justify-items: center;
    gap: 16px;
    text-align: center;
  }

  .me-hero__copy > span {
    font-size: 9px;
    letter-spacing: 0.32em;
  }

  .me-hero__headline {
    display: grid;
    justify-items: center;
    gap: 13px;
  }

  .me-hero__avatar {
    width: 72px;
    font-family: Georgia, serif;
    font-size: 34px;
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.72), 0 14px 32px rgba(172, 76, 133, 0.2);
  }

  .me-hero__name,
  .me-hero__name > div {
    justify-items: center;
    justify-content: center;
  }

  .me-hero__copy h1 {
    font-family: 'Helvetica Neue', 'PingFang SC', sans-serif;
    font-size: 28px;
    letter-spacing: -0.04em;
  }

  .me-hero__name p {
    max-width: 280px;
    font-size: 12px;
    line-height: 1.6;
  }

  .me-hero__tags {
    justify-content: center;
    margin-top: 0;
  }

  .me-hero__tags i {
    padding: 7px 12px;
    color: #655b6c;
    background: rgba(255, 255, 255, 0.58);
    box-shadow: inset 0 0 0 1px rgba(100, 77, 114, 0.06);
  }

  .me-hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0;
    margin-top: 4px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .me-hero__stat {
    min-height: 58px;
    padding: 8px 6px;
  }

  .me-hero__stat:nth-child(2)::after {
    display: none;
  }

  .me-hero__stat:nth-child(-n + 2) {
    border-bottom: 1px solid rgba(87, 70, 99, 0.1);
  }

  .me-hero__stat strong {
    font-size: 21px;
  }

  .me-page .card-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 10px;
  }

  .me-page .song-cover {
    min-height: 0;
    aspect-ratio: 1;
    border-radius: 16px;
    padding: 10px;
  }

  .me-page .song-card h3 {
    font-size: 14px;
  }

  .me-hero__disc {
    width: 92px;
  }

  .me-tabs {
    display: flex;
    gap: 7px;
    overflow-x: auto;
    border: 0;
    border-bottom: 1px solid rgba(77, 60, 91, 0.1);
    border-radius: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
    scrollbar-width: none;
  }

  .me-tabs button {
    flex: 0 0 auto;
    position: relative;
    min-height: 42px;
    border-radius: 0;
    padding: 0 14px;
    font-size: 12px;
  }

  .me-tabs button.is-active {
    color: var(--theme-dark);
    background: transparent;
  }

  .me-tabs button.is-active::after {
    content: '';
    position: absolute;
    right: 13px;
    bottom: 0;
    left: 13px;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, #ea4c89, #8b5cf6);
  }

  .me-panel {
    overflow: visible;
    border: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  .me-panel__heading {
    padding: 0 2px;
  }

  .me-panel__heading > div > span {
    font-size: 9px;
    letter-spacing: 0.18em;
  }

  .me-panel__heading h2 {
    font-size: 27px;
  }

  .me-overview-board {
    gap: 30px;
  }

  .me-panel--account,
  .me-highlight {
    padding: 0;
  }

  .me-account-grid,
  .me-highlight__card {
    border-radius: 0;
  }

  .me-wallet-card {
    border: 0;
    border-radius: 0;
    padding: 18px 2px;
    background: transparent;
    box-shadow: none;
  }

  .me-wallet-card strong {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 32px;
    letter-spacing: -.05em;
  }

  .me-ledger-card {
    border: 0;
    border-top: 1px solid rgba(77, 60, 91, 0.1);
    border-radius: 0;
    padding: 20px 0 0;
    background: transparent;
  }

  .me-ledger-row {
    padding: 13px 2px;
  }

  .me-detail-list {
    border: 0;
    border-top: 1px solid rgba(77, 60, 91, 0.1);
    border-radius: 0;
    background: transparent;
  }

  .me-detail-row {
    padding: 14px 2px;
  }

  .me-highlight__card {
    overflow: visible;
    border: 0;
    background: transparent;
    box-shadow: none;
  }

  .me-highlight__hero {
    gap: 14px;
  }

  .me-highlight__art {
    min-height: 210px;
    overflow: hidden;
    border-radius: 24px;
    box-shadow: 0 20px 44px rgba(42, 31, 54, 0.14);
  }

  .me-highlight__details {
    border: 0;
    padding: 4px 2px 0;
    background: transparent;
  }

  .me-highlight__footer {
    border-top: 1px solid rgba(77, 60, 91, 0.1);
    padding: 12px 2px 0;
    background: transparent;
  }

  .me-playlist-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }

  .me-playlist-card {
    grid-template-columns: 88px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
  }

  .me-playlist-cover {
    width: 88px;
    min-height: 0;
    aspect-ratio: 1;
    border-radius: 16px;
    padding: 9px;
  }

  .me-playlist-cover span {
    padding: 4px 7px;
    font-size: 8px;
  }

  .me-playlist-body {
    gap: 5px;
  }

  .me-playlist-body strong {
    font-size: 17px;
  }

  .me-playlist-body p,
  .me-playlist-meta {
    font-size: 11px;
  }

  .me-playlist-meta {
    gap: 5px;
  }

  .me-create-playlist {
    min-height: 34px;
    padding: 0 13px;
    font-size: 12px;
  }

  .me-stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .me-stat-card {
    min-height: 92px;
    padding: 12px;
  }

  .me-highlight__disc {
    width: 104px;
  }

  .me-highlight__details,
  .me-highlight__footer {
    padding: 14px;
  }
}

/* Mobile profile: compact creator summary and horizontal music rows. */
@media (max-width: 640px) {
  .me-page {
    gap: 14px;
  }

  .me-hero {
    padding: 8px 4px 2px;
  }

  .me-hero__copy {
    gap: 10px;
  }

  .me-hero__headline {
    grid-template-columns: 58px minmax(0, 1fr);
    justify-items: stretch;
    align-items: center;
    width: 100%;
    gap: 12px;
    text-align: left;
  }

  .me-hero__avatar {
    width: 58px;
    font-size: 27px;
  }

  .me-hero__name,
  .me-hero__name > div {
    justify-items: start;
    justify-content: start;
  }

  .me-hero__copy h1 {
    font-size: 23px;
  }

  .me-hero__name p {
    max-width: none;
    font-size: 11px;
    line-height: 1.45;
  }

  .me-hero__tags {
    grid-column: 1 / -1;
    justify-content: flex-start;
    gap: 5px;
  }

  .me-hero__tags i {
    padding: 5px 8px;
    font-size: 10px;
  }

  .me-hero__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    width: 100%;
    margin-top: 0;
    border-top: 1px solid rgba(87, 70, 99, .09);
    border-bottom: 1px solid rgba(87, 70, 99, .09);
  }

  .me-hero__stat {
    min-height: 52px;
    padding: 8px 3px;
    border: 0 !important;
  }

  .me-hero__stat + .me-hero__stat {
    border-left: 1px solid rgba(87, 70, 99, .09) !important;
  }

  .me-hero__stat span {
    font-size: 9px;
    white-space: nowrap;
  }

  .me-hero__stat strong {
    font-size: 18px;
  }

  .me-tabs button {
    flex: 1 1 0;
    min-width: max-content;
    padding: 0 7px;
    font-size: 11px;
  }

  .me-panel__heading h2 {
    font-size: 23px;
  }

  .me-page .card-list {
    grid-template-columns: 1fr;
    gap: 9px;
  }

  .me-page .song-card {
    grid-template-columns: 72px minmax(0, 1fr);
    align-items: center;
    gap: 11px;
    min-height: 90px;
    overflow: hidden;
    border: 1px solid rgba(77, 60, 91, .08);
    border-radius: 16px;
    padding: 8px;
    background: rgba(255, 255, 255, .62);
    box-shadow: 0 9px 24px rgba(55, 42, 66, .05);
  }

  .me-page .song-card__cover-wrap,
  .me-page .song-cover {
    width: 72px;
    min-height: 72px;
    aspect-ratio: 1;
    border-radius: 12px;
  }

  .me-page .song-cover {
    padding: 7px;
  }

  .me-page .song-cover__eyebrow {
    display: none;
  }

  .me-page .song-cover__play {
    width: 32px;
  }

  .me-page .song-card__body {
    gap: 5px 7px;
  }

  .me-page .song-card h3 {
    font-size: 14px;
  }

  .me-page .song-card p {
    display: none;
  }

  .me-page .song-card__meta {
    flex-wrap: nowrap;
    overflow: hidden;
    gap: 5px;
    font-size: 10px;
    white-space: nowrap;
  }

  .me-page .song-card__meta strong {
    max-width: 76px;
    overflow: hidden;
    font-size: 11px;
    text-overflow: ellipsis;
  }

  .me-highlight {
    padding: 0;
  }

  .me-latest-song {
    position: relative;
  }

  .me-latest-song .song-card {
    padding-right: 76px;
  }

  .me-latest-song__extra {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: grid;
    justify-items: end;
    gap: 4px;
    max-width: 66px;
  }

  .me-latest-song__extra span {
    max-width: 66px;
    overflow: hidden;
    border-radius: 999px;
    padding: 3px 6px;
    color: var(--theme-dark);
    background: rgba(234, 76, 137, .08);
    font-size: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .me-wallet-card {
    gap: 6px;
    padding: 10px 2px;
  }

  .me-wallet-card strong {
    font-size: 27px;
  }

  .me-wallet-card p {
    font-size: 11px;
    line-height: 1.45;
  }

  .me-playlist-grid {
    gap: 9px;
  }

  .me-playlist-card {
    grid-template-columns: 68px minmax(0, 1fr);
    gap: 10px;
  }

  .me-playlist-cover {
    width: 68px;
    border-radius: 13px;
    padding: 6px;
  }

  .me-playlist-body strong {
    font-size: 15px;
  }

  .me-playlist-meta span {
    padding: 3px 6px;
    font-size: 9px;
  }

  .me-ledger-card {
    gap: 5px;
    padding-top: 12px;
  }

  .me-ledger-list .me-ledger-row {
    display: none;
  }

  .me-ledger-list .me-ledger-row:first-child {
    display: grid;
    min-height: 44px;
    padding: 6px 2px;
  }

  .me-ledger-row div {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .me-ledger-row strong {
    font-size: 12px;
  }

  .me-ledger-row span {
    font-size: 10px;
  }

  .me-ledger-row b {
    min-width: 42px;
    padding: 4px 7px;
    font-size: 11px;
  }

  .me-detail-list {
    display: none;
  }

  .me-hero__facts {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    width: 100%;
    border-bottom: 1px solid rgba(87, 70, 99, .09);
  }

  .me-hero__facts > span {
    display: grid;
    gap: 3px;
    min-width: 0;
    padding: 8px 3px;
  }

  .me-hero__facts > span + span {
    border-left: 1px solid rgba(87, 70, 99, .08);
  }

  .me-hero__facts small {
    color: var(--muted);
    font-size: 8px;
  }

  .me-hero__facts strong {
    overflow: hidden;
    font-size: 9px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .me-detail-row {
    display: grid;
    justify-items: start;
    gap: 3px;
    min-width: 0;
    padding: 10px 4px;
    border-bottom: 1px solid rgba(77, 60, 91, .08);
  }

  .me-detail-row:nth-child(odd) {
    border-right: 1px solid rgba(77, 60, 91, .08);
  }

  .me-detail-row span {
    font-size: 9px;
  }

  .me-detail-row strong {
    max-width: 100%;
    overflow: hidden;
    font-size: 11px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .me-highlight__card {
    grid-template-columns: 82px minmax(0, 1fr);
    align-items: center;
    gap: 10px;
    min-height: 92px;
  }

  .me-highlight__hero {
    display: contents;
  }

  .me-highlight__art {
    min-height: 82px;
    border-radius: 14px;
    padding: 6px;
    box-shadow: none;
  }

  .me-highlight__art > span,
  .me-highlight__art > strong,
  .me-highlight__footer {
    display: none;
  }

  .me-highlight__cover,
  .me-highlight__disc {
    width: 72px;
  }

  .me-highlight__details {
    gap: 6px;
    padding: 4px 2px;
  }

  .me-highlight__details h3,
  .me-highlight__details strong {
    font-size: 15px;
  }

  .me-highlight__details p {
    overflow: hidden;
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .me-highlight__stats,
  .me-highlight__summary {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .me-highlight__stats span,
  .me-highlight__summary > div {
    border-radius: 999px;
    padding: 3px 6px;
    font-size: 9px;
    background: rgba(234, 76, 137, .07);
  }

  .me-highlight__summary > div span {
    display: none;
  }

  .me-highlight__summary > div strong {
    font-size: 9px;
  }

  .me-account-back {
    width: fit-content;
    margin-bottom: 6px;
    border-radius: 999px;
    background: rgba(234, 76, 137, .08);
  }

  .me-ledger-page .me-ledger-list .me-ledger-row {
    display: grid;
    min-height: 48px;
    padding: 8px 2px;
  }

  .me-page {
    background:
      radial-gradient(ellipse 78% 36% at 4% 0%, rgba(234, 76, 137, .055), transparent 72%),
      radial-gradient(ellipse 72% 34% at 96% 5%, rgba(84, 199, 236, .045), transparent 74%),
      linear-gradient(180deg, rgba(253, 252, 254, .72), #ffffff 46%);
  }

  .me-hero__glow {
    opacity: .24;
    filter: blur(28px);
  }
}
`
