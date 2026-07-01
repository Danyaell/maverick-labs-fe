interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <section>
      <p>{message}</p>
    </section>
  )
}
