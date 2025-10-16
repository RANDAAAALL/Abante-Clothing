"use client"

import { Toaster, ToastBar } from "react-hot-toast"

export default function ToasterClient() {
  return (
    <Toaster
      position="top-right">
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            animation: t.visible
              ? "toast-in 0.4s ease forwards"
              : "toast-out 0.4s ease forwards",
            fontSize: "15px",
            background: "var(--card-white-background)",
          }}
        />
      )}
    </Toaster>
  )
}
