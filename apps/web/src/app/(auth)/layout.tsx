import React from "react";
import { PiBuilding } from "react-icons/pi";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-xs">
            <PiBuilding className="size-4" />
          </div>
          <span className="font-heading text-primary/90">Bloonsoo.com</span>
        </a>
        {children}
      </div>
    </div>
  );
}
