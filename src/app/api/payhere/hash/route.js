import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { merchant_id, order_id, amount, currency } = body;
    
    // Ensure PAYHERE_MERCHANT_SECRET is set in your environment variables (.env.local)
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;
    
    if (!merchant_secret) {
        return NextResponse.json({ error: 'Merchant secret is missing' }, { status: 500 });
    }

    // 1. Hash the merchant secret using MD5 and convert to uppercase
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    
    // 2. Format the amount to 2 decimal places as required by PayHere
    const formattedAmount = parseFloat(amount).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '');
    
    // 3. Concatenate the fields: MerchantID + OrderID + Amount + Currency + HashedSecret
    const hashString = merchant_id + order_id + formattedAmount + currency + hashedSecret;
    
    // 4. Hash the concatenated string using MD5 and convert to uppercase
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
    
    return NextResponse.json({ hash });
  } catch (error) {
    console.error('Error generating hash:', error);
    return NextResponse.json({ error: 'Failed to generate hash' }, { status: 500 });
  }
}
