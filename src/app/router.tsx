import { createBrowserRouter } from 'react-router'
import App from './App'
import { NotFoundPage } from './pages/NotFoundPage'
import { GameCatalogPage } from '../features/games/pages/GameCatalogPage'
import { GameDetailPage } from '../features/games/pages/GameDetailPage'
import { RouteBuilderPage } from '../features/route-builder/pages/RouteBuilderPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <GameCatalogPage />,
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
        path: 'games/:gameCode/route-builder',
        element: <RouteBuilderPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])