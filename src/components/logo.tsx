import Image from "next/image";
import { PRODUCT_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Brand art ships a light-UI (black) and dark-UI (white) variant; `dark:` swaps them with no flash. */
export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  const height = Math.round((size * 716) / 862);
  return (
    <>
      <Image src="/brand/mark-light.png" alt="" width={size} height={height} unoptimized aria-hidden="true" className={cn("shrink-0 dark:hidden", className)} />
      <Image src="/brand/mark-dark.png" alt="" width={size} height={height} unoptimized aria-hidden="true" className={cn("hidden shrink-0 dark:block", className)} />
    </>
  );
}

export function Logo({ className, height = 22 }: { className?: string; height?: number }) {
  const style = { height };
  return (
    <span className={cn("flex items-center", className)}>
      <Image src="/brand/logo-light.png" alt={PRODUCT_NAME} width={113} height={22} unoptimized style={style} className="w-auto dark:hidden" />
      <Image src="/brand/logo-dark.png" alt={PRODUCT_NAME} width={113} height={22} unoptimized style={style} className="hidden w-auto dark:block" />
    </span>
  );
}
