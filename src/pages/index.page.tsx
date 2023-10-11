import { useContentfulLiveUpdates } from '@contentful/live-preview/react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'

import { ArticleHero, ArticleTileGrid } from '@src/components/features/article'
import { SeoFields } from '@src/components/features/seo'
import { Container } from '@src/components/shared/container'
import { PageGameReviewOrder } from '@src/lib/__generated/sdk'
import { client, previewClient } from '@src/lib/client'
import { revalidateDuration } from '@src/pages/utils/constants'

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const page = useContentfulLiveUpdates(props.page)
  const reviews = useContentfulLiveUpdates(props.reviews)

  if (!page?.featuredReview || !reviews) return

  return (
    <>
      {page.seoFields && <SeoFields {...page.seoFields} />}
      <Container>
        <Link href={`/${page.featuredReview.slug}`}>
          <ArticleHero article={page.featuredReview} />
        </Link>
      </Container>

      <Container className="my-8  md:mb-10 lg:mb-16">
        <h2 className="mb-4 md:mb-6">Latest game reviews</h2>
        <ArticleTileGrid className="md:grid-cols-2 lg:grid-cols-3" articles={reviews} />
      </Container>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ draftMode: preview }) => {
  try {
    const gqlClient = preview ? previewClient : client
    const landingPageData = await gqlClient.pageLanding({ preview })

    const page = landingPageData.pageLandingCollection?.items[0]
    if (!page) throw new Error("Couldn't find page")

    const gameReviewData = await gqlClient.pageGameReviewCollection({
      limit: 10,
      order: PageGameReviewOrder.PublishedDateDesc,
      where: {
        slug_not: page?.featuredReview?.slug,
      },
      preview,
    })
    const reviews = gameReviewData.pageGameReviewCollection?.items


    return {
      revalidate: revalidateDuration,
      props: {
        previewActive: !!preview,
        page,
        reviews,
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
