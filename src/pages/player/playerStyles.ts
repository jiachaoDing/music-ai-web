export const playerStyles = `
.immersive-player {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 24%, rgba(234, 76, 137, 0.2), transparent 18%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03), transparent 26%),
    linear-gradient(180deg, #0f0d18 0%, #090811 100%);
}

.immersive-player__backdrop {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(11, 10, 20, 0.08) 0%, rgba(11, 10, 20, 0.5) 28%, rgba(11, 10, 20, 0.78) 52%, rgba(11, 10, 20, 0.42) 72%, rgba(11, 10, 20, 0.16) 100%);
  pointer-events: none;
}

.immersive-player__visualizer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.98;
  pointer-events: none;
}

.immersive-player__topbar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.immersive-player__ghost,
.immersive-player__brand {
  min-height: 38px;
  border-radius: 999px;
  padding: 0 15px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.88);
  box-shadow: none;
  backdrop-filter: blur(16px);
  font-size: 14px;
}

.immersive-player__brand {
  font-weight: 800;
}

.immersive-player__ghost:hover,
.immersive-player__brand:hover {
  background: rgba(255, 255, 255, 0.11);
  border-color: rgba(255, 255, 255, 0.14);
}

.immersive-player__content {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 68px);
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 8px;
  width: min(100%, 920px);
  margin: 0 auto;
  padding: 0 24px 200px;
  text-align: center;
}

.immersive-player__cover {
  position: relative;
  width: clamp(96px, 8.6vw, 146px);
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 999px;
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.24), transparent 18%),
    linear-gradient(180deg, #f7a8c9, #ea4c89);
  box-shadow:
    0 22px 52px rgba(0, 0, 0, 0.34),
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 72px rgba(234, 76, 137, 0.16);
}

.immersive-player__cover::after {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.immersive-player__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.immersive-player__cover-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: #ffffff;
  font-size: 64px;
  font-weight: 800;
}

.immersive-player__title {
  display: grid;
  gap: 4px;
  color: #ffffff;
}

.immersive-player__title h1 {
  margin: 0;
  font-size: clamp(24px, 2.8vw, 38px);
  line-height: 0.98;
}

.immersive-player__title p {
  margin: 0;
  color: rgba(255, 255, 255, 0.64);
  font-size: clamp(13px, 1.05vw, 17px);
}

.immersive-player__lyrics {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 5px;
  width: min(660px, 100%);
  min-height: 210px;
  max-height: 250px;
  overflow-y: auto;
  padding: 12px 16px;
  scrollbar-width: none;
  mask-image: linear-gradient(transparent, #000 10%, #000 86%, transparent);
}

.immersive-player__lyrics::-webkit-scrollbar {
  display: none;
}

.immersive-player__lyrics p {
  margin: 0;
  color: rgba(255, 255, 255, 0.54);
  font-size: clamp(14px, 1vw, 16px);
  line-height: 1.38;
}

.immersive-player__empty {
  color: rgba(255, 255, 255, 0.7) !important;
}

.immersive-player__dock {
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  width: min(520px, calc(100% - 28px));
  display: grid;
  gap: 9px;
  padding: 10px 14px 9px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
}

.immersive-player__timeline {
  display: grid;
  gap: 8px;
}

.immersive-player__time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.68);
  font-size: 14px;
}

.immersive-player__progress {
  position: relative;
  height: 8px;
  border: 0;
  border-radius: 999px;
  padding: 0;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.14);
  box-shadow: none;
}

.immersive-player__progress:hover {
  background: rgba(255, 255, 255, 0.18);
}

.immersive-player__progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ea4c89, #f78eb8);
  box-shadow: 0 0 18px rgba(234, 76, 137, 0.34);
}

.immersive-player__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.immersive-player__control {
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: none;
}

.immersive-player__control:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.14);
}

.immersive-player__control--small {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  font-size: 16px;
}

.immersive-player__control--play {
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(180deg, #f369a6, #ea4c89);
  box-shadow:
    0 18px 36px rgba(234, 76, 137, 0.3),
    0 0 0 8px rgba(234, 76, 137, 0.12);
  font-size: 19px;
}

.immersive-player__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  font-weight: 700;
}

.immersive-player__meta span {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  border-radius: 999px;
  padding: 0 9px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

@media (max-width: 860px) {
  .immersive-player__topbar {
    padding: 16px 14px 0;
  }

  .immersive-player__ghost,
  .immersive-player__brand {
    min-height: 34px;
    padding: 0 12px;
    font-size: 13px;
  }

  .immersive-player__content {
    min-height: calc(100vh - 60px);
    padding: 6px 16px 168px;
    gap: 7px;
  }

  .immersive-player__cover {
    width: clamp(84px, 24vw, 120px);
  }

  .immersive-player__title h1 {
    font-size: clamp(22px, 8vw, 32px);
  }

  .immersive-player__title p {
    font-size: 13px;
  }

  .immersive-player__lyrics {
    min-height: 170px;
    max-height: 200px;
    width: min(100%, 430px);
    padding: 10px 12px;
  }

  .immersive-player__lyrics p {
    font-size: 14px;
    line-height: 1.34;
  }

  .immersive-player__dock {
    bottom: 10px;
    width: calc(100% - 20px);
    border-radius: 22px;
    padding: 9px 11px 9px;
  }

  .immersive-player__controls {
    gap: 12px;
  }

  .immersive-player__control--small {
    width: 31px;
    height: 31px;
    font-size: 15px;
  }

  .immersive-player__control--play {
    width: 48px;
    height: 48px;
  }
}
`
