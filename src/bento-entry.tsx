import { createRoot, type Root } from 'react-dom/client'
import { AnalyticsBento, type AnalyticsBentoProps } from '@/components/ui/analytics-bento'
import css from './bento.css?inline'

export type BentoData = Pick<AnalyticsBentoProps, 'revenue' | 'sessions' | 'categories' | 'seasonality'>

declare global {
  interface Window {
    SpotwiseBento?: { mount: (el: HTMLElement, data: BentoData) => void; unmount: () => void }
  }
}

let host: HTMLElement | null = null
let root: Root | null = null
let runId = 0

// Tailwind relies on @property for shadows, rings and gradients, and a shadow root cannot
// register them. Registering them once on the document makes them work everywhere.
function registerProperties() {
  if (document.getElementById('spotwise-bento-props')) return

  const rules = css.match(/@property\s+[^{]+\{[^}]*\}/g)

  if (!rules) return

  const style = document.createElement('style')

  style.id = 'spotwise-bento-props'
  style.textContent = rules.join('\n')
  document.head.appendChild(style)
}

function unmount() {
  root?.unmount()
  root = null
  if (host) {
    host.hidden = true
    host.shadowRoot?.replaceChildren()
  }
  host = null
}

// Safe to call again after every calculation: the same root is reused and the key resets local state.
function mount(el: HTMLElement, data: BentoData) {
  if (host && host !== el) unmount()

  if (!root) {
    registerProperties()

    const shadow = el.shadowRoot ?? el.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    const container = document.createElement('div')

    style.textContent = css
    shadow.replaceChildren(style, container)
    root = createRoot(container)
    host = el
  }

  el.hidden = false
  runId += 1
  root.render(<AnalyticsBento key={runId} decimals={1} {...data} />)
}

window.SpotwiseBento = { mount, unmount }
