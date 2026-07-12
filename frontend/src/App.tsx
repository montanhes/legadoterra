import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NewPet from './pages/pets/NewPet'
import PetDetail from './pages/pets/PetDetail'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/painel" element={<Dashboard />} />
          <Route path="/painel/pets/novo" element={<NewPet />} />
          <Route path="/painel/pets/:id" element={<PetDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
