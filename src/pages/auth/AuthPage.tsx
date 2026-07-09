import { useState } from 'react'
import { AuthModeSwitch, AuthNote, AuthTitle } from './AuthShared'
import { authStyles } from './authStyles'
import { LoginPage } from './components/LoginPage'
import { RegisterPage } from './components/RegisterPage'
import type { AuthMode, AuthValues } from './types'

type AuthPageProps = {
  onAuthenticate: (mode: AuthMode, values: AuthValues) => Promise<void> | void
  loading?: boolean
}

export function AuthPage({ onAuthenticate, loading = false }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login')

  async function handleSubmit(values: AuthValues) {
    await onAuthenticate(mode, values)
  }

  return (
    <section className="auth-page">
      <style>{authStyles}</style>

      <div className="auth-card">
        <AuthTitle mode={mode} />
        <AuthModeSwitch mode={mode} onChange={setMode} />
        {mode === 'login' ? (
          <LoginPage onSubmit={handleSubmit} loading={loading} />
        ) : (
          <RegisterPage onSubmit={handleSubmit} loading={loading} />
        )}
        <AuthNote />
      </div>
    </section>
  )
}
