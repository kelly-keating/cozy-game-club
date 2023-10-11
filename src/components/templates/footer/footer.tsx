import Link from 'next/link'

import { Container } from '@src/components/shared/container'

export const Footer = () => {
  return (
    <footer className="border-t-color mt-10 border-t border-gray200">
      <Container className="py-8">
        <h2 className="h4 mb-4">About Us</h2>
        <div className="max-w-4xl">Description</div>
        <div className="mt-8">
          Powered by{' '}
          <Link
            href="https://www.contentful.com"
            rel="noopener noreferrer"
            target="_blank"
            className="text-blue500"
          >
            Contentful
          </Link>
        </div>
      </Container>
    </footer>
  )
}
