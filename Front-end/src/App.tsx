import { Route, Routes } from 'react-router-dom'
import './App.css'
import Homescreen from './HomeScreens/Homescreen'
import LoginPage from './Auth/LoginAccount'
import Dashboard from './Dashboard/Dashboard'

function App() {

  return (
    <>
      <Routes>
        <Route path="" element={<Homescreen/> } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Homescreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
