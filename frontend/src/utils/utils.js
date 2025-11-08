function addToCart(product) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

  const keyMatch = (a, b) =>
    a.id === b.id &&
    (a.size || "") === (b.size || "") &&
    (a.color || "") === (b.color || "") &&
    (a.capacity || "") === (b.capacity || "")

  const existingProduct = cartItems.find((item) => keyMatch(item, product))

  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 1) + 1
  } else {
    cartItems.push({ ...product, quantity: 1 })
  }

  const merged = []
  for (const item of cartItems) {
    const duplicate = merged.find((m) => keyMatch(m, item))
    if (duplicate) {
      duplicate.quantity += item.quantity
    } else {
      merged.push({ ...item })
    }
  }

  localStorage.setItem("cartItems", JSON.stringify(merged))
}

function cleanCartDuplicates() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

  const keyMatch = (a, b) =>
    a.id === b.id &&
    (a.size || "") === (b.size || "") &&
    (a.color || "") === (b.color || "") &&
    (a.capacity || "") === (b.capacity || "")

  const merged = []
  for (const item of cartItems) {
    const duplicate = merged.find((m) => keyMatch(m, item))
    if (duplicate) {
      duplicate.quantity += item.quantity
    } else {
      merged.push({ ...item })
    }
  }

  localStorage.setItem("cartItems", JSON.stringify(merged))
}

function getCartTotal() {
  cleanCartDuplicates()
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  )
  return total.toFixed(2)
}

function increase(id) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
  const item = cartItems.find((i) => i.itemID === id)
  if (item) item.quantity += 1
  localStorage.setItem("cartItems", JSON.stringify(cartItems))
  cleanCartDuplicates()
}

function decrease(id) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
  const item = cartItems.find((i) => i.itemID === id)
  if (item) {
    if (item.quantity > 1) item.quantity -= 1
    else cartItems = cartItems.filter((i) => i.itemID !== id)
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems))
  cleanCartDuplicates()
}

export { addToCart, getCartTotal, increase, decrease }
