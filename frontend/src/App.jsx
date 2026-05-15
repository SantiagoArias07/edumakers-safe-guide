import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import Navbar from './components/layout/Navbar'
import BottomNav from './components/layout/BottomNav'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import MapPage from './pages/MapPage'
import Profile from './pages/Profile'
import AcercaDe from './pages/AcercaDe'

export default function App() {
  useEffect(() => {
    const fontsize = localStorage.getItem('safeguide_fontsize')
    document.documentElement.classList.toggle('text-large', fontsize === 'grande')
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-soft focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
          >
            Ir al contenido principal
          </a>
          <Navbar />
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/mapa" element={<MapPage />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/acerca" element={<AcercaDe />} />
            </Routes>
          </ErrorBoundary>
          <BottomNav />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
