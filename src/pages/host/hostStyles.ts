export const hostStyles = `
.host-page {
  --host-theme: #ea4c89;
  --host-theme-strong: #d93678;
  --host-ink: #09091f;
  --host-muted: #6f6f82;
  --host-soft: #fff3f8;
  --host-line: #ececf2;
  max-width: 1180px;
  margin: 0 auto;
  padding: 38px 28px 128px;
  color: var(--host-ink);
}

.host-page button {
  font: inherit;
}

.host-hero {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--host-line);
  border-radius: 28px;
  background:
    radial-gradient(circle at 88% 20%, rgba(234, 76, 137, 0.14), transparent 28%),
    radial-gradient(circle at 8% 18%, rgba(234, 76, 137, 0.1), transparent 22%),
    linear-gradient(135deg, #ffffff 0%, #fff9fc 58%, #ffffff 100%);
  box-shadow: 0 24px 70px rgba(16, 16, 34, 0.08);
  padding: 30px;
}

.host-hero::after {
  content: "";
  position: absolute;
  right: -120px;
  bottom: -150px;
  width: 340px;
  height: 340px;
  border-radius: 999px;
  background: rgba(234, 76, 137, 0.07);
  pointer-events: none;
}

.host-hero__top {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.host-hero__top button,
.host-pick--empty button {
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  color: var(--host-ink);
  padding: 11px 18px;
  font-weight: 800;
  box-shadow: inset 0 0 0 1px var(--host-line), 0 12px 30px rgba(16, 16, 34, 0.06);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;
}

.host-hero__top button:hover,
.host-pick--empty button:hover {
  color: var(--host-theme);
  transform: translateY(-1px);
  box-shadow: inset 0 0 0 1px rgba(234, 76, 137, 0.28), 0 16px 38px rgba(234, 76, 137, 0.14);
}

.host-hero__top span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: var(--host-theme);
  color: #ffffff;
  padding: 10px 17px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
  box-shadow: 0 18px 40px rgba(234, 76, 137, 0.24);
}

.host-hero__main {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  align-items: center;
  gap: 26px;
  max-width: 820px;
}

.host-avatar {
  width: 118px;
  aspect-ratio: 1;
  border-radius: 30px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.5), transparent 23%),
    linear-gradient(145deg, #ff7fb6 0%, #ea4c89 52%, #c171ff 100%);
  color: #ffffff;
  font-size: 58px;
  font-weight: 900;
  line-height: 1;
  box-shadow: 0 22px 48px rgba(234, 76, 137, 0.22);
}

.host-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.host-avatar span {
  transform: translateY(-2px);
}

.host-identity > span,
.host-section__title span,
.host-pick > div > span {
  display: inline-flex;
  width: fit-content;
  border-radius: 999px;
  background: var(--host-soft);
  color: var(--host-theme);
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.host-identity h1 {
  margin: 12px 0 8px;
  font-size: clamp(44px, 5vw, 72px);
  line-height: 0.96;
  letter-spacing: 0;
}

.host-identity p {
  max-width: 600px;
  margin: 0;
  color: var(--host-muted);
  font-size: 18px;
  line-height: 1.6;
  font-weight: 650;
}

.host-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.host-stats strong {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  border-radius: 18px;
  background: #ffffff;
  padding: 11px 14px;
  box-shadow: inset 0 0 0 1px var(--host-line);
  font-size: 24px;
  min-width: 82px;
}

.host-stats small {
  color: var(--host-muted);
  font-size: 12px;
  font-weight: 850;
}

.host-pick {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(270px, 390px);
  gap: 22px;
  align-items: center;
  margin-top: 28px;
  padding: 22px;
  border: 1px solid var(--host-line);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 48px rgba(16, 16, 34, 0.07);
  backdrop-filter: blur(16px);
}

.host-pick h2 {
  margin: 12px 0 8px;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1.05;
  letter-spacing: 0;
}

.host-pick p {
  max-width: 620px;
  margin: 0;
  color: var(--host-muted);
  font-size: 17px;
  line-height: 1.7;
  font-weight: 650;
}

.host-pick--empty {
  grid-template-columns: minmax(0, 1fr) auto;
}

.host-section {
  margin-top: 34px;
}

.host-section__title {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 18px;
}

.host-section__title h2 {
  margin: 10px 0 0;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1;
}

.host-topic-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.host-topic {
  border: 1px solid var(--host-line);
  border-radius: 22px;
  background:
    linear-gradient(180deg, #ffffff 0%, #fffafd 100%);
  padding: 22px;
  box-shadow: 0 18px 44px rgba(16, 16, 34, 0.05);
}

.host-topic strong {
  display: block;
  color: var(--host-theme);
  font-size: 18px;
  margin-bottom: 8px;
}

.host-topic p {
  margin: 0;
  color: var(--host-muted);
  line-height: 1.65;
  font-weight: 650;
}

.host-song-list {
  display: grid;
  gap: 14px;
}

.host-song {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  border: 1px solid var(--host-line);
  border-radius: 22px;
  background: #ffffff;
  padding: 14px;
  color: var(--host-ink);
  text-align: left;
  cursor: pointer;
  box-shadow: 0 16px 40px rgba(16, 16, 34, 0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.host-song:hover {
  transform: translateY(-2px);
  border-color: rgba(234, 76, 137, 0.3);
  box-shadow: 0 22px 54px rgba(234, 76, 137, 0.12);
}

.host-song--featured {
  grid-template-columns: 86px minmax(0, 1fr) auto;
  min-height: 110px;
  box-shadow: none;
}

.host-song__cover {
  position: relative;
  width: 74px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 18px;
  background:
    radial-gradient(circle at 72% 22%, rgba(255, 255, 255, 0.35), transparent 22%),
    linear-gradient(135deg, #ffd7e7, #ea4c89);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}

.host-song--featured .host-song__cover {
  width: 86px;
  border-radius: 20px;
}

.host-song__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.host-song__cover i {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #ffffff;
  font-style: normal;
  font-size: 18px;
  font-weight: 900;
  background: rgba(9, 9, 31, 0.16);
}

.host-song__cover b {
  position: absolute;
  right: 7px;
  bottom: 7px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--host-theme);
  color: #ffffff;
  box-shadow: 0 10px 22px rgba(234, 76, 137, 0.25);
}

.host-song__body {
  min-width: 0;
}

.host-song__body strong {
  display: block;
  font-size: clamp(19px, 2vw, 28px);
  line-height: 1.15;
  margin-bottom: 6px;
}

.host-song__body small {
  color: var(--host-muted);
  font-weight: 750;
}

.host-song__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
}

.host-song__tags em {
  border-radius: 999px;
  background: #f6f6f9;
  color: var(--host-muted);
  padding: 5px 9px;
  font-style: normal;
  font-size: 12px;
  font-weight: 800;
}

.host-song > span {
  color: var(--host-theme);
  font-weight: 900;
}

@media (max-width: 860px) {
  .host-page {
    padding: 18px 14px 108px;
  }

  .host-hero {
    border-radius: 24px;
    padding: 22px;
  }

  .host-hero__top {
    margin-bottom: 24px;
  }

  .host-hero__main {
    grid-template-columns: 1fr;
    text-align: center;
    justify-items: center;
    gap: 18px;
  }

  .host-avatar {
    width: 104px;
    border-radius: 26px;
    font-size: 50px;
  }

  .host-identity p {
    font-size: 16px;
  }

  .host-stats {
    justify-content: center;
  }

  .host-pick,
  .host-pick--empty {
    grid-template-columns: 1fr;
  }

  .host-topic-grid {
    grid-template-columns: 1fr;
  }

  .host-section__title {
    align-items: flex-start;
    flex-direction: column;
  }

  .host-song,
  .host-song--featured {
    grid-template-columns: 68px 1fr;
  }

  .host-song > span {
    grid-column: 2;
  }

  .host-song__cover,
  .host-song--featured .host-song__cover {
    width: 68px;
    border-radius: 16px;
  }
}
`
