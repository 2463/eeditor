"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface MathBlockProps {
  equation: string
  isActive: boolean
  cursorPosition: number | null
  onClick: () => void
  onDelete: () => void
  isEditable: boolean
  id: number
  onContentChange?: (content: string) => void
}

const MathBlock: React.FC<MathBlockProps> = ({
  equation,
  isActive,
  cursorPosition,
  onClick,
  onDelete,
  isEditable,
  id,
  onContentChange,
}) => {
  const blockRef = useRef<HTMLDivElement>(null)

  // Handle contentEditable mode
  useEffect(() => {
    if (blockRef.current) {
      if (isEditable) {
        blockRef.current.setAttribute("contenteditable", "true")
        blockRef.current.focus()

        // Set cursor position if possible
        if (cursorPosition !== null) {
          try {
            const selection = window.getSelection()
            const range = document.createRange()

            // Find the text node
            let textNode = blockRef.current.firstChild
            while (textNode && textNode.nodeType !== Node.TEXT_NODE) {
              textNode = textNode.nextSibling
            }

            if (textNode) {
              range.setStart(textNode, Math.min(cursorPosition, textNode.textContent?.length || 0))
              range.collapse(true)
              selection?.removeAllRanges()
              selection?.addRange(range)
            }
          } catch (error) {
            console.error("Error setting cursor position:", error)
          }
        }

        // Add input event listener
        const handleInput = () => {
          if (onContentChange && blockRef.current) {
            onContentChange(blockRef.current.textContent || "")
          }
        }

        blockRef.current.addEventListener("input", handleInput)
        return () => {
          blockRef.current?.removeEventListener("input", handleInput)
        }
      } else {
        blockRef.current.removeAttribute("contenteditable")
      }
    }
  }, [isEditable, cursorPosition, onContentChange])

  // Render KaTeX when not in edit mode
  useEffect(() => {
    if (!isActive && !isEditable && blockRef.current) {
      try {
        katex.render(equation || "\\;", blockRef.current, {
          throwOnError: false,
          displayMode: true,
        })
      } catch (error) {
        console.error("KaTeX rendering error:", error)
      }
    }
  }, [equation, isActive, isEditable])

  // Handle cursor rendering in edit mode
  useEffect(() => {
    if (isActive && !isEditable && blockRef.current && cursorPosition !== null) {
      const rawText = equation
      const beforeCursor = rawText.substring(0, cursorPosition)
      const afterCursor = rawText.substring(cursorPosition)

      blockRef.current.innerHTML = `
        <span class="text-gray-800">${beforeCursor}</span>
        <span class="cursor-blink animate-pulse bg-blue-300 text-blue-300">|</span>
        <span class="text-gray-800">${afterCursor}</span>
      `
    }
  }, [equation, isActive, cursorPosition, isEditable])

  return (
    <div className="relative">
      <div
        ref={blockRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className={`p-4 rounded-lg min-h-[60px] math-block-${id} ${
          isActive ? "bg-blue-50 border-2 border-blue-400" : "bg-gray-50 border border-gray-300"
        }`}
      >
        {isEditable ? equation : ""}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600"
        aria-label="Delete equation"
      >
        ×
      </button>
    </div>
  )
}

export default MathBlock
