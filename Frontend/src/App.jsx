import React, { useState, useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { ShoppingCart, X } from "lucide-react";
import store from "./store/store";
import { setCart, clearCart } from "./store/cartSlice";
import ProductGrid from "./components/ProductGrid";
import CartSidebar from "./components/CartSidebar";
import CheckoutForm from "./components/CheckoutForm";
import ReceiptModal from "./components/RecieptModal";
import axios from 'axios'

function App() {
  // API Base URL
  return (
    <Provider store={store}>
      <ShoppingApp />
    </Provider>
  );
}

function ShoppingApp() {
  const [products, setProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const API_URL = 'http://localhost:4000/api';

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`, { withCredentials: true });
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    }
  };

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, { withCredentials: true });
      dispatch(setCart(response.data));
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  };

  // Add item to cart
  const addToCart = async (productId) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/cart`, { productId, qty: 1 }, { withCredentials: true });
      await fetchCart();
      setLoading(false);
    } catch (err) {
      setError('Failed to add item to cart');
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, qty) => {
    if (qty < 1) return;
    try {
      await axios.put(`${API_URL}/cart/${itemId}`, { qty }, { withCredentials: true });
      await fetchCart();
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/${itemId}`, { withCredentials: true });
      await fetchCart();
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  // Handle checkout
  const handleCheckout = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/checkout`, {
        ...formData,
        cartItems: cart.items,
      }, { withCredentials: true });
      setReceipt(response.data);
      dispatch(clearCart());
      setShowCheckout(false);
      setShowCart(false);
      setLoading(false);
    } catch (err) {
      setError('Checkout failed');
      setLoading(false);
    }
  };

  // Download receipt as text file
  const downloadReceipt = () => {
    const receiptContent = `
VIBE COMMERCE
Purchase Receipt
=====================================

Order ID: ${receipt.orderId}
Date: ${new Date(receipt.timestamp).toLocaleString()}

Customer Details:
Name: ${receipt.customerName}
Email: ${receipt.customerEmail}

Items:
${receipt.items.map(item => `${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}`).join('\n')}

-------------------------------------
Total: $${receipt.total.toFixed(2)}

Thank you for shopping with Vibe Commerce!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receipt.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r  from-purple-600  to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vibe Commerce</h1>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 hover:bg-white/20 rounded-lg transition"
          >
            <ShoppingCart size={28} />
            {cart.items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.items.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <ProductGrid
        products={products}
        onAddToCart={addToCart}
        loading={loading}
      />

      {/* Cart Sidebar */}
      {showCart && (
        <CartSidebar
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={() => setShowCheckout(true)}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutForm
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckout}
          loading={loading}
        />
      )}

      {/* Receipt Modal */}
      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={() => setReceipt(null)}
          onDownload={downloadReceipt}
        />
      )}
    </div>
  );
}

export default App;