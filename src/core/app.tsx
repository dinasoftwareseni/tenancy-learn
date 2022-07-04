import React, { FC } from 'react'
import Router from './router'
import ErrorBoundary from '../components/hocs/error-boundary'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MediaStateProvider, NavStateProvider } from '@reapit/elements'
import { ReactQueryDevtools } from 'react-query/devtools'
import '@reapit/elements/dist/index.css'

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
})

const App: FC = () => (
  <ErrorBoundary>
    <QueryClientProvider client={reactQueryClient}>
      <NavStateProvider>
        <MediaStateProvider>
          <Router />
        </MediaStateProvider>
      </NavStateProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ErrorBoundary>
)

export default App
