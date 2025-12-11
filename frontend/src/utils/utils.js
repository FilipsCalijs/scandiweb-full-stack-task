function compareOtherAttributes(attrs1, attrs2) {
  if (!attrs1 && !attrs2) return true;
  if (!attrs1 || !attrs2) return false;
  if (attrs1.length !== attrs2.length) return false;
  
  return attrs1.every((attr1, index) => {
    const attr2 = attrs2[index];
    return attr1.id === attr2.id && attr1.selectedValue === attr2.selectedValue;
  });
}

function addToCart(product) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const existingProduct = cartItems.find((item) => {
    return (
      item.id === product.id &&
      item.size === product.size &&
      item.color === product.color &&
      item.capacity === product.capacity &&
      compareOtherAttributes(item.otherAttributes, product.otherAttributes)
    );
  });

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    const newProduct = {
      ...product,
      itemID: `${product.id}-${product.size || ""}-${product.color || ""}-${product.capacity || ""}-${Date.now()}`,
      quantity: 1,
    };
    cartItems.push(newProduct);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}


function cleanCartDuplicates() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const keyMatch = (a, b) => {
    return (
      a.id === b.id &&
      (a.size || "") === (b.size || "") &&
      (a.color || "") === (b.color || "") &&
      (a.capacity || "") === (b.capacity || "") &&
      compareOtherAttributes(a.otherAttributes, b.otherAttributes)
    );
  };

  const merged = [];

  for (const item of cartItems) {
    const duplicate = merged.find((m) => keyMatch(m, item));

    if (duplicate) {
      duplicate.quantity += item.quantity;
    } else {
      merged.push({ ...item });
    }
  }

  localStorage.setItem("cartItems", JSON.stringify(merged));
}


function getCartTotal() {
  cleanCartDuplicates();

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const total = cartItems.reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || 1);
  }, 0);

  return total.toFixed(2);
}


function increase(id) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const item = cartItems.find((i) => i.itemID === id);

  if (item) {
    item.quantity += 1;
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  cleanCartDuplicates();
}


function decrease(id) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const item = cartItems.find((i) => i.itemID === id);

  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cartItems = cartItems.filter((i) => i.itemID !== id);
    }
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  cleanCartDuplicates();
}


export { addToCart, getCartTotal, increase, decrease };
