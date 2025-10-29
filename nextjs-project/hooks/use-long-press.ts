"use client"

import { useRef, type MutableRefObject } from "react"

interface LongPressSet {
  onMouseDown: () => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onTouchStart: () => void
  onTouchEnd: () => void
}

export const useLongPress = (callback: () => void, ms: number): LongPressSet => {
  const timeout: MutableRefObject<NodeJS.Timeout | undefined> = useRef()

  const start = () => {
    timeout.current = setTimeout(callback, ms)
  }

  const stop = () => {
    timeout.current && clearTimeout(timeout.current)
    timeout.current = undefined
  }

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  }
}
