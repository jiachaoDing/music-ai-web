export const meStyles = `
.me-page {
  gap: 26px;
}

.me-hero,
.me-panel,
.me-stat-card,
.me-quick-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #ffffff;
}

.me-hero,
.me-panel {
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.04);
}

.me-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: stretch;
  padding: 28px;
  background:
    radial-gradient(circle at top left, rgba(234, 76, 137, 0.08), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), #ffffff);
}

.me-hero__identity {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px;
  align-items: center;
}

.me-hero__avatar {
  width: 88px;
  aspect-ratio: 1;
  border: 0;
  color: #ffffff;
  background: linear-gradient(135deg, var(--theme), #ff7bac);
  box-shadow: 0 14px 30px rgba(234, 76, 137, 0.16);
}

.me-hero__copy {
  display: grid;
  gap: 8px;
}

.me-hero__copy span,
.me-panel__heading span,
.me-stat-card span,
.me-detail-row span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.me-hero__copy h1,
.me-panel__heading h2 {
  margin: 0;
  letter-spacing: 0;
}

.me-hero__copy h1 {
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.02;
}

.me-hero__copy p,
.me-panel__heading p,
.me-quick-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.68;
}

.me-hero__aside {
  display: grid;
  align-content: center;
  gap: 4px;
  min-width: 180px;
  border-radius: 8px;
  padding: 20px 22px;
  color: #ffffff;
  background: linear-gradient(135deg, #121127, #ea4c89);
}

.me-hero__aside strong {
  font-size: 36px;
  line-height: 1;
}

.me-hero__aside span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
}

.me-overview {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.9fr);
  gap: 18px;
}

.me-panel {
  display: grid;
  gap: 18px;
  padding: 24px;
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

.me-stats-grid,
.me-quick-grid {
  display: grid;
  gap: 14px;
}

.me-stats-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.me-quick-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.me-stat-card,
.me-quick-card {
  display: grid;
  gap: 10px;
  padding: 18px;
  background: linear-gradient(180deg, #ffffff, #fbfbfc);
}

.me-stat-card strong,
.me-quick-card strong,
.me-detail-row strong {
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: 0;
}

.me-quick-card strong {
  font-size: 18px;
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

@media (max-width: 880px) {
  .me-overview,
  .me-quick-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .me-page {
    gap: 18px;
  }

  .me-hero,
  .me-hero__identity {
    grid-template-columns: 1fr;
  }

  .me-panel,
  .me-hero {
    padding: 18px;
  }

  .me-hero__copy h1 {
    font-size: 28px;
  }

  .me-hero__aside {
    min-width: 0;
  }

  .me-panel__heading {
    display: grid;
    align-items: start;
  }

  .me-stats-grid,
  .me-quick-grid {
    grid-template-columns: 1fr;
  }

  .me-detail-row {
    display: grid;
    justify-content: start;
  }

  .me-detail-row strong {
    text-align: left;
  }
}
`
