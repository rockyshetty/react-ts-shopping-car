import { ReactNode, createContext, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};
type CartItem = {
  id: number;
  quantity: number;
};
type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: () => number;
  cartItems: CartItem[];
};
const shoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(shoppingCartContext);
}

export function ShoppingCartProvider({ children }: Readonly<ShoppingCartProviderProps>) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", []);
  const [isOpen, setIsOpen] = useState(false);
  function cartQuantity() {
    return cartItems.reduce((quantity, item) => item.quantity + quantity, 0);
  }
  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function openCart() {
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }
  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (!currItems.find((item) => item.id === id)) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id: number) {
    setCartItems((currItems) => currItems.filter((item) => item.id !== id));
  }
  return (
    <shoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        openCart,
        closeCart,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />cons
    </shoppingCartContext.Provider>
  );
}
