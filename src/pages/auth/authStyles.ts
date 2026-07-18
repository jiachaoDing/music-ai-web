export const authStyles = `
.auth-page {
  position: relative;
  display: grid;
  place-items: center;
  width: min(100%, 520px);
  min-height: 650px;
  padding: 18px;
}

.auth-page::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 30px;
  left: 50%;
  width: min(760px, 92vw);
  height: 360px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 50% 16%, rgba(234, 76, 137, 0.18), transparent 50%),
    linear-gradient(180deg, rgba(255, 240, 246, 0.7), rgba(255, 255, 255, 0));
  filter: blur(2px);
  transform: translateX(-50%);
  pointer-events: none;
}

.auth-card {
  display: grid;
  gap: 22px;
  width: 100%;
  border: 1px solid rgba(13, 12, 34, 0.08);
  border-radius: 8px;
  padding: 36px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 24px 70px rgba(13, 12, 34, 0.09);
  backdrop-filter: blur(18px);
}

.auth-title {
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
}

.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  font-size: 22px;
  font-weight: 850;
  letter-spacing: 0;
}

.auth-brand::before {
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--theme);
  box-shadow: 0 0 0 7px var(--theme-soft);
}

.auth-title h1 {
  margin: 8px 0 0;
  color: var(--ink);
  font-size: clamp(36px, 7vw, 54px);
  font-weight: 880;
  line-height: 1;
  letter-spacing: 0;
}

.auth-title p {
  margin: 0;
  max-width: 360px;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.7;
}

.auth-mode-switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  border-radius: 999px;
  padding: 5px;
  background: #f5f4f7;
}

.auth-mode-switch button {
  min-height: 44px;
  border: 0;
  border-radius: 999px;
  color: var(--muted);
  background: transparent;
  box-shadow: none;
  font-size: 15px;
  font-weight: 800;
}

.auth-mode-switch button:hover {
  color: var(--theme-dark);
  background: var(--theme-soft);
  box-shadow: none;
}

.auth-mode-switch button.is-active {
  color: var(--theme-dark);
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(13, 12, 34, 0.08);
}

.auth-form {
  display: grid;
  gap: 13px;
}

.auth-form input {
  width: 100%;
  min-height: 54px;
  border: 1px solid rgba(13, 12, 34, 0.08);
  border-radius: 8px;
  padding: 0 17px;
  color: var(--ink);
  background: #f7f7f9;
  font-size: 15px;
  caret-color: var(--theme);
  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
}

.auth-form input::placeholder {
  color: #8e8b98;
  opacity: 1;
}

.auth-form input:focus {
  border-color: var(--theme-line);
  outline: 0;
  background: #ffffff;
  box-shadow: 0 0 0 4px var(--theme-soft);
}

.password-row {
  position: relative;
  display: block;
}

.password-row input {
  padding-right: 56px;
}

.password-eye {
  position: absolute;
  top: 50%;
  right: 8px;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  min-height: 0;
  border: 0;
  border-radius: 999px;
  padding: 0;
  color: var(--muted);
  background: transparent;
  box-shadow: none;
  transform: translateY(-50%);
}

.password-eye:hover {
  transform: translateY(-50%);
  color: var(--theme-dark);
  background: var(--theme-soft);
  box-shadow: none;
}

.password-eye span {
  position: relative;
  display: block;
  width: 21px;
  height: 14px;
  border: 2px solid currentColor;
  border-radius: 999px 999px 8px 8px;
  transform: rotate(45deg);
}

.password-eye span::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
  transform: translate(-50%, -50%);
}

.password-eye span::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -4px;
  display: block;
  width: 29px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0;
  transform: translateY(-50%) rotate(90deg);
}

.password-eye.is-visible {
  color: var(--theme-dark);
}

.password-eye:not(.is-visible) span::after {
  opacity: 1;
}

.auth-submit {
  min-height: 54px;
  border: 0;
  border-radius: 999px;
  margin-top: 8px;
  color: #ffffff;
  background: var(--theme);
  box-shadow: 0 16px 34px var(--theme-shadow);
  font-size: 16px;
  font-weight: 850;
}

.auth-submit:hover {
  border-color: var(--theme-dark);
  background: var(--theme-dark);
  box-shadow: 0 18px 40px var(--theme-shadow);
}

.auth-submit:disabled {
  cursor: wait;
  opacity: 0.64;
  transform: none;
}

.auth-note {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
}

.auth-admin-link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--text);
  background: #fff;
  font-size: 14px;
  font-weight: 780;
  text-decoration: none;
}
.auth-admin-link:hover { border-color: var(--theme-line); color: var(--theme-dark); background: var(--theme-soft); }

@media (max-width: 640px) {
  .auth-page {
    width: 100%;
    min-height: auto;
    padding: 0;
  }

  .auth-card {
    gap: 20px;
    padding: 28px 18px 22px;
  }

  .auth-title h1 {
    font-size: 38px;
  }

  .auth-title p {
    font-size: 14px;
  }

  .auth-mode-switch button {
    min-height: 42px;
  }

  .password-eye {
    width: 36px;
    height: 36px;
  }
}
`
