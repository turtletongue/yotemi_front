import { AppProps } from 'next/app';

import Layout from '../components/layout/layout.component';

import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
