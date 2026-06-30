import { Link } from 'react-router'

export function HomePage() {
  return (
    <section>
      <h1>Maverick Labs</h1>
      <p>Explore Mega Man X saga video game data, mechanics, characters, and collections.</p>

      <Link to="/games">View game catalog</Link>
    </section>
  )
}