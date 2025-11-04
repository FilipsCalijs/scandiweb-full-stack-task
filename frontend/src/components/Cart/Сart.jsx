import React from "react"
import DisplayItems from "./DisplayItems"
import { getCartTotal } from "../../utils/utils"

class Cart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cartItemsCount: this.getCartItemsCount(),
      cartItems: this.getCartItems(),
    }
  }

// just immitation of sending data to server
  handlePlaceOrder = () => {
    const { cartItems } = this.state
    const cartTotal = getCartTotal()

    if (!cartItems.length) {
      console.warn("Cart is empty — nothing to send.")
      return
    }

    console.log("Send data to server (imitation):")
    console.table(
      cartItems.map((item) => ({
        ID: item.id,
        Name: item.name,
        Quantity: item.quantity,
        Color: item.color || "—",
        Size: item.size || "—",
        Capacity: item.capacity || "—",
        Price: `$${item.price}`,
        TotalItem: `$${(item.price * item.quantity).toFixed(2)}`,
      }))
    )
    console.log(`💰 Total order sum: $${cartTotal}`)
    console.log("✅ Order successfully 'sent' to server (simulation)")

    // очистка корзины
    localStorage.removeItem("cartItems")
    this.setState({ cartItemsCount: 0, cartItems: [] })
  }

  getCartItemsCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
    return cartItems.length
  }

  getCartItems = () => {
    return (JSON.parse(localStorage.getItem("cartItems")) || []).reverse()
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const newCount = this.getCartItemsCount()
      const newItems = this.getCartItems()

      const currentItemsString = JSON.stringify(this.state.cartItems)
      const newItemsString = JSON.stringify(newItems)

      if (
        newCount !== this.state.cartItemsCount ||
        currentItemsString !== newItemsString
      ) {
        this.setState({ cartItemsCount: newCount, cartItems: newItems })
      }
    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { cartItemsCount, cartItems } = this.state
    const { isCartOpen, toggleCart } = this.props
    const cartTotal = getCartTotal()

    return (
      <div className="relative">
        <div
          className={`${
            cartItemsCount === 0 ? "hidden" : ""
          } font-roboto w-5 h-5 rounded-full absolute top-[-10px] right-[-13px] flex justify-center items-center bg-[#1D1F22] text-white`}
        >
          {cartItemsCount}
        </div>

        <button
          data-testid="cart-btn"
          className="flex justify-center items-center cursor-pointer z-50"
          onClick={toggleCart}
        >
          <img src="/cart.svg" alt="cart" />
          {/* reminder for me - add svg img */}
        </button>

        {isCartOpen && (
          <div
            data-testid="cart-overlay"
            className="absolute right-[-40px] top-[49px] w-[325px] bg-white z-50"
          >
            <div className="m-4">
              <span className="font-bold">MyBag</span>, {cartItemsCount} items
            </div>

            <DisplayItems cartItems={cartItems} />

            <div
              data-testid="cart-total"
              className="m-4 mt-8 font-medium font-roboto flex justify-between"
            >
              <span>Total</span>
              <span>${cartTotal}</span>
            </div>

            <div className="m-4 mt-8">
              <button
                disabled={cartItemsCount === 0}
                onClick={this.handlePlaceOrder}
                className="bg-[#5ECE7B] disabled:bg-[#99dbab] w-[292px] h-[43px] text-white uppercase"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Cart
