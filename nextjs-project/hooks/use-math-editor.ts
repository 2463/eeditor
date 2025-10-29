"use client"

import { useState, useCallback } from "react"

interface UseMathEditorReturn {
  equations: string[]
  activeIndex: number | null
  cursorPosition: number
  addEquation: () => void
  updateEquation: (index: number, newValue: string) => void
  activateEquation: (index: number) => void
  deactivateEquation: () => void
  moveCursor: (position: number) => void
  insertAtCursor: (text: string) => void
  deleteAtCursor: (count: number) => void
}

export const useMathEditor = (): UseMathEditorReturn => {
  const [equations, setEquations] = useState<string[]>([""])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [cursorPosition, setCursorPosition] = useState<number>(0)

  const addEquation = useCallback(() => {
    setEquations((prev) => [...prev, ""])
  }, [])

  const updateEquation = useCallback((index: number, newValue: string) => {
    setEquations((prev) => {
      const newEquations = [...prev]
      newEquations[index] = newValue
      return newEquations
    })
  }, [])

  const activateEquation = useCallback(
    (index: number) => {
      setActiveIndex(index)
      setCursorPosition(equations[index]?.length || 0)
    },
    [equations],
  )

  const deactivateEquation = useCallback(() => {
    setActiveIndex(null)
  }, [])

  const moveCursor = useCallback((position: number) => {
    setCursorPosition(position)
  }, [])

  const insertAtCursor = useCallback(
    (text: string) => {
      if (activeIndex === null) return

      const equation = equations[activeIndex]
      const newEquation = equation.substring(0, cursorPosition) + text + equation.substring(cursorPosition)

      updateEquation(activeIndex, newEquation)
      setCursorPosition(cursorPosition + text.length)
    },
    [activeIndex, cursorPosition, equations, updateEquation],
  )

  const deleteAtCursor = useCallback(
    (count: number) => {
      if (activeIndex === null || cursorPosition < count) return

      const equation = equations[activeIndex]
      const newEquation = equation.substring(0, cursorPosition - count) + equation.substring(cursorPosition)

      updateEquation(activeIndex, newEquation)
      setCursorPosition(cursorPosition - count)
    },
    [activeIndex, cursorPosition, equations, updateEquation],
  )

  return {
    equations,
    activeIndex,
    cursorPosition,
    addEquation,
    updateEquation,
    activateEquation,
    deactivateEquation,
    moveCursor,
    insertAtCursor,
    deleteAtCursor,
  }
}
