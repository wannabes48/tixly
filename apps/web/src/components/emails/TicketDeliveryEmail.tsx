import React from 'react';

interface TicketDeliveryEmailProps {
  orderRef: string;
  buyerName: string;
  matchName: string;
  stadium: string;
  date: string;
  quantity: number;
  category: string;
}

export const TicketDeliveryEmail: React.FC<TicketDeliveryEmailProps> = ({
  orderRef, buyerName, matchName, stadium, date, quantity, category
}) => {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1A1A1A', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1A3C5E', margin: 0 }}>Tixly</h1>
        <p style={{ color: '#E8532A', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>World Cup 2026</p>
      </div>
      
      <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '30px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ marginTop: 0, color: '#22863A' }}>Your tickets have arrived!</h2>
        <p style={{ lineHeight: '1.6', color: '#4b5563' }}>Hi {buyerName},</p>
        <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
          Great news! The seller has successfully transferred your tickets for order <strong>{orderRef}</strong>.
        </p>

        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', marginTop: '20px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Your Match</h3>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{matchName}</p>
          <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>{stadium}</p>
          <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>{date}</p>
          <p style={{ margin: '15px 0 5px 0', fontWeight: 'bold' }}>Seats ({quantity}x {category})</p>
          <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>Section: 104, Row: G</p>
        </div>

        <div style={{ background: '#EAF1F8', borderRadius: '8px', padding: '20px', marginTop: '20px', border: '1px solid #c2dcf2' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1A3C5E' }}>How to access your tickets</h3>
          <p style={{ lineHeight: '1.6', color: '#1A3C5E', fontSize: '14px', margin: 0 }}>
            Your official tickets have been attached to this email as a PDF. You can also download them to your Apple Wallet or Google Wallet using the links below.
            If required by the stadium, you will also receive an invitation from the <strong>FIFA Official Ticketing App</strong>.
          </p>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a href="#" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#E8532A', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              Download PDF Tickets
            </a>
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
