// import React, { ReactNode } from "react"

interface MyAppProps {
  Component: any
  pageProps: any
}

export default function MyApp({ Component, pageProps }: MyAppProps) {
  return <Component {...pageProps} />
}