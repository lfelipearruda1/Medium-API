"use client"; 

import Feed from "@/components/Feed";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
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
    <main className="flex min-h-screen flex-col items-center bg-zinc-100">
      <Header />
      <div className="w-full flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Feed />
        </div>
      </div>
    </main>
  );
}