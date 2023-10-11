import { useContentfulLiveUpdates } from '@contentful/live-preview/react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'

import { ArticleContent, ArticleHero, ArticleTileGrid } from '@src/components/features/article'
import { SeoFields } from '@src/components/features/seo'
import { Container } from '@src/components/shared/container'
import { client, previewClient } from '@src/lib/client'
import { revalidateDuration } from '@src/pages/utils/constants'

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const gameReview = useContentfulLiveUpdates(props.gameReview)
  const relatedPosts = gameReview?.relatedGameReviewsCollection?.items

  if (!gameReview || !relatedPosts) return null

  return (
    <>
      {gameReview.seoFields && <SeoFields {...gameReview.seoFields} />}
      <Container>
        <ArticleHero article={gameReview} isFeatured={props.isFeatured} isReversedLayout={true} />
      </Container>
      <Container className="mt-8 max-w-4xl">
        <ArticleContent article={gameReview} />
      </Container>
      {relatedPosts && (
        <Container className="mt-8 max-w-5xl">
          <h2 className="mb-4 md:mb-6">Related articles</h2>
          <ArticleTileGrid className="md:grid-cols-2" articles={relatedPosts} />
        </Container>
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params, draftMode: preview }) => {
  if (!params?.slug) {
    return {
      notFound: true,
      revalidate: revalidateDuration,
    }
  }

  const gqlClient = preview ? previewClient : client

  try {
    const [gameReviewData, landingPageData] = await Promise.all([
      gqlClient.pageGameReview({ slug: params.slug.toString(), preview }),
      gqlClient.pageLanding({ preview }),
    ])

    const gameReview = gameReviewData.pageGameReviewCollection?.items[0]
    const landingPage = landingPageData.pageLandingCollection?.items[0]

    const isFeatured = landingPage?.featuredReview?.slug === gameReview?.slug

    if (!gameReview) {
      return {
        notFound: true,
        revalidate: revalidateDuration,
      }
    }

    return {
      revalidate: revalidateDuration,
      props: {
        previewActive: !!preview,
        gameReview,
        isFeatured,
      },
    }
  } catch {
    return {
      notFound: true,
      revalidate: revalidateDuration,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dataPerLocale = await Promise.all(
        ['en-US'].map(locale => client.pageGameReviewCollection({ locale, limit: 100 })),
      )

  const paths = dataPerLocale
    .flatMap((data) =>
      data.pageGameReviewCollection?.items.map(gameReview =>
        gameReview?.slug
          ? {
              params: {
                slug: gameReview.slug,
              }
            }
          : undefined,
      ),
    )
    .filter(Boolean)

  return {
    paths,
    fallback: 'blocking',
  }
}

export default Page
