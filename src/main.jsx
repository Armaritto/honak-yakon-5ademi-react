import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { getSeasonalTheme } from './utils/seasonalTheme'
import { initializeStoredFont } from './utils/fontPreferences'

const applySeasonalPrimaryTheme = () => {
  const { primaryBlue, primaryDarkBlue, primaryMidColor, primaryShadowRgb } = getSeasonalTheme()

  const root = document.documentElement
  root.style.setProperty('--primary-blue', primaryBlue)
  root.style.setProperty('--primary-dark-blue', primaryDarkBlue)
  root.style.setProperty('--primary-mid-color', primaryMidColor)
  root.style.setProperty('--primary-shadow-rgb', primaryShadowRgb)
}

applySeasonalPrimaryTheme()
initializeStoredFont()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
