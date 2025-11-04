function addToCart(product) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
    const existingProduct = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.size === product.size &&
        item.color === product.color &&
        item.capacity === product.capacity
    );
  
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      const newProduct = {
        ...product,
        itemID: cartItems.length + 1,
      };
      cartItems.push(newProduct);
    }
  
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
  
  function getCartTotal() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
    const total = cartItems.reduce((accumulator, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return accumulator + price * quantity;
    }, 0);
  
    return total.toFixed(2);
  }
  

  function increase(id) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
    const item = cartItems.find((item) => item.itemID === id);
  
    if (item) {
      item.quantity += 1;
  
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }
  
  function decrease(id) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
    const item = cartItems.find((item) => item.itemID === id);
  
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else if (item && item.quantity === 1) {
      const updatedCartItems = cartItems.filter((item) => item.itemID !== id);
  
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  }
  

  export { addToCart, getCartTotal, increase, decrease, };
  

