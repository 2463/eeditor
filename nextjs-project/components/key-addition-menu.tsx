"use client"

import type React from "react"

import { useState } from "react"

interface KeyAdditionMenuProps {
  onAddKey: (key: string, dollarPos?: number) => void
  onClose: () => void
  existingKeys: string[]
}

const KeyAdditionMenu: React.FC<KeyAdditionMenuProps> = ({ onAddKey, onClose, existingKeys }) => {
  const [newKey, setNewKey] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newKey.trim()) {
      // Check for $ mark and pass its position
      const dollarPos = newKey.indexOf("$")
      if (dollarPos >= 0) {
        onAddKey(newKey.trim(), dollarPos)
      } else {
        onAddKey(newKey.trim())
      }
      setNewKey("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">カスタムキーの追加</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newKey" className="block text-sm font-medium text-gray-700 mb-1">
              追加するキー
            </label>
            <input
              type="text"
              id="newKey"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="\alpha や \beta など"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">$ マークを含めると、カーソルがその位置に設定されます</p>
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!newKey.trim()}
            >
              追加
            </button>
          </div>
        </form>

        {existingKeys.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">現在のカスタムキー</h3>
            <div className="flex flex-wrap gap-2">
              {existingKeys.map((key) => (
                <span key={key} className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {key}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KeyAdditionMenu
