import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import './main.css'
import App from './App'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'

const Root: React.FC = () => {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.onerror = (msg, url, line, col, error) => {
      console.error('Global error:', msg, line, col)
      setError(String(msg))
    }
    
    window.onunhandledrejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
    }
  }, [])

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        background: '#1a1a2e', 
        minHeight: '100vh',
        color: 'white'
      }}>
        <h1 style={{ color: '#e94057' }}>应用程序加载失败</h1>
        <p style={{ color: '#666', marginTop: '20px' }}>{error}</p>
      </div>
    )
  }

  return (
    <FluentProvider theme={webLightTheme}>
      <App />
    </FluentProvider>
  )
}

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<Root />)
} else {
  console.error('Root element not found')
}
