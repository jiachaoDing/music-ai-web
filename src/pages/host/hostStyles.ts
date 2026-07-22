export const hostStyles = `
.host-page {
  --host-theme: #ea4c89;
  --host-theme-strong: #d93678;
  --host-ink: #09091f;
  --host-muted: #68687c;
  --host-soft: #fff3f8;
  --host-line: #ececf2;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 30px 0 128px;
  color: var(--host-ink);
}

.host-page button {
  font: inherit;
}

.host-page button:hover {
  background: #ffffff;
  color: var(--host-ink);
}

.host-hero,
.host-daily-card,
.host-topic,
.host-song {
  border: 1px solid var(--host-line);
  border-radius: 8px;
  background: #ffffff;
}

.host-hero {
  position: relative;
  overflow: hidden;
  padding: 26px;
  background:
    radial-gradient(circle at 86% 12%, rgba(234, 76, 137, 0.13), transparent 28%),
    radial-gradient(circle at 8% 18%, rgba(75, 181, 206, 0.11), transparent 20%),
    linear-gradient(135deg, #ffffff 0%, #fff9fc 58%, #ffffff 100%);
  box-shadow: 0 20px 54px rgba(16, 16, 34, 0.07);
}

.host-hero__top {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.host-hero__top button,
.host-empty-inline button {
  min-height: 40px;
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  color: var(--host-ink);
  padding: 0 16px;
  font-weight: 800;
  box-shadow: inset 0 0 0 1px var(--host-line), 0 10px 24px rgba(16, 16, 34, 0.06);
  cursor: pointer;
}

.host-hero__top button:hover,
.host-empty-inline button:hover {
  background: #ffffff;
  color: var(--host-theme);
  transform: translateY(-1px);
}

.host-hero__top span,
.host-identity > span,
.host-section__title span {
  display: inline-flex;
  width: fit-content;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.host-hero__top span {
  align-items: center;
  background: var(--host-theme);
  color: #ffffff;
  padding: 10px 16px;
  box-shadow: 0 14px 30px rgba(234, 76, 137, 0.2);
}

.host-identity > span,
.host-section__title span {
  background: var(--host-soft);
  color: var(--host-theme);
  padding: 7px 12px;
}

.host-hero__main {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: center;
  gap: 22px;
  max-width: 820px;
}

.host-avatar {
  display: grid;
  place-items: center;
  width: 96px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  background:
    radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.48), transparent 24%),
    linear-gradient(145deg, #ff7fb6 0%, #ea4c89 52%, #2fb6cc 100%);
  color: #ffffff;
  box-shadow: 0 18px 38px rgba(234, 76, 137, 0.18);
}

.host-avatar span {
  font-size: 19px;
  font-weight: 950;
  letter-spacing: 0;
}

.host-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.host-identity h1 {
  margin: 10px 0 8px;
  font-size: clamp(38px, 5vw, 64px);
  line-height: 1;
  letter-spacing: 0;
}

.host-identity p,
.host-daily-card p,
.host-topic p {
  margin: 0;
  color: var(--host-muted);
  line-height: 1.62;
  font-weight: 650;
}

.host-identity p {
  max-width: 660px;
  font-size: 16px;
}

.host-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.host-stats strong {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  min-width: 78px;
  border-radius: 8px;
  background: #ffffff;
  padding: 10px 12px;
  box-shadow: inset 0 0 0 1px var(--host-line);
  font-size: 22px;
}

.host-stats small {
  color: var(--host-muted);
  font-size: 12px;
  font-weight: 850;
}

.host-daily-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.host-daily-card {
  display: grid;
  align-content: start;
  gap: 14px;
  min-width: 0;
  padding: 20px;
  box-shadow: 0 16px 40px rgba(16, 16, 34, 0.055);
}

.host-daily-card--pick {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 247, 250, 0.98));
}

.host-section {
  margin-top: 30px;
}

.host-section__title {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 14px;
}

.host-section__title h2 {
  margin: 8px 0 0;
  font-size: clamp(26px, 3.5vw, 40px);
  line-height: 1.05;
}

.host-topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 14px;
}

.host-topic {
  min-height: 132px;
  padding: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  box-shadow: 0 14px 34px rgba(16, 16, 34, 0.045);
}

.host-topic strong {
  display: block;
  color: var(--host-theme);
  font-size: 18px;
  margin-bottom: 8px;
}

.host-song-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 12px;
}

.host-song {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  min-width: 0;
  padding: 14px;
  color: var(--host-ink);
  text-align: left;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(16, 16, 34, 0.045);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.host-song--compact {
  grid-template-columns: 72px minmax(0, 1fr);
}

.host-song:hover {
  transform: translateY(-2px);
  border-color: rgba(234, 76, 137, 0.3);
  color: var(--host-ink);
  background:
    linear-gradient(180deg, #ffffff 0%, #fffafd 100%);
  box-shadow: 0 18px 42px rgba(234, 76, 137, 0.1);
}

.host-song:focus-visible,
.host-hero__top button:focus-visible,
.host-empty-inline button:focus-visible {
  outline: 3px solid rgba(234, 76, 137, 0.18);
  outline-offset: 3px;
}

.host-song__cover {
  position: relative;
  width: 82px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  background:
    radial-gradient(circle at 72% 22%, rgba(255, 255, 255, 0.35), transparent 22%),
    linear-gradient(135deg, #ffd7e7, #ea4c89);
}

.host-song--compact .host-song__cover {
  width: 72px;
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
  right: 6px;
  bottom: 6px;
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

.host-song__body > em {
  display: inline-flex;
  max-width: 100%;
  margin-bottom: 6px;
  border-radius: 999px;
  background: rgba(234, 76, 137, 0.09);
  color: var(--host-theme);
  padding: 5px 9px;
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.host-song:hover .host-song__body > em {
  background: rgba(234, 76, 137, 0.11);
  color: var(--host-theme);
}

.host-song__body strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: clamp(20px, 2vw, 26px);
  line-height: 1.15;
  margin-bottom: 5px;
}

.host-song__body small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--host-muted);
  font-weight: 750;
}

.host-song__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 9px;
}

.host-song__tags i {
  max-width: min(100%, 420px);
  border-radius: 999px;
  background: #f6f6f9;
  color: var(--host-muted);
  padding: 5px 9px;
  font-style: normal;
  font-size: 12px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.host-song:hover .host-song__tags i {
  background: #f6f6f9;
  color: var(--host-muted);
}

.host-empty-inline {
  display: grid;
  gap: 10px;
  min-height: 142px;
  align-content: center;
  border: 1px dashed rgba(234, 76, 137, 0.24);
  border-radius: 8px;
  padding: 16px;
  background: rgba(234, 76, 137, 0.05);
}

.host-empty-inline strong {
  font-size: 18px;
}

.host-empty-inline button {
  width: fit-content;
}

@media (max-width: 920px) {
  .host-page {
    width: min(100% - 32px, 760px);
  }

  .host-daily-grid {
    grid-template-columns: 1fr;
  }

  .host-song-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .host-page {
    width: calc(100% - 24px);
    padding: 18px 0 108px;
  }

  .host-hero,
  .host-daily-card {
    padding: 16px;
  }

  .host-hero__top {
    margin-bottom: 18px;
  }

  .host-hero__top button,
  .host-hero__top span {
    min-height: 36px;
    padding: 0 12px;
    font-size: 12px;
  }

  .host-hero__main {
    grid-template-columns: 64px minmax(0, 1fr);
    align-items: start;
    gap: 14px;
  }

  .host-avatar {
    width: 64px;
  }

  .host-avatar span {
    font-size: 14px;
  }

  .host-identity h1 {
    font-size: clamp(30px, 12vw, 42px);
  }

  .host-identity p,
  .host-daily-card p,
  .host-topic p {
    font-size: 14px;
  }

  .host-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .host-stats strong {
    display: grid;
    justify-items: start;
    gap: 4px;
    min-width: 0;
    padding: 9px;
    font-size: 20px;
  }

  .host-section {
    margin-top: 24px;
  }

  .host-section__title {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .host-section__title h2 {
    font-size: clamp(24px, 9vw, 34px);
  }

  .host-topic-grid {
    grid-template-columns: 1fr;
  }

  .host-song,
  .host-song--compact {
    grid-template-columns: 60px minmax(0, 1fr);
    gap: 12px;
    padding: 12px;
  }

  .host-song__cover,
  .host-song--compact .host-song__cover {
    width: 60px;
  }

  .host-song__cover b {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }

  .host-song__body strong {
    font-size: 20px;
  }

  .host-song__tags i {
    max-width: 210px;
  }
}

@media (max-width: 640px) {
  .host-page {
    width: calc(100% - 20px);
    padding-top: 12px;
  }

  .host-hero,
  .host-daily-card {
    border-radius: 14px;
    padding: 14px;
  }

  .host-identity h1 {
    font-size: clamp(25px, 8vw, 31px);
  }

  .host-stats strong {
    padding: 8px;
    font-size: 17px;
  }

  .host-section__title h2 {
    font-size: 24px;
  }

  .host-song,
  .host-song--compact {
    grid-template-columns: 52px minmax(0, 1fr);
    padding: 10px;
  }

  .host-song__cover,
  .host-song--compact .host-song__cover {
    width: 52px;
  }

  .host-song__cover b {
    inset: 50% auto auto 50%;
    right: auto;
    bottom: auto;
    transform: translate(-50%, -50%);
    line-height: 1;
  }

  .host-song__body strong {
    font-size: 16px;
  }

  .host-page {
    gap: 16px;
  }

  .host-hero {
    overflow: visible;
    border: 0;
    padding: 4px 2px 12px;
    background: transparent;
    box-shadow: none;
  }

  .host-hero__top {
    margin-bottom: 12px;
  }

  .host-hero__top span {
    color: #b33e72;
    background: rgba(234, 76, 137, .08);
    box-shadow: none;
  }

  .host-hero__main {
    grid-template-columns: 78px minmax(0, 1fr);
    gap: 13px;
  }

  .host-avatar {
    width: 78px;
    border-radius: 26px 26px 8px 26px;
    box-shadow: 0 16px 34px rgba(71, 44, 89, .17);
  }

  .host-identity > span {
    padding: 4px 7px;
    font-size: 9px;
  }

  .host-identity h1 {
    margin: 6px 0 5px;
  }

  .host-identity p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 11px;
    line-height: 1.45;
  }

  .host-stats {
    grid-column: 1 / -1;
    display: flex;
    margin-top: 10px;
    border-top: 1px solid rgba(9, 9, 31, .08);
    border-bottom: 1px solid rgba(9, 9, 31, .08);
  }

  .host-stats strong {
    flex: 1 1 0;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    padding: 8px 2px;
    background: transparent;
    box-shadow: none;
  }

  .host-stats strong + strong {
    border-left: 1px solid rgba(9, 9, 31, .08);
  }

  .host-daily-grid {
    gap: 10px;
    margin-top: 2px;
  }

  .host-daily-card {
    border: 0;
    border-radius: 0;
    padding: 15px 2px;
    background: transparent;
    box-shadow: none;
  }

  .host-daily-card:first-child {
    border-top: 2px solid rgba(234, 76, 137, .58);
    background: linear-gradient(100deg, rgba(234,76,137,.055), transparent 68%);
  }

  .host-daily-card--pick {
    border-top: 1px solid rgba(9, 9, 31, .09);
    border-bottom: 1px solid rgba(9, 9, 31, .09);
    border-left: 3px solid rgba(88, 198, 218, .54);
    padding-left: 12px;
  }

  .host-daily-card--pick > p {
    display: none;
  }

  .host-section {
    margin-top: 10px;
    border-top: 1px solid rgba(9, 9, 31, .1);
    padding-top: 15px;
  }

  .host-section__title {
    margin-bottom: 9px;
  }

  .host-topic-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 0;
    overflow: visible;
    padding: 0;
  }

  .host-topic {
    min-height: 94px;
    border: 0;
    border-left: 3px solid rgba(139, 101, 207, .62);
    border-radius: 0 14px 14px 0;
    padding: 12px;
    background: linear-gradient(110deg, rgba(139,101,207,.075), rgba(88,198,218,.045));
    box-shadow: none;
  }

  .host-topic:nth-child(even) {
    border-right: 3px solid rgba(88, 198, 218, .58);
    border-left: 0;
    border-radius: 14px 0 0 14px;
    text-align: right;
    background: linear-gradient(250deg, rgba(88,198,218,.075), rgba(139,101,207,.04));
  }

  .host-song-list {
    gap: 8px;
  }

  .host-song,
  .host-song--compact {
    border: 1px solid rgba(68, 54, 92, .1);
    border-left: 3px solid rgba(234, 76, 137, .48);
    border-radius: 13px;
    padding: 9px;
    background: rgba(255, 255, 255, .7);
    box-shadow: none;
  }

  .host-song:nth-child(even) {
    border-left-color: rgba(74, 183, 211, .52);
  }

  .host-section__title span,
  .host-song__body > em {
    font-size: 8px;
    letter-spacing: .12em;
  }

  .host-section__title h2 {
    font-size: 25px;
    line-height: 1.12;
  }

  .host-daily-card > p,
  .host-topic p,
  .host-song__body small {
    font-size: 10px;
    line-height: 1.4;
  }

  .host-topic strong {
    font-size: 16px;
  }

  .host-song__body strong {
    font-size: 16px;
    line-height: 1.25;
  }

  .host-song__tags i {
    font-size: 9px;
  }
}
`
