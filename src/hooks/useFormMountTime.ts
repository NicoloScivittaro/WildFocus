import { useRef } from 'react'

export function useFormMountTime(): number {
  const mountTimeRef = useRef(Date.now())
  return mountTimeRef.current
}
