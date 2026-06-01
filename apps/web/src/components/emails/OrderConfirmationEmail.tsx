import React from 'react';

interface OrderConfirmationEmailProps {
  orderRef: string;
  buyerName: string;
  matchName: string;
  stadium: string;
  date: string;
  quantity: number;
  category: string;
  totalPaid: string;
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderRef, buyerName, matchName, stadium, date, quantity, category, totalPaid
}) => {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1A1A1A', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1A3C5E', margin: 0 }}>Tixly</h1>
        <p style={{ color: '#E8532A', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>World Cup 2026</p>
      </div>
      
      <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '30px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ marginTop: 0, color: '#1A3C5E' }}>You're going to the World Cup!</h2>
        <p style={{ lineHeight: '1.6', color: '#4b5563' }}>Hi {buyerName},</p>
        <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
          Your order <strong>{orderRef}</strong> is confirmed. The seller has been notified and will transfer your tickets within 24–48 hours.
        </p>

        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', marginTop: '20px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Match Details</h3>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{matchName}</p>
          <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>{stadium}</p>
          <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>{date}</p>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', marginTop: '10px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6b7280' }}>Tickets</span>
            <strong>{quantity}x {category}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '10px', marginTop: '10px' }}>
            <span style={{ color: '#6b7280' }}>Total Paid</span>
            <strong style={{ color: '#E8532A' }}>{totalPaid}</strong>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '12px', marginTop: '30px' }}>
        <p>If you have any questions, reply to this email or contact our support team.</p>
        <p>© 2026 Tixly. All rights reserved.</p>
      </div>
    </div>
  );
};
