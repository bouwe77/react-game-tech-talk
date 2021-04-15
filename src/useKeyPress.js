import { useEffect } from 'react'

export function useKeyPress(
  targetKey,
  onKeyDownCallback = null,
  onKeyUpCallback = null,
) {
  useEffect(() => {
    const onKeyDown = ({ key }) => {
      if (onKeyDownCallback && key === targetKey) onKeyDownCallback()
    }

    const onKeyUp = ({ key }) => {
      if (onKeyUpCallback && key === targetKey) onKeyUpCallback()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [targetKey, onKeyDownCallback, onKeyUpCallback])
}
