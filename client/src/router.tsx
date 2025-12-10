import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GrimoirePage from './pages/GrimoirePage'
import SpellsPage from './pages/SpellsPage'
import PotionsPage from './pages/PotionsPage'
import TrashPage from './pages/TrashPage'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/grimoire" element={<GrimoirePage />} />
      <Route path="/spells" element={<SpellsPage />} />
      <Route path="/potions" element={<PotionsPage />} />
      <Route path="/trash" element={<TrashPage />} />
    </Routes>
  )
}
