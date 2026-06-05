/**
 * LoginPage — schermata di accesso / registrazione.
 *
 * Due tab: "Accedi" (login) e "Registrati" (nuova utenza customer).
 * Design fedele al wireframe customer.html#s00.
 *
 * Credenziali demo pre-caricate dal seed:
 *   customer@test.com  |  operator@test.com  |  admin@test.com
 *   (qualsiasi password — il backend non la verifica in questa demo)
 */

import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Bike } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/auth/AuthContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

// ── Tipi interni ──────────────────────────────────────────────────────────────

type ActiveTab = 'login' | 'register'

// ── Componente ────────────────────────────────────────────────────────────────

export function LoginPage() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()

  // Se già loggato, torna alla home
  if (user) return <Navigate to="/" replace />

  const [activeTab, setActiveTab] = useState<ActiveTab>('login')
  const [loading, setLoading] = useState(false)

  // Campi login
  const [loginEmail,    setLoginEmail]    = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Campi registrazione
  const [regName,     setRegName]     = useState('')
  const [regEmail,    setRegEmail]    = useState('')
  const [regPassword, setRegPassword] = useState('')

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(loginEmail, loginPassword)
      navigate('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Errore di accesso')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (regPassword.length < 6) {
      toast.error('La password deve essere di almeno 6 caratteri')
      return
    }
    setLoading(true)
    try {
      await register(regEmail, regPassword, regName)
      navigate('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Errore di registrazione')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Logo + nome app */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
            <Bike className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">nu miezz a piacer</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Mobilità condivisa</p>
          </div>
        </div>

        {/* Card principale */}
        <div 
          className="flex flex-col gap-6 rounded-xl border bg-card text-card-foreground shadow-md"
          style={{ padding: '24px', borderColor: 'var(--border)' }}
        >
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as ActiveTab)}
            >
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="login">Accedi</TabsTrigger>
                <TabsTrigger value="register">Registrati</TabsTrigger>
              </TabsList>

              {/* ── Tab Accedi ─────────────────────────────────────────── */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="email@esempio.it"
                      autoComplete="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full mt-1" disabled={loading}>
                    {loading ? 'Accesso in corso…' : 'Accedi'}
                  </Button>

                  {/* Placeholder — funzionalità non implementata in questa demo */}
                  <p className="text-center text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    Password dimenticata?
                  </p>
                </form>
              </TabsContent>

              {/* ── Tab Registrati ─────────────────────────────────────── */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-name">Nome completo</Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="Mario Rossi"
                      autoComplete="name"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="email@esempio.it"
                      autoComplete="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••  (min. 6 caratteri)"
                      autoComplete="new-password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full mt-1" disabled={loading}>
                    {loading ? 'Creazione account…' : 'Crea account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
        </div>

        {/* Hint credenziali demo — visibile solo in sviluppo */}
        {import.meta.env.DEV && (
          <p className="text-center text-xs text-muted-foreground/70">
            Demo — prova con{' '}
            <button
              type="button"
              className="underline hover:text-foreground transition-colors"
              onClick={() => {
                setLoginEmail('customer@test.com')
                setLoginPassword('demo')
                setActiveTab('login')
              }}
            >
              customer@test.com
            </button>
            {' '}· qualsiasi password
          </p>
        )}

      </div>
    </div>
  )
}
