import { useState } from 'react'
import type { FormEvent } from 'react'
import type { RegisterFormValues } from '../types'

type RegisterPageProps = {
  onSubmit: (values: RegisterFormValues) => Promise<void> | void
  loading?: boolean
}

export function RegisterPage({ onSubmit, loading = false }: RegisterPageProps) {
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit({ nickname, password, inviteCode })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        value={nickname}
        onChange={(event) => setNickname(event.target.value)}
        placeholder="昵称"
      />
      <div className="password-row">
        <input
          value={password}
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
      <input
        value={inviteCode}
        onChange={(event) => setInviteCode(event.target.value)}
        placeholder="邀请码（注册必填）"
      />
      <button className="auth-submit" type="submit" disabled={loading}>
        {loading ? '注册中...' : '注册并进入'}
      </button>
    </form>
  )
}
