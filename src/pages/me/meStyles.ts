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
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
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
  grid-template-columns: minmax(0, 1.18fr) 272px;
  align-items: center;
  gap: 22px;
  min-height: 272px;
  padding: 26px 32px;
  background:
    radial-gradient(circle at 8% 16%, rgba(234, 76, 137, 0.12), transparent 18%),
    radial-gradient(circle at 88% 84%, rgba(234, 76, 137, 0.08), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 247, 250, 0.98)),
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
  max-width: 860px;
}

.me-hero__avatar {
  flex: 0 0 88px;
  width: 88px;
  aspect-ratio: 1;
  border: 0;
  color: #ffffff;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.28), transparent 30%),
    linear-gradient(180deg, #f58ab6, #ea4c89);
  box-shadow: 0 16px 34px rgba(234, 76, 137, 0.16);
}

.me-hero__copy {
  display: grid;
  gap: 10px;
}

.me-hero__headline {
  display: flex;
  align-items: center;
  gap: 18px;
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
  font-size: clamp(38px, 4.1vw, 64px);
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
  border: 1px solid rgba(234, 76, 137, 0.14);
  border-radius: 999px;
  padding: 6px 11px;
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.06);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
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
}

.me-playlist-cover {
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
}

.me-playlist-cover span {
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

.me-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
}

@media (max-width: 640px) {
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

  .me-highlight__art strong {
    font-size: 24px;
  }

  .me-highlight__details,
  .me-highlight__footer {
    padding: 18px;
  }
}
`
