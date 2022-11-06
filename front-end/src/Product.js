function Product(props) {
  let product = props.product;
  
  return (
    <p>{product.name}, {product.price} <button onClick={e => props.addToCart(product.id)}>Add to cart</button></p>
  )
}

export default Product;