"use client";

import Feed from "@/components/Feed";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axios from "axios";

const makeRequest = axios.create({
  baseURL: "http://localhost:8001/api",
  withCredentials: true,
});

export default function Home() {
  const router = useRouter();

  const { data, error, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["refresh"],
    queryFn: async () => {
      const res = await makeRequest.get("auth/refresh");
      return res.data;
    },
    retry: false,
    refetchInterval: 60 * 50 * 1000,
  });

  useEffect(() => {
    if (!isLoading && isError) {
      console.error("Erro na autenticação:", error);
      router.push("/login");
    }
  }, [isLoading, isError, error, router]);

  useEffect(() => {
    if (isSuccess && data) {
      console.log("Usuário autenticado:", data);
    }
  }, [isSuccess, data, router]);

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
