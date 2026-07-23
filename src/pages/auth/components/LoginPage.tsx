import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LoginFormValues } from '../types'

type LoginPageProps = {
  onSubmit: (values: LoginFormValues) => Promise<void> | void
  loading?: boolean
}

export function LoginPage({ onSubmit, loading = false }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit({ identifier, password })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        value={identifier}
        required
        autoComplete="username"
        onChange={(event) => setIdentifier(event.target.value)}
        placeholder="昵称"
      />
      <div className="password-row">
        <input
          value={password}
          required
          minLength={4}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="密码（至少 4 位）"
          type={showPassword ? 'text' : 'password'}
        />
        <button
          type="button"
          className={`password-eye ${showPassword ? 'is-visible' : ''}`}
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? '隐藏密码' : '显示密码'}
          title={showPassword ? '隐藏密码' : '显示密码'}
        >
          <span aria-hidden="true" />
        </button>
      </div>
      <button className="auth-submit" type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  )
}
