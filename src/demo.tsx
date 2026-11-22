import { useState } from 'react'
import CoreHero from '@/components/ui/syntra-hero'

const APP_URL = './app.html'
const STORAGE_KEY = 'spk_upload'

// A file uploaded earlier in this tab survives a refresh of the landing page.
const readStoredName = (): string | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)

    return raw ? (JSON.parse(raw) as { name: string }).name : null
  } catch {
    return null
  }
}

export default function Demo() {
  const [fileName, setFileName] = useState<string | null>(readStoredName)

  // Upload Data: keep the file for the SPK app. Mulai stays disabled until this succeeds.
  const handleUpload = (file: File) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ name: file.name, dataUrl: reader.result }))
        setFileName(file.name)
      } catch {
        // Storage can be full or blocked, in which case the file cannot be handed to the app.
        setFileName(null)
        window.alert('File tidak bisa disimpan di browser ini. Coba file yang lebih kecil atau buka lewat jendela biasa.')
      }
    }
    reader.readAsDataURL(file)
  }

  // Mulai: the app picks the stored file up and opens straight on its Preferensi step.
  const handleStart = () => {
    if (!fileName) return
    window.location.href = APP_URL
  }

  return <CoreHero onUpload={handleUpload} onStart={handleStart} fileName={fileName} />
}
