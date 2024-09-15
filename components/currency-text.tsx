import { ClassNameValue } from "tailwind-merge";
import BrandedText from "./branded-text";

export default function CurrencyText({
  amount,
  className,
  branded = true,
}: {
  amount: number;
  className?: ClassNameValue;
  branded?: boolean;
}) {
  const moneyFormatter = Intl.NumberFormat("en-US", {
    currency: "USD",
    currencyDisplay: "symbol",
    currencySign: "standard",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (branded)
    return (
      <BrandedText
        className={className}
        text={String(moneyFormatter.format(amount))}
      />
    );
  return (
    <span className={className as string}>{moneyFormatter.format(amount)}</span>
  );
}
