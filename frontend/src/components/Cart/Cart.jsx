import React from "react"
import { ApolloConsumer, gql } from "@apollo/client"
import DisplayItems from "./DisplayItems"
import { getCartTotal } from "../../utils/utils"

const PLACE_ORDER = gql`
  mutation PlaceOrder($orders: [OrderInput!]!) {
    placeOrder(orders: $orders)
  }
`

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

  handlePlaceOrder = async (client) => {
    const { cartItems } = this.state
    const cartTotal = getCartTotal()
    
    if (!cartItems.length) {
      return
    }

    const orders = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      size: item.size || "",
      color: item.color || "",
      capacity: item.capacity || "",
    }))

    const orderData = {
      orderId: `order-${Date.now()}`,
      totalAmount: cartTotal,
      items: orders,
      createdAt: new Date().toISOString(),
    }

    console.log("🛒 Sending order via GraphQL:", orderData)

    try {
      const { data } = await client.mutate({
        mutation: PLACE_ORDER,
        variables: { orders },
      })

      if (data.placeOrder) {
        console.log("✅ Order successfully sent via GraphQL!")
        localStorage.removeItem("cartItems")
        
        this.setState({ 
          cartItemsCount: 0, 
          cartItems: [] 
        })
        
        this.props.toggleCart()
      } else {
        console.error("❌ Server responded with false:", data)
      }
    } catch (err) {
      console.error("❌ GraphQL mutation error:", err)
    }
  }

  checkCartOpen = () => {
    const isCartOpenFromStorage = JSON.parse(localStorage.getItem("isCartOpen")) || false
    
    if (isCartOpenFromStorage && !this.props.isCartOpen) {
      this.props.toggleCart()
      localStorage.setItem("isCartOpen", JSON.stringify(false))
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const newCount = this.getCartItemsCount()
      const newItems = this.getCartItems()
      const currentItemsString = JSON.stringify(this.state.cartItems)
      const newItemsString = JSON.stringify(newItems)
      
      if (newCount !== this.state.cartItemsCount || currentItemsString !== newItemsString) {
        this.setState({ 
          cartItemsCount: newCount, 
          cartItems: newItems 
        })
      }
      
      this.checkCartOpen()
    }, 500)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.cartItemsCount !== this.state.cartItemsCount) {
      this.setState({ cartItemsCount: this.getCartItemsCount() })
    }
    
    const isCartOpen = this.checkCartOpen()
    document.body.style.overflow = isCartOpen ? 'hidden' : 'auto'
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    document.body.style.overflow = 'auto'
  }

  render() {
    const { cartItemsCount, cartItems } = this.state
    const { isCartOpen, toggleCart } = this.props
    const cartTotal = getCartTotal()

    return (
      <>
        {isCartOpen && (
          <div
            className="fixed inset-0 bg-[#39374838] z-40"
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
                <span className="font-bold">MyBag</span>, {cartItemsCount}{" "}
                {cartItemsCount === 1 ? "Item" : "Items"}
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
                <ApolloConsumer>
                  {(client) => (
                    <button
                      disabled={cartItemsCount === 0}
                      onClick={() => this.handlePlaceOrder(client)}
                      className="bg-[#5ECE7B] disabled:bg-[#99dbab] w-[292px] h-[43px] text-white uppercase"
                    >
                      Place Order
                    </button>
                  )}
                </ApolloConsumer>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
}

export default Cart