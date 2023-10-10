import Link from 'next/link'

import { Container } from '@src/components/shared/container'

const ErrorPage404 = () => {
  return (
    <Container>
      <h1 className="h2">404 - Not Found</h1>
      <p className="mt-4">
        No content was found matching this url. Please try again or go back to{' '}
          <Link className="text-blue500" href="/">home</Link>.
      </p>
    </Container>
  )
}

export default ErrorPage404
