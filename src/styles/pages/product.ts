import { styled } from ".."

export const ProductContainer = styled('main', {
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr',
  alignItems: 'stretch',
  gap: '4.5rem',

  maxWidth: 1180,
  margin: '0 auto',
  
})

export const ImageContainer = styled('div', {
  width: '100%',
  maxWidth: 576,
  height:  '656px',
  background: 'linear-gradient(180deg, #1ea483 0%, #7465d4 100%);',
  borderRadius: 8,
  padding: '0.25rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',


  img: {objectFit: 'cover'}
})

export const ProductDetails = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  // position: 'relative',

  h1: {
    marginTop: '2rem',
    fontSize: '$2xl',
    color: '$gray300',
  },

  span: {
    marginTop: '1rem',
    display: 'block',
    fontSize: '$2xl',
    color: '$green300',

  },

  p:{
    marginTop: '2.5rem',
    fontSize: '$md',
    lineHeight: 1.6,
    color: '$gray300'
  },

  button: {
    width: '100%',
    backgroundColor: '$green500',
    color: '$gray100',
    fontSize: '$md',
    fontWeight: 'bold',
    padding: '20px 0',
    borderRadius: 8,
    // position: 'absolute',
    // bottom: 0,
    marginTop: 'auto',
    border: 0,
    cursor: 'pointer',
    

    '&:hover': {
      background: '$green300',
      transition: '0.1ms'
    }
  }

})