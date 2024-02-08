// app/components/ThemeSwitcher.tsx
"use client";

import {useTheme} from "next-themes";
import { useEffect, useState } from "react";

import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div>
     { theme === "dark" ?
      <button isIconOnly  aria-label="Light Mode" onClick={() => setTheme('light')}>
        <MdDarkMode></MdDarkMode>
      </button>
      :
      <button isIconOnly  aria-label="Dark Mode" onClick={() => setTheme('dark')}>
        <MdOutlineDarkMode></MdOutlineDarkMode>
      </button>
      
     }
    </div>
  )
}