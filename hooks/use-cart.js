import React from "react";
import { initiateCheckout } from "../lib/payments";
import products from "../products.json";

const defaultCart = {
  products: {},
};

export const CartContext = React.createContext();

export const useCartState = () => {
  const [cart, updateCart] = React.useState(defaultCart);

  React.useEffect(() => {
    const prevCart = window.localStorage.getItem("spacejelly_cart");

    if (!prevCart) return;

    updateCart(JSON.parse(prevCart));
  }, []);

  React.useEffect(() => {
    const data = JSON.stringify(cart);

    window.localStorage.setItem("spacejelly_cart", data);
  }, [cart]);

  const cartItems = Object.keys(cart.products).map((key) => {
    const product = products.find(({ id }) => id === key);
    return {
      ...cart.products[key],
      pricePerUnit: product.price,
    };
  });

  const subtotal = cartItems.reduce(
    (acc, { pricePerUnit, quantity }) => acc + pricePerUnit * quantity,
    0
  );

  const quantity = cartItems.reduce((accumulator, { quantity }) => {
    return accumulator + quantity;
  }, 0);

  function addToCart({ id } = {}) {
    updateCart((prev) => {
      let cartState = { ...prev };

      if (cartState.products[id]) {
        cartState.products[id].quantity += 1;
      } else {
        cartState.products[id] = {
          id,
          quantity: 1,
        };
      }

      return cartState;
    });
  }

  function updateItem({ id, quantity } = {}) {
    updateCart((prev) => {
      let cartState = { ...prev };

      if (cartState.products[id]) {
        cartState.products[id].quantity = quantity;
      }

      return cartState;
    });
  }

  function checkout() {
    initiateCheckout({
      lineItems: cartItems.map((item) => ({
        price: item.id,
        quantity: item.quantity,
      })),
    });
  }

  return {
    cart,
    cartItems,
    subtotal,
    quantity,
    updateItem,
    addToCart,
    checkout,
  };
};

export const useCart = () => {
  const cart = React.useContext(CartContext);

  return cart;
};
