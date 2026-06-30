import { createBrowserRouter } from 'react-router'
import App from './App'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { GameCatalogPage } from '../features/games/pages/GameCatalogPage'
import { GameDetailPage } from '../features/games/pages/GameDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'games',
        element: <GameCatalogPage />,
      },
      {
        path: 'games/:gameCode',
        element: <GameDetailPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])