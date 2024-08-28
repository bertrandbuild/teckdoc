import { ReactNode } from "react";
import { Leftbar } from "@/components/leftbar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Leftbar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
