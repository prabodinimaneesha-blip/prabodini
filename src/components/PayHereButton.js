"use client";

import Script from 'next/script';
import { useState } from 'react';

export default function PayHereButton({ product, merchantId }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // 1. Generate the hash by calling our Next.js API route
      const response = await fetch('/api/payhere/hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: merchantId,
          order_id: product.orderId,
          amount: product.price,
          currency: 'LKR', // Set your default currency
        }),
      });

      const data = await response.json();

      if (!data.hash) {
        throw new Error('Failed to generate hash');
      }

      // 2. Setup PayHere payment parameters
      const payment = {
        sandbox: true, // Set to false for production
        merchant_id: merchantId,
        return_url: window.location.origin + '/checkout/success', // Update with your actual success URL
        cancel_url: window.location.origin + '/checkout/cancel',   // Update with your actual cancel URL
        notify_url: window.location.origin + '/api/payhere/notify', // Webhook for backend verification
        order_id: product.orderId,
        items: product.name,
        amount: product.price,
        currency: 'LKR',
        hash: data.hash, 
        
        // Customer Details (Replace with actual customer data from your state/form)
        first_name: product.customerFirstName || 'John',
        last_name: product.customerLastName || 'Doe',
        email: product.customerEmail || 'john@example.com',
        phone: product.customerPhone || '0771234567',
        address: product.customerAddress || 'No.1, Galle Road',
        city: product.customerCity || 'Colombo',
        country: 'Sri Lanka',
      };

      // 3. Define PayHere event handlers
      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. OrderID:" + orderId);
        // Add your logic here (e.g., redirecting to a success page, showing a success message)
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
        // Handle when the user closes the modal without completing payment
      };

      window.payhere.onError = function onError(error) {
        console.log("Error:" + error);
        // Handle payment errors
        alert('Payment failed. Please try again.');
      };

      // 4. Trigger PayHere Checkout Modal
      window.payhere.startPayment(payment);

    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred while initiating checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load PayHere Script from their CDN */}
      <Script 
        src="https://www.payhere.lk/lib/payhere.js" 
        strategy="lazyOnload" 
      />
      
      <button 
        onClick={handleCheckout} 
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Processing...' : 'Buy Now'}
      </button>
    </>
  );
}
