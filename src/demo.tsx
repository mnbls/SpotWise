import CoreHero from '@/components/ui/syntra-hero'

const APP_URL = './app.html'
const STORAGE_KEY = 'spk_upload'

export default function Demo() {
  // Upload Data: hand the picked file to the SPK app, which loads it on arrival.
  const handleUpload = (file: File) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ name: file.name, dataUrl: reader.result }))
      } catch {
        // Storage can be full or blocked; the app then simply opens on its own upload step.
      }
      window.location.href = APP_URL
    }
    reader.readAsDataURL(file)
  }

  // Mulai: open the SPK app on its own upload step.
  const handleStart = () => {
    window.location.href = APP_URL
  }

  return <CoreHero onUpload={handleUpload} onStart={handleStart} />
}
