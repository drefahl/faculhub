"use client"

import type React from "react"

import { useCallback, useEffect } from "react"

type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  handler: (e: KeyboardEvent) => void
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  targetRef: React.RefObject<HTMLElement>,
  enabled = true,
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey
        const altMatch = shortcut.altKey === undefined || event.altKey === shortcut.altKey
        const shiftMatch = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey
        const metaMatch = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey

        if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
          event.preventDefault()
          shortcut.handler(event)
          return
        }
      }
    },
    [shortcuts, enabled],
  )

  useEffect(() => {
    const target = targetRef.current || document

    target.addEventListener("keydown", handleKeyDown)
    return () => {
      target.removeEventListener("keydown", handleKeyDown)
    }
  }, [targetRef, handleKeyDown])
}

// Helper function to create platform-agnostic shortcuts
export function createShortcut(
  key: string,
  handler: (e: KeyboardEvent) => void,
  options: { useCtrlKey?: boolean; useAltKey?: boolean; useShiftKey?: boolean; useMetaKey?: boolean } = {},
): KeyboardShortcut[] {
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0

  // For Mac, use Command (metaKey), for others use Ctrl
  if (isMac && options.useCtrlKey) {
    return [
      {
        key,
        metaKey: true,
        altKey: options.useAltKey || false,
        shiftKey: options.useShiftKey || false,
        handler,
      },
    ]
  }

  if (options.useCtrlKey) {
    return [
      {
        key,
        ctrlKey: true,
        altKey: options.useAltKey || false,
        shiftKey: options.useShiftKey || false,
        handler,
      },
    ]
  }

  // If not using Ctrl/Cmd, just return the basic shortcut
  return [
    {
      key,
      altKey: options.useAltKey || false,
      shiftKey: options.useShiftKey || false,
      handler,
    },
  ]
}
