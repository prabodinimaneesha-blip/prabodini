import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // PayHere sends the webhook notification as URL Encoded Form Data (application/x-www-form-urlencoded)
    const formData = await request.formData();
    
    const merchant_id = formData.get('merchant_id');
    const order_id = formData.get('order_id');
    const payment_id = formData.get('payment_id');
    const payhere_amount = formData.get('payhere_amount');
    const payhere_currency = formData.get('payhere_currency');
    const status_code = formData.get('status_code');
    const md5sig = formData.get('md5sig');

    // Ensure PAYHERE_MERCHANT_SECRET is set in your environment variables (.env.local)
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchant_secret) {
        console.error('Merchant secret is missing from environment variables');
        return new NextResponse('Internal Server Error', { status: 500 });
    }

    // 1. Hash the merchant secret using MD5 and convert to uppercase
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();

    // 2. Concatenate fields to verify the PayHere signature
    // The formula is: merchant_id + order_id + payhere_amount + payhere_currency + status_code + uppercase_md5(merchant_secret)
    const hashString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;

    // 3. Hash the concatenated string using MD5 and convert to uppercase
    const localMd5sig = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    // 4. Validate the signature to ensure the request is genuinely from PayHere
    if (localMd5sig === md5sig) {
        // Initialize Firestore references
        const { db } = await import('../../../../../firebase');
        const { doc, updateDoc } = await import('firebase/firestore');
        
        // Signature is valid
        if (status_code === '2') {
            // Payment Success
            console.log(`Payment successful for order: ${order_id}, Payment ID: ${payment_id}`);
            
            try {
                // Update your Firestore database to mark the order as PAID
                // Assuming you have an 'orders' collection where the document ID matches the order_id
                const orderRef = doc(db, 'orders', order_id);
                await updateDoc(orderRef, {
                    status: 'PAID',
                    paymentId: payment_id,
                    paidAt: new Date().toISOString()
                });
                console.log('Order status updated in database successfully.');
            } catch (dbError) {
                console.error('Error updating database:', dbError);
                // We still return 200 to PayHere so they don't retry, but we log the error
            }
            
        } else if (status_code === '0') {
            console.log(`Payment pending for order: ${order_id}`);
        } else if (status_code === '-1') {
            console.log(`Payment canceled for order: ${order_id}`);
        } else if (status_code === '-2') {
            console.log(`Payment failed for order: ${order_id}`);
        } else if (status_code === '-3') {
            console.log(`Payment charged back for order: ${order_id}`);
        }

        // PayHere expects a 200 OK status to confirm the notification was received successfully
        return new NextResponse('OK', { status: 200 });
    } else {
        // Invalid signature (potential fraud attempt)
        console.error('PayHere Webhook: MD5 Signature mismatch!');
        return new NextResponse('Invalid signature', { status: 400 });
    }
    
  } catch (error) {
    console.error('PayHere Webhook Error:', error);
    return new NextResponse('Webhook Error', { status: 500 });
  }
}
