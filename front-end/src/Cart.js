import axios from 'axios'

function Cart(props) {
  const decrementItemCount = async(item) => {
    try {
      let newQuantity = item.quantity - 1;
      if (newQuantity === 0) {
        removeFromCart(item);
        return;
      }
      await axios.put(`/api/cart/${item.id}/${newQuantity}`);
      props.setUpdate(true);
    } catch (error) {
      props.setError("Error occurred decrementing item count: " + error);
    }
  }
  const incrementItemCount = async(item) => {
    try {
      let newQuantity = item.quantity + 1;
      await axios.put(`/api/cart/${item.id}/${newQuantity}`);
      props.setUpdate(true);
    } catch (error) {
      props.setError("Error occurred incrementing item count: " + error);
    }
  }
  const removeFromCart = async(item) => {
    try {
      await axios.delete(`/api/cart/${item.id}`)
      props.setUpdate(true);
    } catch (error) {
      props.setError("Error occurred removing item: " + error);
    }
  }

  return (
    <div className="cart-list">
      {props.cart.map(item => (
        <p key={item.id}>{props.idToName(item.id)}, {item.quantity}
          <button onClick={e => decrementItemCount(item)}>-</button>
          <button onClick={e => incrementItemCount(item)}>+</button>
          <button onClick={e => removeFromCart(item)}>Remove from cart</button>
        </p>
      ))}
    </div>
  )
}

export default Cart;