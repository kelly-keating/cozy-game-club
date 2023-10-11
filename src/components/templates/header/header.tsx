import Link from 'next/link'

import BlogLogo from '@icons/blog-logo.svg'
import { Container } from '@src/components/shared/container'

export const Header = () => {
  return (
    <header className="py-5">
      <nav>
        <Container className="flex items-center justify-between">
          <Link href="/" title="Cozy Game Club" >
            <BlogLogo />
          </Link>
        </Container>
      </nav>
    </header>
  )
}
