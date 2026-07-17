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

.immersive-player__bars {
  position: absolute;
  left: 0;
  width: 100%;
  height: 24vh;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(10px, 1fr);
  align-items: end;
  gap: 8px;
  padding: 0 28px;
  opacity: 0.96;
  pointer-events: none;
}

.immersive-player__bars--top {
  top: 0;
  transform: scaleY(-1);
}

.immersive-player__bars--bottom {
  bottom: 0;
}

.immersive-player__bar {
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.immersive-player__bar i {
  width: 100%;
  height: var(--bar-height);
  min-height: 14px;
  border-radius: 999px 999px 0 0;
  background: linear-gradient(180deg, rgba(255, 210, 230, 0.96), rgba(246, 141, 184, 0.7));
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 0 32px rgba(234, 76, 137, 0.14);
  transition: height 120ms linear;
}

.immersive-player__topbar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 0;
}

.immersive-player__ghost,
.immersive-player__brand {
  min-height: 44px;
  border-radius: 999px;
  padding: 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.88);
  box-shadow: none;
  backdrop-filter: blur(16px);
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
  align-content: start;
  gap: 10px;
  width: min(100%, 1040px);
  margin: 0 auto;
  padding: 0 32px 188px;
  text-align: center;
}

.immersive-player__cover {
  position: relative;
  width: clamp(132px, 12vw, 208px);
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 999px;
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.24), transparent 18%),
    linear-gradient(180deg, #f7a8c9, #ea4c89);
  box-shadow:
    0 26px 60px rgba(0, 0, 0, 0.34),
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 80px rgba(234, 76, 137, 0.16);
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
  font-size: 82px;
  font-weight: 800;
}

.immersive-player__title {
  display: grid;
  gap: 4px;
  color: #ffffff;
}

.immersive-player__title h1 {
  margin: 0;
  font-size: clamp(30px, 4vw, 52px);
  line-height: 0.98;
}

.immersive-player__title p {
  margin: 0;
  color: rgba(255, 255, 255, 0.64);
  font-size: clamp(14px, 1.2vw, 20px);
}

.immersive-player__lyrics {
  display: grid;
  gap: 6px;
  width: min(680px, 100%);
  max-height: 132px;
  overflow-y: auto;
  padding: 2px 16px;
  scrollbar-width: none;
}

.immersive-player__lyrics::-webkit-scrollbar {
  display: none;
}

.immersive-player__lyrics p {
  margin: 0;
  color: rgba(255, 255, 255, 0.42);
  font-size: clamp(16px, 1.45vw, 24px);
  line-height: 1.3;
  transition:
    color 180ms ease,
    transform 180ms ease,
    opacity 180ms ease;
}

.immersive-player__lyrics p.is-active {
  color: #ea4c89;
  transform: scale(1.02);
  opacity: 1;
  text-shadow: 0 0 24px rgba(234, 76, 137, 0.28);
}

.immersive-player__empty {
  color: rgba(255, 255, 255, 0.7) !important;
}

.immersive-player__dock {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  width: min(680px, calc(100% - 32px));
  display: grid;
  gap: 12px;
  padding: 14px 18px 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 28px 70px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(22px);
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
  gap: 20px;
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
  width: 44px;
  height: 44px;
  border-radius: 999px;
  font-size: 22px;
}

.immersive-player__control--play {
  width: 68px;
  height: 68px;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(180deg, #f369a6, #ea4c89);
  box-shadow:
    0 18px 36px rgba(234, 76, 137, 0.3),
    0 0 0 8px rgba(234, 76, 137, 0.12);
  font-size: 26px;
}

.immersive-player__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  font-weight: 700;
}

.immersive-player__meta span {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  border-radius: 999px;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

@media (max-width: 860px) {
  .immersive-player__bars {
    height: 24vh;
    gap: 5px;
    padding: 0 16px;
  }

  .immersive-player__content {
    padding: 10px 18px 188px;
  }

  .immersive-player__cover {
    width: clamp(116px, 34vw, 180px);
  }

  .immersive-player__lyrics {
    max-height: 112px;
    width: min(100%, 460px);
  }

  .immersive-player__lyrics p {
    font-size: 18px;
  }

  .immersive-player__dock {
    bottom: 18px;
    width: calc(100% - 20px);
    border-radius: 24px;
    padding: 14px 14px 12px;
  }

  .immersive-player__control--small {
    width: 42px;
    height: 42px;
  }

  .immersive-player__control--play {
    width: 62px;
    height: 62px;
  }
}
`
