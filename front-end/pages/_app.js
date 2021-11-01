import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import '../styles/globals.css'
import Head from 'next/head'
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )


}

export default MyApp
