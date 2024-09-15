import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import { useState } from "react";
import Link from "next/link";
import CurrencyText from "./currency-text";
import { Sheets } from "@/utils/db/schema";
import { useUser } from "@clerk/nextjs";
import {
  createPaymentIntent,
  saveSheetToLibrary,
  updateTransaction,
} from "@/app/actions";

export default function PaymentForm({
  total,
  sheets,
  onSuccess,
}: {
  total: number;
  sheets: Pick<typeof Sheets.$inferSelect, "id" | "price">[];
  onSuccess: () => void;
}) {
  const { user } = useUser();
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe) return;
    if (!elements) return;
    if (!user) return;
    if (total <= 0) return;
    setIsPaying(true);

    const { error: elementsError } = await elements.submit();

    if (elementsError) {
      setIsPaying(false);
      return console.log(elementsError);
    }

    const intent = await createPaymentIntent(total * 100, sheets);

    const { error: paymentError } = await stripe?.confirmPayment({
      elements,
      clientSecret: intent.client_secret as string,
      redirect: "if_required",
      confirmParams: {
        receipt_email: user.emailAddresses[0].emailAddress,
        return_url: "http://localhost:3000/payment-success/",
      },
    });
    if (paymentError) {
      setIsPaying(false);
      await updateTransaction(intent.id, "failed");
      return console.log(paymentError);
    }
    await updateTransaction(intent.id, "succeeded");
    for (const sheet of sheets) {
      await (async () => {
        await saveSheetToLibrary(sheet.id, intent.id);
      })();
    }
    setIsPaying(false);
    onSuccess();
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
      {user ? (
        <>
          <LinkAuthenticationElement
            options={{
              defaultValues: {
                email: user.emailAddresses[0].emailAddress,
              },
            }}
          />
          <PaymentElement />
          <Button
            className="mt-auto mb-0"
            disabled={!stripe || !elements || isPaying || !user}
          >
            {isPaying ? (
              "Paying..."
            ) : (
              <>
                Pay
                <CurrencyText
                  className="ml-2 text-base sm:text-base md:text-base"
                  amount={total}
                />
              </>
            )}
          </Button>
        </>
      ) : (
        <Button className="mt-auto mb-0" asChild>
          <Link href={"/login"}>Log in to pay</Link>
        </Button>
      )}
    </form>
  );
}
