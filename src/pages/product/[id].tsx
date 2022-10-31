import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Stripe from "stripe"
import { stripe } from "../../lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"
import Router, { useRouter } from "next/router"
import axios from "axios"
import { useState } from "react"


interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    defaultPriceId: string;
  }
}

export default function Product({product}: ProductProps) {
  const [ isCreatingCheckoutSession, setIsCreatingCheckoutSession ] = useState(false)

  // se for redirecionar para um checkout transparente em nossa propia aplicação
  // passo 1: importar o useRouter do next
  // const router = useRouter()

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true)

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })
      
      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl

      // se for redirecionar para um checkout transparente em nossa propia aplicação
      // passo 2: utilizar o metodo push
      // router.push('/checkout')

    } catch (error) {
      // Conectar com uma ferramenta de observabilidade (Datadog / Sentry)
      setIsCreatingCheckoutSession(false)
      alert('Falha ao redirecionar ao checkout!')
    }
  }

  const { isFallback } = useRouter()

  if (isFallback) {
    return <p> ...loading</p>
  }

  return (
    <ProductContainer>
      <ImageContainer>
        <Image  src={product.imageUrl} width={480} height={520} alt=""/>
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>
          {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(product.price)}
        </span>
        
        <p>{product.description}</p>
            
        <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}







export const getStaticPaths: GetStaticPaths = async () => {
  // buscar os produtos mais vendidos ou acessados para não pesar o deployment

  return {
    paths: [
      { params: { id: 'prod_MhLqM9vRQPcLhI' } },
    ],
    fallback: true,
  }
}




export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  if(!params) {
    return {
      notFound: true // Caso não exista parametros, retorna um 404
    }
  }


  const productId = params.id


  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })


  const price = product.default_price as Stripe.Price



  return {
    props: {
      product: {
        id: product.id, 
        name: product.name,
        imageUrl: product.images[0],
        price: price.unit_amount ? price.unit_amount / 100 : price.unit_amount,
        description: product.description,
        defaultPriceId: price.id,
        },
      },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}