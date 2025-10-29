"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { useLongPress } from "@/hooks/use-long-press"

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void
  customKeys: string[]
  onOpenAddMenu: () => void
  onUndo: () => void
  onRedo: () => void
  onMoveWordForward: () => void
  onMoveWordBackward: () => void
  onDeleteWord: () => void
  onDownload: () => void
  onToggleNativeKeyboard: () => void
  useNativeKeyboard: boolean
}

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
  onKeyPress,
  customKeys,
  onOpenAddMenu,
  onUndo,
  onRedo,
  onMoveWordForward,
  onMoveWordBackward,
  onDeleteWord,
  onDownload,
  onToggleNativeKeyboard,
  useNativeKeyboard,
}) => {
  // Basic keys for navigation, editing, etc.
  const basicKeys = ["←", "→", "⌫", "()", "{}", "[]", "+", "-", "=", "^", "_", "\\"]

  return (
    <div className="p-2">
      {/* Section title */}
      <div className="text-sm font-bold text-gray-700 mb-2 px-1">カスタムキーボード</div>

      {/* Basic keys section */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1 px-1">基本キー</div>
        <div className="grid grid-cols-4 gap-1 sm:grid-cols-6">
          {basicKeys.map((key) => {

            // Regular keys
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className="p-3 bg-white rounded-lg shadow text-center hover:bg-gray-100 active:bg-gray-200"
              >
                {key}
              </button>
            )
          })}

          {/* Add word navigation and delete keys */}
          <button
            onClick={onMoveWordBackward}
            className="p-3 bg-white rounded-lg shadow text-center hover:bg-gray-100 active:bg-gray-200"
          >
            Ctrl+←
          </button>
          <button
            onClick={onMoveWordForward}
            className="p-3 bg-white rounded-lg shadow text-center hover:bg-gray-100 active:bg-gray-200"
          >
            Ctrl+→
          </button>
          <button
            onClick={onDeleteWord}
            className="p-3 bg-white rounded-lg shadow text-center hover:bg-gray-100 active:bg-gray-200"
          >
            Ctrl+⌫
          </button>
        </div>
      </div>

      {/* Additional keys section */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1 px-1">追加キー</div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {additionalKeys.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="p-3 bg-white rounded-lg shadow text-center hover:bg-gray-100 active:bg-gray-200 text-sm"
            >
              {key}
            </button>
          ))}
          {customKeys.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="p-3 bg-white rounded-lg shadow text-center hover:bg-gray-100 active:bg-gray-200 text-sm"
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Special keys section */}
      <div>
        <div className="text-xs text-gray-500 mb-1 px-1">特殊キー</div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={onOpenAddMenu}
            className="p-3 bg-blue-500 text-white rounded-lg shadow text-center hover:bg-blue-600 active:bg-blue-700"
          >
            キー追加
          </button>
          <button
            onClick={onToggleNativeKeyboard}
            className={`p-3 rounded-lg shadow text-center ${
              useNativeKeyboard
                ? "bg-green-500 text-white hover:bg-green-600 active:bg-green-700"
                : "bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700"
            }`}
          >
            {useNativeKeyboard ? "編集モード終了" : "編集モード"}
          </button>
          <button
            onClick={onDownload}
            className="p-3 bg-purple-500 text-white rounded-lg shadow text-center hover:bg-purple-600 active:bg-purple-700"
          >
            ダウンロード
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 mt-1">
          <button
            onClick={onUndo}
            className="p-3 bg-amber-500 text-white rounded-lg shadow text-center hover:bg-amber-600 active:bg-amber-700"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            className="p-3 bg-amber-500 text-white rounded-lg shadow text-center hover:bg-amber-600 active:bg-amber-700"
          >
            Redo
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomKeyboard
