import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react'
import type { AppProps } from 'next/app'
import { Urbanist } from 'next/font/google'
import './utils/globals.css'
import '@contentful/live-preview/style.css'

import { Layout } from '@src/components/templates/layout'

const urbanist = Urbanist({ subsets: ['latin'], variable: '--font-urbanist' })

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ContentfulLivePreviewProvider
      enableInspectorMode={pageProps.previewActive}
      enableLiveUpdates={pageProps.previewActive}
      locale='en-US'>
      <>
        <main className={`${urbanist.variable} font-sans`}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </main>
        <div id="portal" className={`${urbanist.variable} font-sans`} />
      </>
    </ContentfulLivePreviewProvider>
  )
}

export default App
