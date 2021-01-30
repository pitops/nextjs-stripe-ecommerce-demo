import Nav from "../components/Nav/Nav";
import {CartContext, useCartState} from '../hooks/use-cart'

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const cart = useCartState()
  
  return (
    <CartContext.Provider value={cart}>
      <Nav />
      <Component {...pageProps} />
    </CartContext.Provider>
  );
}

export default MyApp;
