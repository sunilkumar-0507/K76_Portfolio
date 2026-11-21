import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

interface AppState {
  /** True once the preloader has finished (or was skipped). */
  introDone: boolean
  setIntroDone: (v: boolean) => void
  /** Section currently in view on the home page (drives nav highlighting). */
  activeSection: string
  setActiveSection: (id: string) => void
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const [menuOpen, setMenuOpen] = useState(false)

  const value = useMemo(
    () => ({ introDone, setIntroDone, activeSection, setActiveSection, menuOpen, setMenuOpen }),
    [introDone, activeSection, menuOpen],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>')
  return ctx
}
