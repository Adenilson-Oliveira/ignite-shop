import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { SuccessContainer, ImageContainer} from "../styles/pages/success";

interface SuccessProps {
  custumerName: string
  product: {
    name: string
    imageUrl: string
  }
}

export default function Success({custumerName, product}: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        <meta name="robots" content="noindex" />
      </Head>


      <SuccessContainer>
        <h1>Compra efetuada!</h1>
        <ImageContainer>
          <Image src={product.imageUrl} width={130} height={145} alt=""/>
        </ImageContainer>

        <p>Uhuul <strong>{custumerName}</strong> , sua <strong>{product.name}</strong> já está a caminho da sua casa.</p>

        <Link href="/">
          Voltar ao Catalago
        </Link>
      </SuccessContainer>
    </>
    
  )
}


export const getServerSideProps: GetServerSideProps = async ({query}) => {
  

  if(!query.session_id) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const sessionId = String(query.session_id)

  const  session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  // console.log(session.line_items.data.price.product)

  const custumerName = session.customer_details?.name

  const product = session.line_items?.data[0].price?.product as Stripe.Product

  return {
    props: {
      custumerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      }
    }
  }
}