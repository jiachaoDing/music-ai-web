export const createStyles = `
.create-challenge-context{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:5px 14px;border:1px solid rgba(234,76,137,.2);border-radius:16px;padding:16px 20px;background:linear-gradient(135deg,rgba(255,240,246,.9),rgba(255,255,255,.86))}.create-challenge-context span{color:var(--theme-dark);font-size:12px;font-weight:800;letter-spacing:.06em}.create-challenge-context strong{font-size:18px}.create-challenge-context p{grid-column:2;margin:0;color:var(--muted);font-size:13px}
.create-suite {
  gap: clamp(16px, 2vw, 24px);
}

.create-page-hero,
.create-producer-card,
.create-mode-section,
.create-form-panel {
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

.create-page-hero {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 10px;
  border: 0;
  padding: clamp(12px, 2vw, 24px) 0 clamp(6px, 1.2vw, 12px);
  background: transparent;
  box-shadow: none;
  text-align: center;
}

.create-page-hero--compact {
  padding: clamp(18px, 2.5vw, 28px);
}

.create-page-hero span,
.create-producer-card span,
.create-section-heading span,
.create-panel-heading span {
  color: var(--theme-dark);
  font-size: 12px;
  font-weight: 820;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.create-page-hero h1,
.create-section-heading h2,
.create-panel-heading h2 {
  margin: 0;
  color: var(--text);
  letter-spacing: 0;
  line-height: 1.08;
}

.create-page-hero h1 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(38px, 4.6vw, 76px);
  font-weight: 850;
}

.create-wave-title {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.015em;
  max-width: min(1240px, 100%);
  transform: translateY(18px);
}

.create-wave-title span {
  display: inline-block;
  color: transparent;
  background: linear-gradient(100deg, #f9a8d4 0%, #c4b5fd 100%);
  background-clip: text;
  -webkit-background-clip: text;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: 0;
  line-height: inherit;
  text-transform: none;
  animation: create-title-wave 5s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  animation-delay: calc(var(--wave-index) * 55ms);
}

.create-wave-title .create-title-space {
  width: 0.34em;
}

.create-title-mobile-break {
  display: none !important;
}

.create-section-heading h2,
.create-panel-heading h2 {
  font-size: clamp(21px, 2.8vw, 30px);
}

.create-page-hero p,
.create-producer-card p,
.create-section-heading p {
  margin: 0;
  max-width: 720px;
  color: var(--muted);
  line-height: 1.65;
}

.create-producer-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: clamp(18px, 2.4vw, 26px);
  border-radius: 999px 28px 28px 999px;
  background:
    radial-gradient(circle at 8% 50%, rgba(234, 76, 137, 0.1), transparent 18%),
    rgba(255, 255, 255, 0.9);
}

.create-producer-card strong {
  display: block;
  margin: 6px 0 8px;
  color: var(--text);
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.12;
}

.create-producer-label {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 1px solid rgba(234, 76, 137, 0.22);
  border-radius: 999px;
  padding: 7px 12px;
  color: var(--theme-dark);
  background: rgba(255, 240, 246, 0.92);
  box-shadow: 0 8px 18px rgba(234, 76, 137, 0.08);
}

.create-producer-card button,
.create-form-actions button {
  min-height: 44px;
  border-radius: 999px;
  font-weight: 820;
}

.create-mode-section {
  display: grid;
  gap: 16px;
  padding: clamp(18px, 2.4vw, 26px);
  border-radius: 18px 34px 18px 34px;
}

.create-section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
}

.create-section-heading p {
  max-width: 360px;
}

.create-mode-stage {
  display: grid;
  grid-template-columns: minmax(210px, 0.28fr) minmax(420px, 0.72fr);
  gap: clamp(14px, 2vw, 22px);
  align-items: stretch;
}

.create-turntable {
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 14px;
  min-height: 300px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 44px 18px 44px 18px;
  padding: clamp(20px, 3vw, 30px);
  color: var(--text);
  text-align: center;
  background:
    radial-gradient(circle at 50% 34%, rgba(234, 76, 137, 0.12), transparent 36%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.84), rgba(255, 245, 250, 0.62));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.72),
    0 16px 38px rgba(15, 23, 42, 0.06);
}

.create-turntable strong {
  display: block;
  font-size: 16px;
}

.create-turntable small {
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.create-mode-star:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--create-accent) 30%, white);
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.98), color-mix(in srgb, var(--create-accent) 8%, white));
  box-shadow:
    0 16px 28px rgba(15, 23, 42, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.72);
}

.create-mode-orbit {
  position: relative;
  overflow: hidden;
  display: grid;
  min-height: 360px;
  border-radius: 18px 44px 18px 44px;
  padding: clamp(18px, 2.4vw, 28px);
  background:
    radial-gradient(circle at 50% 50%, rgba(234, 76, 137, 0.08), transparent 22%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.86), rgba(255, 250, 252, 0.7));
}

.create-mode-orbit::before,
.create-mode-orbit::after {
  content: '';
  position: absolute;
  inset: 50% auto auto 50%;
  border: 1px dashed rgba(234, 76, 137, 0.2);
  border-radius: 999px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.create-mode-orbit::before {
  width: min(420px, 82%);
  aspect-ratio: 1.55;
}

.create-mode-orbit::after {
  width: min(300px, 62%);
  aspect-ratio: 1.25;
}

.create-orbit-core {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 82px;
  height: 82px;
  border: 1px solid rgba(234, 76, 137, 0.22);
  border-radius: 999px;
  color: var(--theme-dark);
  background: rgba(255, 240, 246, 0.88);
  font-size: 13px;
  font-weight: 900;
  transform: translate(-50%, -50%);
}

.create-mode-index {
  display: grid;
  place-items: center;
  min-width: 48px;
  height: 34px;
  border: 1px solid color-mix(in srgb, var(--create-accent) 34%, white);
  border-radius: 999px;
  color: color-mix(in srgb, var(--create-accent) 72%, #0d0c22);
  background: rgba(255, 255, 255, 0.74);
  font-size: 13px;
  font-weight: 900;
  box-shadow: inset 0 0 0 4px color-mix(in srgb, var(--create-accent) 8%, white);
}

.create-mode-star {
  position: absolute;
  z-index: 2;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  width: min(230px, 45%);
  min-height: 58px;
  border: 1px solid color-mix(in srgb, var(--create-accent) 22%, white);
  border-radius: 999px;
  padding: 10px 14px 10px 10px;
  color: var(--text);
  text-align: left;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.create-mode-star strong {
  display: block;
  color: var(--text);
  font-size: 16px;
  line-height: 1.18;
}

.create-mode-star p {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
}

.create-mode-star--1 {
  top: 10%;
  left: 42%;
}

.create-mode-star--2 {
  top: 30%;
  left: 4%;
}

.create-mode-star--3 {
  top: 38%;
  right: 4%;
}

.create-mode-star--4 {
  bottom: 12%;
  left: 16%;
}

.create-mode-star--5 {
  right: 12%;
  bottom: 10%;
}

.create-mode-orb {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(118px, 13vw, 160px);
  aspect-ratio: 1;
  border: 10px solid rgba(255, 255, 255, 0.88);
  border-radius: 999px;
  color: transparent;
  background: #101820;
  font-size: 18px;
  font-weight: 900;
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.16);
}

.create-mode-orb::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(circle, transparent 0 19%, rgba(255, 255, 255, 0.18) 20% 21%, transparent 22%),
    radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.24), transparent 16%),
    repeating-radial-gradient(circle, #111827 0 7px, #1f2937 8px 10px, #111827 11px 17px);
  animation: create-record-spin 6s linear infinite;
}

.create-mode-orb::after {
  content: '';
  position: absolute;
  inset: 50% auto auto 50%;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 36% 34%, rgba(255, 255, 255, 0.92) 0 12%, transparent 13%),
    var(--theme);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 6px rgba(234, 76, 137, 0.16);
}

.create-form-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.42fr) minmax(0, 0.58fr);
  gap: clamp(14px, 2vw, 22px);
  align-items: stretch;
}

.create-form-panel {
  position: relative;
  display: grid;
  gap: 16px;
  padding: clamp(18px, 2.4vw, 26px);
  border-radius: 28px 14px 28px 14px;
}

.create-form-panel::before {
  content: '';
  position: absolute;
  top: 18px;
  right: 18px;
  width: 42px;
  height: 6px;
  border-radius: 999px;
  background: rgba(234, 76, 137, 0.16);
}

.create-panel-heading {
  display: grid;
  gap: 6px;
}

.create-field {
  display: grid;
  gap: 8px;
  color: var(--text);
  font-weight: 760;
}

.create-field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.create-field-head em {
  font-style: normal;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 700;
}

.create-style-picker {
  gap: 14px;
}

.create-field input,
.create-field textarea {
  border-color: rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.94);
}

.create-field textarea {
  min-height: 152px;
  line-height: 1.65;
}

.create-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.create-tag-row button {
  min-height: 48px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  padding: 0 18px;
  color: var(--text);
  background: #ffffff;
  box-shadow: none;
}

.create-tag-row button:hover {
  transform: none;
  border-color: rgba(234, 76, 137, 0.22);
  color: var(--theme-dark);
  background: var(--theme-soft);
  box-shadow: none;
}

.create-tag-row button.is-active {
  border-color: rgba(234, 76, 137, 0.42);
  color: var(--theme-dark);
  background: linear-gradient(180deg, rgba(234, 76, 137, 0.15), rgba(234, 76, 137, 0.07));
  box-shadow: 0 12px 26px rgba(234, 76, 137, 0.12);
}

.create-upload-box {
  display: grid;
  gap: 10px;
  border: 1px dashed rgba(234, 76, 137, 0.28);
  border-radius: 20px;
  padding: 14px 16px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.76);
  cursor: pointer;
}

.create-upload-box input {
  padding: 0;
  border: 0;
  background: transparent;
}

.create-photo-preview {
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
}

.create-photo-preview img {
  display: block;
  width: 100%;
  max-height: 240px;
  object-fit: cover;
}

.create-result-panel {
  background:
    linear-gradient(#ffffff 31px, rgba(234, 76, 137, 0.08) 32px),
    rgba(255, 255, 255, 0.9);
  background-size: 100% 32px, auto;
  border-radius: 14px 34px 14px 34px;
}

.create-result-panel::before {
  background: rgba(56, 189, 248, 0.18);
}

.create-lyrics-field textarea {
  min-height: 300px;
  font-family: "Cascadia Mono", "SFMono-Regular", Consolas, monospace;
  line-height: 1.8;
}

.create-lyrics-empty {
  display: grid;
  place-items: center;
  min-height: 300px;
  border: 1px dashed rgba(234, 76, 137, 0.32);
  border-radius: 26px 12px 26px 12px;
  padding: 20px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.72);
  text-align: center;
}

.create-lyrics-empty.is-loading {
  border-color: rgba(56, 189, 248, 0.38);
  background: rgba(240, 249, 255, 0.72);
}

.create-form-error {
  margin: 0;
  border-radius: 12px;
  padding: 10px 12px;
  color: #b42318;
  background: #fff1f0;
  line-height: 1.5;
}

.create-form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.create-form-actions button:last-child {
  border-color: rgba(15, 23, 42, 0.1);
  color: var(--text);
  background: #ffffff;
}

@keyframes create-record-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes create-title-wave {
  0%,
  70%,
  100% {
    transform: translateY(0);
  }
  74% {
    transform: translateY(-0.22em) rotate(-1deg);
  }
  80% {
    transform: translateY(0.08em) rotate(0.6deg);
  }
  88% {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .create-mode-orb::before,
  .create-wave-title span {
    animation: none;
  }
}

@media (max-width: 1080px) {
  .create-mode-stage {
    grid-template-columns: 1fr;
  }

  .create-mode-orbit {
    min-height: 420px;
  }
}

@media (max-width: 900px) {
  .create-producer-card,
  .create-section-heading,
  .create-form-layout {
    grid-template-columns: 1fr;
  }

  .create-section-heading {
    display: grid;
  }
}

@media (max-width: 640px) {
  .create-page-hero,
  .create-producer-card,
  .create-mode-section,
  .create-form-panel {
    border-radius: 18px;
    padding: 16px;
  }

  .create-page-hero h1 {
    font-size: clamp(28px, 8vw, 36px);
  }

  .create-wave-title {
    column-gap: 0.015em;
    row-gap: 0;
  }

  .create-title-mobile-break {
    display: block !important;
    flex-basis: 100%;
    width: 100%;
    height: 0;
  }

  .create-producer-card {
    border-radius: 18px;
  }

  .create-mode-orb {
    width: 112px;
  }

  .create-turntable {
    min-height: 230px;
    border-radius: 28px 16px;
  }

  .create-mode-orbit {
    display: grid;
    gap: 10px;
    min-height: auto;
  }

  .create-mode-orbit::before,
  .create-mode-orbit::after,
  .create-orbit-core {
    display: none;
  }

  .create-mode-star {
    position: static;
    width: 100%;
    min-height: 58px;
  }

  .create-form-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .page-shell:has(.create-suite) {
    padding: 18px 16px 172px;
  }

  .create-suite {
    gap: 22px;
  }
}

`
