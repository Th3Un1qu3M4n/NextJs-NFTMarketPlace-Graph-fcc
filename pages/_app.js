import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import Header from '../components/Header.js'
import { NotificationProvider } from 'web3uikit'

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_GRAPH_QUERY_URL,
})

function MyApp({ Component, pageProps }) {
  
  return (
    
  <MoralisProvider initializeOnMount={false}>
    <ApolloProvider client={client}>
      <NotificationProvider>
        <Header/>
        <Component {...pageProps} />
      </NotificationProvider>
    </ApolloProvider>
  </MoralisProvider>)
}

export default MyApp
