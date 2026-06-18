import { Outlet } from 'react-router-dom'
import GlobalHeader from './GlobalHeader'
import L2Nav from './L2Nav'

export default function PortalShell() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GlobalHeader />
      <L2Nav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
