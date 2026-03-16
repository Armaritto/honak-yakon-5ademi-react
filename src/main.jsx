import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const applySeasonalPrimaryTheme = () => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()

  let primaryBlue = '#000080'
  let primaryDarkBlue = '#000066'
  let primaryMidColor = '#1a1a6e'
  let primaryShadowRgb = '0, 0, 128'

  if (month === 4 && day === 5) {
    primaryBlue = '#15803d'
    primaryDarkBlue = '#166534'
    primaryMidColor = '#166534'
    primaryShadowRgb = '21, 128, 61'
  } else if (month === 4 && day >= 6 && day <= 10) {
    primaryBlue = '#000000'
    primaryDarkBlue = '#111111'
    primaryMidColor = '#0a0a0a'
    primaryShadowRgb = '0, 0, 0'
  } else if ((month === 4 && day >= 11) || month === 5) {
    primaryBlue = '#7f1d1d'
    primaryDarkBlue = '#5f1212'
    primaryMidColor = '#6e1919'
    primaryShadowRgb = '127, 29, 29'
  }

  const root = document.documentElement
  root.style.setProperty('--primary-blue', primaryBlue)
  root.style.setProperty('--primary-dark-blue', primaryDarkBlue)
  root.style.setProperty('--primary-mid-color', primaryMidColor)
  root.style.setProperty('--primary-shadow-rgb', primaryShadowRgb)
}

applySeasonalPrimaryTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
