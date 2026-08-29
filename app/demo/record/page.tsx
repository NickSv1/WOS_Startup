"use client";

import { ProductDemo } from "@/components/demo/ProductDemo";

export default function DemoRecordPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#f4f4f5]">
      <ProductDemo mode="record" />
    </main>
  );
}
