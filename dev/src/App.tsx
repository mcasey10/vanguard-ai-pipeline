import { Routes, Route } from 'react-router-dom'
import PortalShell from './components/shell/PortalShell'
import FundSelectionEntry from './pages/FundSelectionEntry'
import FundSelectionAutomated from './pages/FundSelectionAutomated'

export default function App() {
  return (
    <Routes>
      <Route element={<PortalShell />}>
        <Route path="/" element={<FundSelectionEntry />} />
        <Route path="/automated" element={<FundSelectionAutomated />} />
      </Route>
    </Routes>
  )
}
