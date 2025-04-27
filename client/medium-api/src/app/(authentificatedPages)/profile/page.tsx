"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../../../axios";
import { useSearchParams } from "next/navigation";
import Feed from "@/components/Feed";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

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

interface IFriendship {
  id: number;
  follower_id: number;
  followed_id: number;
}

function Profile() {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
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

  const friendshipQuery = useQuery<IFriendship[]>({
    queryKey: ["friendship", user?.id],
    queryFn: () =>
      makeRequest.get("friendship/?follower_id=" + user?.id).then((res) => res.data.data),
    enabled: !!user?.id,
  });

  const addMutation = useMutation({
    mutationFn: (follow: { follower_id: number | undefined; followed_id: number }) =>
      makeRequest.post("friendship/", follow),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship", user?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (unfollow: { follower_id: number | undefined; followed_id: number }) =>
      makeRequest.delete(`friendship/?follower_id=${unfollow.follower_id}&followed_id=${unfollow.followed_id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship", user?.id] });
    },
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

  const isFollowing = friendshipQuery.data?.some(
    (friendship) => friendship.followed_id === Number(id)
  );

  const handleFollow = () => {
    addMutation.mutate({ follower_id: user?.id, followed_id: Number(id) });
  };

  const handleUnfollow = () => {
    deleteMutation.mutate({ follower_id: user?.id, followed_id: Number(id) });
  };

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-xl">
        <div>
          <img
            src={bgImg}
            alt="Imagem de fundo do perfil"
            className="w-full h-48 object-cover rounded-t-md"
          />
        </div>

        <div className="flex items-center justify-between mt-4 px-4">
          <div className="flex items-center gap-3">
            <img
              src={userImg}
              alt="Imagem do usuário"
              className="w-24 h-24 rounded-full border-4 border-white object-cover -mt-12 shadow-md"
            />
            <span className="text-2xl font-semibold text-gray-800">
              {data.username}
            </span>
          </div>

          {user?.id !== Number(id) && (
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className={`text-sm font-semibold px-7 py-2 rounded-md transition whitespace-nowrap
                ${isFollowing
                  ? "border border-gray-300 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-500 text-white hover:bg-blue-600"}
              `}
            >
              {isFollowing ? "Deixar de seguir" : "Seguir"}
            </button>
          )}
        </div>

        <div className="mt-10">
          <Feed post={postQuery.data} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
