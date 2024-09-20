"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { useCartStore } from "@/store";
import { CheckCircle, CreditCard, ShoppingCart } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "@/utils/stripe";
import { useContext } from "react";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { Progress } from "../ui/progress";
import { motion } from "framer-motion";
import CurrencyText from "../currency-text";
import PaymentForm from "../payment-form";
import { UserDataContext } from "../providers/user-data-provider";
import CartItem from "./cart-item";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
const stripe = getStripe();
export default function CartDrawer() {
  const { userTransactions, arrangerData } = useContext(UserDataContext);
  const cart = useCartStore();
  const library = userTransactions?.flatMap((item) => item.library);
  // This code filters the cart items to exclude sheets that the user already owns
  const filteredSheets = cart.cart.filter((item) => {
    // Check if the item has a valid sheets.id
    const hasValidId = item.sheets.id;

    // Check if the user doesn't already own this sheet
    const isNotOwned = !library?.some(
      (trans) => trans.sheet?.id === item.sheets.id
    );
    if (!isNotOwned) cart.removeToCart(item);

    const notTheArranger = arrangerData?.id !== item.arrangers_pb_data.id;

    if (!notTheArranger) cart.removeToCart(item);

    // Only include items that have a valid ID and are not already owned
    return hasValidId && isNotOwned && notTheArranger;
  });

  const total = filteredSheets.reduce((acc, item) => {
    return acc + item.sheets.price;
  }, 0);

  return (
    <Sheet onOpenChange={() => cart.setState("cart")}>
      <SheetTrigger asChild>
        <Button
          className="relative rounded-full"
          variant={"ghost"}
          size={"icon"}
        >
          <ShoppingCart size={16} />
          {filteredSheets.length !== 0 ? (
            <div className="absolute top-0 right-1 text-red-500 font-black">
              <p className="text-xs">{filteredSheets.length}</p>
            </div>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="">
        <div className="flex flex-col max-w-[500px] mx-auto h-[75dvh]">
          <SheetHeader className="p-4">
            {cart.state !== "cart" && (
              <MDiv key={"header-!cart"} className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <Button
                    className="rounded-full"
                    size={"icon"}
                    onClick={() => cart.setState("cart")}
                  >
                    <ShoppingCart size={16} />
                  </Button>
                  <Button
                    className="rounded-full"
                    size={"icon"}
                    onClick={() => cart.setState("checkout")}
                  >
                    <CreditCard size={16} className="size-5" />
                  </Button>
                  <Button className="rounded-full" size={"icon"}>
                    <CheckCircle />
                  </Button>
                </div>
                <Progress
                  value={
                    (cart.state === "checkout" && 50) ||
                    (cart.state === "success" && 100) ||
                    0
                  }
                  className="duration-1000"
                />
              </MDiv>
            )}
            {cart.state === "cart" && (
              <MDiv key={"header-cart"}>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart size={16} />
                  <p>Your cart</p>
                </SheetTitle>
                <SheetDescription>
                  There are currently {cart.cart.length} sheets on your cart
                </SheetDescription>
              </MDiv>
            )}
            {cart.state === "checkout" && (
              <MDiv key={"header-checkout"}>
                <SheetTitle className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <p>Payment</p>
                </SheetTitle>
                <SheetDescription>
                  Please fill your details to proceed
                </SheetDescription>
              </MDiv>
            )}
          </SheetHeader>
          <div className="overflow-y-auto overflow-x-hidden flex p-4 flex-1">
            {cart.state === "cart" && (
              <MDiv key="body-cart" className="flex flex-col flex-1 gap-3">
                <ScrollArea>
                  <div className="flex-col flex gap-4 overflow-auto">
                    {filteredSheets.map((sheet) => {
                      return (
                        <CartItem
                          key={sheet.sheets.id}
                          sheet={sheet}
                          remove={() => cart.removeToCart(sheet)}
                        />
                      );
                    })}
                  </div>
                </ScrollArea>
                <div className="mb-0 mt-auto flex flex-col gap-4 ">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total price:
                    </p>
                    <CurrencyText branded={true} amount={total} />
                  </div>
                  <Button
                    disabled={total === 0}
                    className="disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => cart.setState("checkout")}
                  >
                    Check out
                  </Button>
                </div>
              </MDiv>
            )}
            {cart.state === "checkout" && (
              <MDiv
                key={"body-checkout"}
                className="flex flex-col flex-1 gap-3"
              >
                <Elements
                  stripe={stripe}
                  options={{
                    mode: "payment",
                    currency: "usd",
                    appearance: {
                      theme: "flat",
                      labels: "floating",
                    },
                    amount: total * 100,
                  }}
                >
                  <PaymentForm
                    total={total}
                    sheets={filteredSheets.map((sheet) => ({
                      id: sheet.sheets.id,
                      price: sheet.sheets.price,
                      arranger_id: sheet.arrangers_pb_data.id,
                    }))}
                  />
                </Elements>
                <Button onClick={() => cart.setState("cart")}>
                  Back to cart
                </Button>
              </MDiv>
            )}
            {cart.state === "success" && (
              <MDiv
                key={"body-success"}
                className="flex flex-col gap-4 items-center justify-center flex-1"
              >
                <CheckCircle className="size-12 mx-auto" />
                <p>Thank you for purchasing!</p>
                <Link href={"/library"}>
                  <SheetClose>
                    <Button onClick={() => cart.setState("cart")}>
                      View Library
                    </Button>
                  </SheetClose>
                </Link>
                <Button onClick={() => cart.setState("cart")}>
                  Back to cart
                </Button>
              </MDiv>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MDiv({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassNameValue;
}) {
  return (
    <motion.div
      initial={{ x: -50 }}
      animate={{ x: 0 }}
      exit={{ x: 50 }}
      className={cn("", className)}
    >
      {children}
    </motion.div>
  );
}
