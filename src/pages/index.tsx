
import Image from "next/image";
import { GetStaticProps } from "next";
import { stripe } from "../lib/stripe";
import { HomeContainer, Product } from "../styles/pages/home";
import Head from "next/head";


import { useKeenSlider } from 'keen-slider/react'

import 'keen-slider/keen-slider.min.css'
import Stripe from "stripe";
import Link from "next/link";


interface HomeProps {
  products: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  }[]
}



export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    }
  })


  return (
    <>
    <Head>
      <title>Home | Ignite Shop</title>
    </Head>


    <HomeContainer ref={sliderRef} className="keen-slider">
      

      {products.map(product => {
        return (
          <Link key={product.id} href={`/product/${product.id}`} prefetch={false}>
            <Product className="keen-slider__slide"
            >
              <Image src={product.imageUrl} alt='' width={520} height={480}/>

              <footer>
                <strong>{product.name}</strong>
                <span>{new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(product.price)}</span>
              </footer>
            </Product>
          </Link>
        )
      })}

      

      
    </HomeContainer>
    </>
    
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price

    // O type script extá alegando que o price pode vir um "number | null" 
    // O primeiro motivo que explica isso é a config de expend do stripe
    // devemos ficar atento a algum póssivel erro!
    return {
      id: product.id, 
      name: product.name,
      imageUrl: product.images[0],
      price: price.unit_amount ? price.unit_amount / 100 : price.unit_amount,
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2,
  }
}