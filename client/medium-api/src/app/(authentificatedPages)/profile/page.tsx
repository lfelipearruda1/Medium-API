'use client';

import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../../axios";
import { useSearchParams } from "next/navigation";
import Feed from "@/components/Feed";

interface IPost {
  id: number;
  post_desc: string;
  img?: string;
  username: string;
  userImg: string;
  created_at: string;
  userId: number;
}

interface IUserProfile {
  username: string;
  userImg?: string | null;
  bgImg?: string | null;
}

function Profile() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const profileQuery = useQuery<IUserProfile>({
    queryKey: ['profile', id],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/get-user?id=${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const postQuery = useQuery<IPost[] | undefined>({
    queryKey: ["posts", id],
    queryFn: () =>
      makeRequest.get(`/post?id=${id}`).then((res) => res.data.data),
    enabled: !!id,
  });

  const { data, isLoading, error } = profileQuery;

  if (isLoading) return <div className="text-center mt-10 text-gray-500">Carregando perfil...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Erro ao carregar perfil.</div>;
  if (!data) return <div className="text-center mt-10 text-gray-500">Perfil não encontrado.</div>;

  const bgImg = data.bgImg?.trim()
    ? data.bgImg
    : "https://cdn.wallpapersafari.com/62/81/iU6oQ8.jpg";

  const userImg = data.userImg?.trim()
    ? data.userImg
    : "https://img.freepik.com/free-icon/user_318-159711.jpg";

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-xl">
        <div>
          <img
            src={bgImg}
            alt="Imagem de fundo do perfil"
            className="w-full h-48 object-cover rounded-t-md"
          />
          <div className="p-4 flex items-center gap-4 -mt-12">
            <img
              src={userImg}
              alt="Imagem do usuário"
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
            />
            <span className="text-xl font-semibold text-gray-800">{data.username}</span>
          </div>
        </div>

        <div className="mt-4">
          <Feed post={postQuery.data} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
