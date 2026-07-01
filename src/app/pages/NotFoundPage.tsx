import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section>
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>

      <Link to="/">Go home</Link>
    </section>
  )
}