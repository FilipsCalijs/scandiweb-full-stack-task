import React from "react";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItemsCount: this.getCartItemsCount(),
      cartItems: this.getCartItems(),
    };
  }

  handlePlaceOrder = () => {
    localStorage.removeItem("cartItems");
    this.setState({ cartItemsCount: 0, cartItems: [] });
  };

  getCartItemsCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return cartItems.length;
  };

  getCartItems = () => {
    return (JSON.parse(localStorage.getItem("cartItems")) || []).reverse();
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      const newCount = this.getCartItemsCount();
      const newItems = this.getCartItems();

      const currentItemsString = JSON.stringify(this.state.cartItems);
      const newItemsString = JSON.stringify(newItems);

      if (
        newCount !== this.state.cartItemsCount ||
        currentItemsString !== newItemsString
      ) {
        this.setState({ cartItemsCount: newCount, cartItems: newItems });
      }
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { cartItemsCount } = this.state;
    const { isCartOpen, toggleCart } = this.props;

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
        </button>

        {isCartOpen && (
          <div
            data-testid="cart-overlay"
            className="absolute right-[-40px] top-[49px] w-[325px] bg-white z-50"
          >
            <div className="m-4">
              <span className="font-bold">MyBag</span>, {cartItemsCount} items
            </div>

            <div className="m-4 mt-8 font-medium font-roboto flex justify-between">
              <span>Total</span> <span>$0.00</span>
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
    );
  }
}

export default Cart;
