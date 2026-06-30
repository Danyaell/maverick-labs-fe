interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <section>
      <p>{message}</p>
    </section>
  )
}
