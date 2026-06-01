import React from 'react';

interface InvoiceReceiptProps {
  orderRef: string;
  buyerName: string;
  buyerEmail: string;
  matchName: string;
  category: string;
  quantity: number;
  pricePerTicket: number;
  totalPaid: number;
  date: string | Date;
}

export const InvoiceReceipt = React.forwardRef<HTMLDivElement, InvoiceReceiptProps>(
  ({ orderRef, buyerName, buyerEmail, matchName, category, quantity, pricePerTicket, totalPaid, date }, ref) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }).format(new Date());

    return (
      <div 
        ref={ref} 
        className="w-[800px] bg-white text-brand-navy p-12 font-sans shrink-0 border border-gray-200"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-start border-b-2 border-brand-navy pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-brand-navy mb-1">Tixly</h1>
            <p className="text-brand-orange font-bold tracking-[0.2em] uppercase text-xs">Official Marketplace</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-300">Invoice</h2>
            <p className="text-sm font-semibold mt-2">Date: <span className="text-gray-600">{formattedDate}</span></p>
            <p className="text-sm font-semibold">Order Ref: <span className="text-brand-orange font-mono">{orderRef}</span></p>
          </div>
        </div>

        {/* Billing Info */}
        <div className="flex justify-between mb-12">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
            <p className="font-bold text-lg">{buyerName}</p>
            <p className="text-gray-600">{buyerEmail}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Status</h3>
            <div className="inline-block px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
              PAID IN FULL
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item Description</th>
              <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Qty</th>
              <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Unit Price</th>
              <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-6">
                <p className="font-bold text-lg mb-1">{matchName}</p>
                <p className="text-sm text-gray-500">Category: {category}</p>
              </td>
              <td className="py-6 text-center font-semibold">{quantity}</td>
              <td className="py-6 text-right font-semibold">${pricePerTicket.toFixed(2)}</td>
              <td className="py-6 text-right font-bold">${(pricePerTicket * quantity).toFixed(2)}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-4">
                <p className="font-semibold text-gray-600">Service & Protection Fees</p>
              </td>
              <td className="py-4 text-center text-gray-600">—</td>
              <td className="py-4 text-right text-gray-600">—</td>
              <td className="py-4 text-right font-semibold">${(totalPaid - (pricePerTicket * quantity)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-1/2">
            <div className="flex justify-between py-3 border-t-2 border-brand-navy">
              <span className="font-bold text-lg uppercase">Total Paid</span>
              <span className="font-black text-2xl text-brand-orange">${totalPaid.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="font-bold text-brand-navy mb-1">Thank you for your purchase!</p>
          <p className="text-sm text-gray-500">Your tickets will be delivered via email to {buyerEmail} within 24-48 hours.</p>
        </div>
      </div>
    );
  }
);

InvoiceReceipt.displayName = 'InvoiceReceipt';
