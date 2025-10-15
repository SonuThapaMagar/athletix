import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import PlayerDashboard from './pages/player/PlayerDashboard'
import Booking from './pages/player/Booking'
import Matchmaking from './pages/player/Matchmaking'
import History from './pages/player/History'
import VenueDetails from './pages/player/VenueDetails'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onSwitchToSignup={() => { window.location.href = '/signup' }} />} />
        <Route path="/signup" element={<Signup onSwitchToLogin={() => { window.location.href = '/login' }} />} />
        
        {/* Player Routes */}
        <Route path="/player" element={<PlayerDashboard />} />
        <Route path="/player/booking" element={<Booking />} />
        <Route path="/player/matchmaking" element={<Matchmaking />} />
        <Route path="/player/history" element={<History />} />
        <Route path="/venue/:id" element={<VenueDetails />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
