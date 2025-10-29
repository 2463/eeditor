"use client"

import { useEffect, useState, useCallback } from "react"
import { saveAs } from "@/lib/file-saver"
import MathBlock from "@/components/math-block"
import CustomKeyboard from "@/components/custom-keyboard"
import KeyAdditionMenu from "@/components/key-addition-menu"
import { loadCustomKeys, saveCustomKeys } from "@/lib/cookie-utils"

interface HistoryEntry {
  equations: string[]
  activeIndex: number | null
  cursorPosition: number
  textLength: number // Track text length for cursor positioning
}

export default function MathEditor() {
  const [equations, setEquations] = useState<string[]>(["E=mc^2"])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [showKeyAddMenu, setShowKeyAddMenu] = useState<boolean>(false)
  const [customKeys, setCustomKeys] = useState<string[]>(["\\frac{}{}", "\\mathrm{}", "\\sqrt{}", "\\sum_{}^{}", "\\int_{}^{}"])
  const [useNativeKeyboard, setUseNativeKeyboard] = useState<boolean>(false)

  // Load custom keys from cookies on initial render
  useEffect(() => {
    const savedKeys = loadCustomKeys()
    if (savedKeys) {
      setCustomKeys(savedKeys)
    }
    // Initialize history with current state
    if (historyIndex === -1) {
      setHistory([
        {
          equations,
          activeIndex,
          cursorPosition,
          textLength: activeIndex !== null ? equations[activeIndex].length : 0,
        },
      ])
      setHistoryIndex(0)
    }
  }, [])

  // Add a new equation block
  const addEquationBlock = () => {
    setEquations([...equations, ""])
  }

  // Update equation at specific index
  const updateEquation = (index: number, newValue: string) => {
    const newEquations = [...equations]
    const oldValue = newEquations[index]
    newEquations[index] = newValue
    setEquations(newEquations)

    // Add to history
    const newHistoryEntry = {
      equations: newEquations,
      activeIndex,
      cursorPosition,
      textLength: newValue.length,
    }

    // If we're not at the end of history, truncate it
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1).concat(newHistoryEntry))
    } else {
      setHistory([...history, newHistoryEntry])
    }
    setHistoryIndex(historyIndex + 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const prevState = history[newIndex]
      const currentState = history[historyIndex]

      setEquations(prevState.equations)
      setActiveIndex(prevState.activeIndex)

      // Adjust cursor position based on text length difference
      if (prevState.activeIndex !== null && currentState.activeIndex === prevState.activeIndex) {
        const currentText = currentState.activeIndex !== null ? currentState.equations[currentState.activeIndex] : ""
        const prevText = prevState.activeIndex !== null ? prevState.equations[prevState.activeIndex] : ""

        // Calculate new cursor position based on text length difference
        const lengthDiff = currentText.length - prevText.length
        const newCursorPos = Math.max(0, Math.min(cursorPosition - lengthDiff, prevText.length))

        setCursorPosition(newCursorPos)
      } else {
        setCursorPosition(prevState.cursorPosition)
      }

      setHistoryIndex(newIndex)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const nextState = history[newIndex]
      const currentState = history[historyIndex]

      setEquations(nextState.equations)
      setActiveIndex(nextState.activeIndex)

      // Adjust cursor position based on text length difference
      if (nextState.activeIndex !== null && currentState.activeIndex === nextState.activeIndex) {
        const currentText = currentState.activeIndex !== null ? currentState.equations[currentState.activeIndex] : ""
        const nextText = nextState.activeIndex !== null ? nextState.equations[nextState.activeIndex] : ""

        // Calculate new cursor position based on text length difference
        const lengthDiff = nextText.length - currentText.length
        const newCursorPos = Math.max(0, Math.min(cursorPosition + lengthDiff, nextText.length))

        setCursorPosition(newCursorPos)
      } else {
        setCursorPosition(nextState.cursorPosition)
      }

      setHistoryIndex(newIndex)
    }
  }

  const moveWordForward = () => {
    if (activeIndex === null) return

    const text = equations[activeIndex]
    let pos = cursorPosition

    // Skip current word
    while (
      pos < text.length &&
      text[pos] !== " " &&
      text[pos] !== "\\" &&
      text[pos] !== "{" &&
      text[pos] !== "}" &&
      text[pos] !== "(" &&
      text[pos] !== ")"
    ) {
      pos++
    }

    // Skip spaces
    while (
      pos < text.length &&
      (text[pos] === " " ||
        text[pos] === "\\" ||
        text[pos] === "{" ||
        text[pos] === "}" ||
        text[pos] === "(" ||
        text[pos] === ")")
    ) {
      pos++
    }

    setCursorPosition(pos)
  }

  const moveWordBackward = () => {
    if (activeIndex === null) return

    const text = equations[activeIndex]
    let pos = cursorPosition

    // Move back from current position
    pos--

    // Skip spaces backwards
    while (
      pos > 0 &&
      (text[pos] === " " ||
        text[pos] === "\\" ||
        text[pos] === "{" ||
        text[pos] === "}" ||
        text[pos] === "(" ||
        text[pos] === ")")
    ) {
      pos--
    }

    // Skip word backwards
    while (
      pos > 0 &&
      text[pos] !== " " &&
      text[pos] !== "\\" &&
      text[pos] !== "{" &&
      text[pos] !== "}" &&
      text[pos] !== "(" &&
      text[pos] !== ")"
    ) {
      pos--
    }

    // If we stopped at a delimiter, move forward one
    if (
      pos > 0 &&
      (text[pos] === " " ||
        text[pos] === "\\" ||
        text[pos] === "{" ||
        text[pos] === "}" ||
        text[pos] === "(" ||
        text[pos] === ")")
    ) {
      pos++
    }

    setCursorPosition(pos)
  }

  const deleteWord = () => {
    if (activeIndex === null) return

    const text = equations[activeIndex]
    const endPos = cursorPosition
    let startPos = cursorPosition

    // Move backwards to find start of word
    while (
      startPos > 0 &&
      text[startPos - 1] !== " " &&
      text[startPos - 1] !== "\\" &&
      text[startPos - 1] !== "{" &&
      text[startPos - 1] !== "}" &&
      text[startPos - 1] !== "(" &&
      text[startPos - 1] !== ")"
    ) {
      startPos--
    }

    if (startPos < cursorPosition) {
      // Word found, delete it
      const newEquation = text.substring(0, startPos) + text.substring(cursorPosition)
      updateEquation(activeIndex, newEquation)
      setCursorPosition(startPos)
    } else {
      // No word to delete, act as regular backspace
      if (cursorPosition > 0) {
        const newEquation = text.substring(0, cursorPosition - 1) + text.substring(cursorPosition)
        updateEquation(activeIndex, newEquation)
        setCursorPosition(cursorPosition - 1)
      }
    }
  }

  const downloadEquations = () => {
    const content = equations.join("\n\n")
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    saveAs(blob, "latex_equations.txt")
  }

  const removeEquation = (index: number) => {
    if (equations.length > 1) {
      const newEquations = [...equations]
      newEquations.splice(index, 1)
      setEquations(newEquations)

      if (activeIndex === index) {
        setActiveIndex(null)
      } else if (activeIndex !== null && activeIndex > index) {
        setActiveIndex(activeIndex - 1)
      }

      // Add to history
      const newHistoryEntry = {
        equations: newEquations,
        activeIndex:
          activeIndex === index ? null : activeIndex !== null && activeIndex > index ? activeIndex - 1 : activeIndex,
        cursorPosition,
        textLength: activeIndex !== null ? equations[activeIndex].length : 0,
      }
      setHistory([...history, newHistoryEntry])
      setHistoryIndex(historyIndex + 1)
    }
  }

  // Handle block activation (enter edit mode)
  const activateBlock = (index: number) => {
    setActiveIndex(index)
    setCursorPosition(equations[index].length)
  }

  // Handle block deactivation (exit edit mode)
  const deactivateBlock = () => {
    setActiveIndex(null)
    setUseNativeKeyboard(false)
  } 

  const insertString = (currentEquation: string, activeIndex: number, str:string, cursorPosition: number) => {
    const newEquation = currentEquation.substring(0, cursorPosition) + str + currentEquation.substring(cursorPosition)
    updateEquation(activeIndex, newEquation)
  }

  const inputString = (currentEquation: string, activeIndex: number, str: string, cursorPosition: number, endPosition: number) => {
    insertString(currentEquation,activeIndex,str,cursorPosition)
    setCursorPosition(endPosition)
  }

  // Handle keyboard input
  const handleKeyInput = (key: string) => {
    if (activeIndex === null) return

    const currentEquation = equations[activeIndex]

    // Handle special keys
    if (key === "←") {
      setCursorPosition(Math.max(0, cursorPosition - 1))
      return
    }

    if (key === "→") {
      setCursorPosition(Math.min(currentEquation.length, cursorPosition + 1))
      return
    }

    if (key === "⌫") {
      if (cursorPosition > 0) {
        const newEquation = currentEquation.substring(0, cursorPosition - 1) + currentEquation.substring(cursorPosition)
        updateEquation(activeIndex, newEquation)
        setCursorPosition(cursorPosition - 1)
      }
      return
    }

    // Handle bracket pairs and place cursor inside
    if (key === "()") {
      inputString(currentEquation,activeIndex, key, cursorPosition,cursorPosition + 1)
      return
    }

    if (key === "{}") {
      inputString(currentEquation,activeIndex, key, cursorPosition,cursorPosition + 1)
      return
    }

    if (key === "\\frac{}{}") {
      inputString(currentEquation,activeIndex, key, cursorPosition,cursorPosition + 6) // Position after first {
      return
    }

    if (key === "\\mathrm{}") {
      inputString(currentEquation,activeIndex, key, cursorPosition,cursorPosition + 8) // Position after {
      return
    }
    
    // Default: insert the key at cursor position
    inputString(currentEquation,activeIndex, key, cursorPosition,cursorPosition + key.length)
  }

  // Add a custom key
  const addCustomKey = (key: string, dollarPos?: number) => {
    if (!customKeys.includes(key)) {
      // If there's a dollar sign, we need to handle it specially
      if (dollarPos !== undefined && dollarPos >= 0) {
        // Remove the $ character and add the key without it
        const cleanKey = key.substring(0, dollarPos) + key.substring(dollarPos + 1)
        const newCustomKeys = [...customKeys, cleanKey]
        setCustomKeys(newCustomKeys)
        saveCustomKeys(newCustomKeys)

        // When this key is used, we'll set the cursor at the $ position
        if (activeIndex !== null) {
          const currentEquation = equations[activeIndex]
          const newEquation =
            currentEquation.substring(0, cursorPosition) + cleanKey + currentEquation.substring(cursorPosition)
          updateEquation(activeIndex, newEquation)
          setCursorPosition(cursorPosition + dollarPos)
        }
      } else {
        // Regular key without $ mark
        const newCustomKeys = [...customKeys, key]
        setCustomKeys(newCustomKeys)
        saveCustomKeys(newCustomKeys)
      }
    }
    setShowKeyAddMenu(false)
  }

  // Handle content change from editable math block
  const handleContentChange = useCallback(
    (content: string) => {
      if (activeIndex !== null) {
        updateEquation(activeIndex, content)
      }
    },
    [activeIndex],
  )

  // Toggle native keyboard mode
  const toggleNativeKeyboard = () => {
    setUseNativeKeyboard(!useNativeKeyboard)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Upper section: Math display/edit area */}
      <div className="flex-1 overflow-auto p-4 bg-white">
        <div className="flex flex-col gap-4">
          {equations.map((equation, index) => (
            <MathBlock
              key={index}
              id={index}
              equation={equation}
              isActive={activeIndex === index}
              cursorPosition={activeIndex === index ? cursorPosition : null}
              onClick={() => activateBlock(index)}
              onDelete={() => removeEquation(index)}
              isEditable={useNativeKeyboard && activeIndex === index}
              onContentChange={handleContentChange}
            />
          ))}
          <button onClick={addEquationBlock} className="p-2 bg-gray-200 rounded text-center text-gray-700">
            + 新しい数式ブロック
          </button>
        </div>
      </div>

      {/* Lower section: Custom keyboard */}
      <div className="h-2/5 overflow-auto bg-gray-200 border-t border-gray-300">
        <CustomKeyboard
          onKeyPress={handleKeyInput}
          customKeys={customKeys}
          onOpenAddMenu={() => setShowKeyAddMenu(true)}
          onUndo={undo}
          onRedo={redo}
          onMoveWordForward={moveWordForward}
          onMoveWordBackward={moveWordBackward}
          onDeleteWord={deleteWord}
          onDownload={downloadEquations}
          onToggleNativeKeyboard={toggleNativeKeyboard}
          useNativeKeyboard={useNativeKeyboard}
        />
      </div>

      {/* Key addition menu overlay */}
      {showKeyAddMenu && (
        <KeyAdditionMenu onAddKey={addCustomKey} onClose={() => setShowKeyAddMenu(false)} existingKeys={customKeys} />
      )}

      {/* Background overlay to exit edit mode when clicking outside */}
      {activeIndex !== null && (
        <div className="fixed inset-0 bg-transparent z-10 pointer-events-none" onClick={deactivateBlock} />
      )}
    </div>
  )
}
