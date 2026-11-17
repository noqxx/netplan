import { NavLink, Outlet } from 'react-router'

const navItems = [{ to: '/', label: 'Home' }]

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="text-lg font-bold tracking-tight">NETPLAN</p>
          <p className="text-xs text-slate-500">Network planning toolkit</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                isActive
                  ? 'rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white'
                  : 'rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}