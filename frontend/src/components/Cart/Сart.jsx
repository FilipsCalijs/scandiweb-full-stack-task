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

  getCartItemsCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
    return cartItems.length
  }

  getCartItems = () => {
    return (JSON.parse(localStorage.getItem("cartItems")) || []).reverse()
  }

  handlePlaceOrder = async () => {
    const { cartItems } = this.state
    const cartTotal = getCartTotal()
    if (!cartItems.length) return

    const orderData = {
      orderId: `order-${Date.now()}`,
      totalAmount: cartTotal,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        currency: item.currencySymbol,
        quantity: item.quantity,
        color: item.color || null,
        size: item.size || null,
        capacity: item.capacity || null,
        image: item.img || "",
      })),
      createdAt: new Date().toISOString(),
    }

    console.log("🛒 Sending order to server:", orderData)

    try {
      await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })
      console.log("✅ Order successfully sent!")
    } catch (err) {
      console.error("❌ Error sending order:", err)
    }

    localStorage.removeItem("cartItems")
    this.setState({ cartItemsCount: 0, cartItems: [] })
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
      <>
        {isCartOpen && (
          <div
            className="fixed left-0 right-0 top-20 bottom-0 bg-[#39374838] z-40"
            onClick={toggleCart}
          ></div>
        )}

        <div className="relative z-50">
          <div
            className={`${
              cartItemsCount === 0 ? "hidden" : ""
            } font-roboto w-5 h-5 rounded-full absolute top-[-10px] right-[-13px] flex justify-center items-center bg-[#1D1F22] text-white`}
          >
            {cartItemsCount}
          </div>

          <button
            data-testid="cart-btn"
            className="flex justify-center items-center cursor-pointer"
            onClick={toggleCart}
          >
            <img src="/cart.svg" alt="cart" />
          </button>

          {isCartOpen && (
            <div
              data-testid="cart-overlay"
              className="absolute right-[-40px] top-[49px] w-[325px] bg-white z-[45] shadow-lg"
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
      </>
    )
  }
}

export default Cart
