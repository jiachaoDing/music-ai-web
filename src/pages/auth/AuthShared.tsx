import type { AuthMode } from './types'

type AuthModeSwitchProps = {
  mode: AuthMode
  onChange: (mode: AuthMode) => void
}

export function AuthTitle({ mode }: { mode: AuthMode }) {
  return (
    <div className="auth-title">
      <span className="auth-brand">Echo AI</span>
      <h1>{mode === 'login' ? '欢迎回来' : '创建账号'}</h1>
      <p>声音会传染，灵感会回响。登录后进入 AI 音乐社区。</p>
    </div>
  )
}

export function AuthModeSwitch({ mode, onChange }: AuthModeSwitchProps) {
  return (
    <div className="auth-mode-switch" role="tablist" aria-label="认证模式">
      <button
        type="button"
        className={mode === 'login' ? 'is-active' : ''}
        onClick={() => onChange('login')}
      >
        登录
      </button>
      <button
        type="button"
        className={mode === 'register' ? 'is-active' : ''}
        onClick={() => onChange('register')}
      >
        注册
      </button>
    </div>
  )
}

export function AuthNote() {
  return <p className="auth-note">新用户需邀请码加入 · 密码会加密存储</p>
}
