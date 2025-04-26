'use client';

import Feed from "@/components/Feed";
import Share from "@/components/Share";
import { makeRequest } from "../../../../axios";
import { useQuery } from "@tanstack/react-query";

interface IPost {
  id: number;
  post_desc: string;
  img?: string;
  username: string;
  userImg: string;
  created_at: string;
  userId: number;
}

function Main() {
  const { data: posts, isLoading, error } = useQuery<IPost[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await makeRequest.get('/post/');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="text-center mt-10 text-gray-500">Carregando posts...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Erro ao carregar posts.</div>;

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <Share />
        <Feed post={posts} />
      </div>
    </div>
  );
}

export default Main;
