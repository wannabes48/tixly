import { AnimatedTicket } from "@/components/ui/ticket-confirmation-card";

export default function AnimatedTicketDemo() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-4 pt-20">
      <AnimatedTicket
        ticketId="0120034399434"
        amount={305.50}
        date={new Date("2025-06-19T10:15:00")}
        cardHolder="Liana80 Tudakova"
        last4Digits="8237"
        barcodeValue="28937261273650"
      />
    </div>
  );
}
