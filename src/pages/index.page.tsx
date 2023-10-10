import { useContentfulLiveUpdates } from '@contentful/live-preview/react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'

import { ArticleHero, ArticleTileGrid } from '@src/components/features/article'
import { SeoFields } from '@src/components/features/seo'
import { Container } from '@src/components/shared/container'
import { PageBlogPostOrder } from '@src/lib/__generated/sdk'
import { client, previewClient } from '@src/lib/client'
import { revalidateDuration } from '@src/pages/utils/constants'

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const page = useContentfulLiveUpdates(props.page)
  const posts = useContentfulLiveUpdates(props.posts)

  if (!page?.featuredBlogPost || !posts) return

  return (
    <>
      {page.seoFields && <SeoFields {...page.seoFields} />}
      <Container>
        <Link href={`/${page.featuredBlogPost.slug}`}>
          <ArticleHero article={page.featuredBlogPost} />
        </Link>
      </Container>

      <Container className="my-8  md:mb-10 lg:mb-16">
        <h2 className="mb-4 md:mb-6">Latest articles</h2>
        <ArticleTileGrid className="md:grid-cols-2 lg:grid-cols-3" articles={posts} />
      </Container>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ draftMode: preview }) => {
  try {
    const gqlClient = preview ? previewClient : client

    const landingPageData = await gqlClient.pageLanding({ preview })
    const page = landingPageData.pageLandingCollection?.items[0]

    const blogPostsData = await gqlClient.pageBlogPostCollection({
      limit: 6,
      order: PageBlogPostOrder.PublishedDateDesc,
      where: {
        slug_not: page?.featuredBlogPost?.slug,
      },
      preview,
    })
    const posts = blogPostsData.pageBlogPostCollection?.items

    if (!page) {
      return {
        revalidate: revalidateDuration,
        notFound: true,
      }
    }

    return {
      revalidate: revalidateDuration,
      props: {
        previewActive: !!preview,
        page,
        posts,
      },
    }
  } catch {
    return {
      revalidate: revalidateDuration,
      notFound: true,
    }
  }
}

export default Page
