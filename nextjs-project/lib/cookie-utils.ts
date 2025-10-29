"use client"

// Save custom keys to cookies
export const saveCustomKeys = (keys: string[]): void => {
  try {
    const keysString = JSON.stringify(keys)
    document.cookie = `customKeys=${encodeURIComponent(keysString)};path=/;max-age=31536000` // 1 year
  } catch (error) {
    console.error("Error saving custom keys to cookie:", error)
  }
}

// Load custom keys from cookies
export const loadCustomKeys = (): string[] | null => {
  try {
    const cookies = document.cookie.split(";")
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=")
      if (name === "customKeys") {
        return JSON.parse(decodeURIComponent(value))
      }
    }
    return null
  } catch (error) {
    console.error("Error loading custom keys from cookie:", error)
    return null
  }
}

// Clear custom keys from cookies
export const clearCustomKeys = (): void => {
  document.cookie = "customKeys=;path=/;max-age=0"
}
