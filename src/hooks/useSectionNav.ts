import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToTarget, useLenis } from './useLenis'

/** Navigate to a home-page section from anywhere in the app. */
export function useSectionNav() {
  const lenis = useLenis()
  const location = useLocation()
  const navigate = useNavigate()

  return useCallback(
    (section: string) => {
      if (location.pathname === '/') {
        if (section === 'top') scrollToTarget(lenis, 0)
        else scrollToTarget(lenis, `#${section}`, 0)
        window.history.replaceState(null, '', section === 'top' ? '/' : `/#${section}`)
        return
      }
      navigate(section === 'top' ? '/' : `/#${section}`)
    },
    [lenis, location.pathname, navigate],
  )
}
