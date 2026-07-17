import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ClinicRoute from './components/ClinicRoute'
import Home from './pages/Home'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NewPet from './pages/pets/NewPet'
import EditPet from './pages/pets/EditPet'
import PetDetail from './pages/pets/PetDetail'
import Search from './pages/Search'
import RegisterClinic from './pages/clinic/RegisterClinic'
import ConfirmTyping from './pages/clinic/ConfirmTyping'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/clinica/cadastro" element={<RegisterClinic />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/painel" element={<Dashboard />} />
          <Route path="/painel/pets/novo" element={<NewPet />} />
          <Route path="/painel/pets/:id" element={<PetDetail />} />
          <Route path="/painel/pets/:id/editar" element={<EditPet />} />
          <Route path="/buscar" element={<Search />} />
        </Route>

        <Route element={<ClinicRoute />}>
          <Route path="/clinica/confirmar" element={<ConfirmTyping />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
