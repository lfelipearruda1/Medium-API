"use client"; 

import Header from "@/components/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let value = localStorage.getItem("medium-api:token");
    if (!value) {
      router.push("/login");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-zinc-100">
      <Header />
    </main>
  );
}
