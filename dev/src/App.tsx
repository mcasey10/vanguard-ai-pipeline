import { Routes, Route } from 'react-router-dom'
import PortalShell from './components/shell/PortalShell'
import FundSelectionEntry from './pages/FundSelectionEntry'
import FundSelectionAutomated from './pages/FundSelectionAutomated'
import FundSelectionManual from './pages/FundSelectionManual'
import FundSelectionManual2 from './pages/FundSelectionManual2'

export default function App() {
  return (
    <Routes>
      <Route element={<PortalShell />}>
        <Route path="/" element={<FundSelectionEntry />} />
        <Route path="/automated" element={<FundSelectionAutomated />} />
        <Route path="/manual" element={<FundSelectionManual />} />
        <Route path="/manual-2" element={<FundSelectionManual2 />} />
      </Route>
    </Routes>
  )
}
