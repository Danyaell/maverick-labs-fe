import './App.css'
import { /* NavLink, */ Outlet } from 'react-router'

export default function App() {
  return (
    <div>
      <header>
{/*         <nav>
          <NavLink to="/">Home</NavLink>
          {' | '}
          <NavLink to="/games">Games</NavLink>
        </nav> */}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
