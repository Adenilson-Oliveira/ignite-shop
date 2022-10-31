import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Stripe from "stripe"
import { stripe } from "../../lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"


interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
  }
}

export default function Product({product}: ProductProps) {

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
            
        <button>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}







export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_MhLqM9vRQPcLhI' } },
    ],
    fallback: false
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
        description: product.description
  
        },
      },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}