import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Dashboard',        to: '#' },
  { label: 'Balances',         to: '#' },
  { label: 'Holdings',         to: '#' },
  { label: 'Activity',         to: '#' },
  { label: 'Performance',      to: '#' },
  { label: 'Portfolio Watch',  to: '#' },
  { label: 'Sell & Rebalance', to: '/' },
]

export default function L2Nav() {
  return (
    <nav className="bg-white flex items-stretch h-12 px-6 gap-6 border-b border-vg-border shrink-0">
      {NAV_ITEMS.map(({ label, to }) =>
        label === 'Sell & Rebalance' ? (
          // Active item: full-height link with 2px red bottom border
          // The red border-b-2 sits on top of the nav's gray border-b
          <NavLink
            key={label}
            to={to}
            end
            className="flex items-center text-[14px] font-bold text-vg-ink whitespace-nowrap
              border-b-2 border-vg-red -mb-px"
          >
            {label}
          </NavLink>
        ) : (
          <span
            key={label}
            className="flex items-center text-[14px] text-vg-ink whitespace-nowrap cursor-pointer"
          >
            {label}
          </span>
        ),
      )}
    </nav>
  )
}
