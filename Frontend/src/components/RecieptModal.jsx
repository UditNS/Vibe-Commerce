import React from 'react';
import { Download } from 'lucide-react';

function ReceiptModal({ receipt, onClose, onDownload }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-green-600">Order Confirmed!</h2>
          <p className="text-gray-600 mt-2">Order ID: {receipt.orderId}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-semibold">{receipt.customerName}</p>
            <p className="text-sm text-gray-600">{receipt.customerEmail}</p>
          </div>

          <div className="border-t pt-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Items</p>
            {receipt.items.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.name} x{item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-purple-600">${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            {new Date(receipt.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDownload}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;