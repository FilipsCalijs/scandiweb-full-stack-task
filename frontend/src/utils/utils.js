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
  