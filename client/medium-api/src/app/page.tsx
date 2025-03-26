"use client";

import Feed from "@/components/Feed";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { makeRequest } from "../../axios";

export default function Home() {
  const router = useRouter();

  const { data, error, isSuccess, isError } = useQuery({
    queryKey: ["refresh"],
    queryFn: () =>
      makeRequest.get("auth/refresh").then((res) => res.data),
    retry: false,
    refetchInterval: 60 * 50 * 1000,
  });

  useEffect(() => {
    if (isError) {
      console.log(error);
      router.push("/login");
    }
  }, [isError, error, router]);

  if (isSuccess) {
    console.log(data.msg);
  }

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Header />
      </div>

      <div className="flex pt-16">
        <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-[#1C2B3A] z-40">
          <Sidebar />
        </div>

        <div className="ml-64 w-full h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <Feed />
        </div>
      </div>
    </main>
  );
}
