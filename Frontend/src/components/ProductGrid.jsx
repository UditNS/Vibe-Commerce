import React from 'react';

function ProductGrid({ products, onAddToCart, loading }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:shadow-black/50 transition transform hover:-translate-y-1 duration-200"
          >
            <div className="h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <span className="text-6xl">{product.emoji}</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onAddToCart(product._id)}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default ProductGrid;