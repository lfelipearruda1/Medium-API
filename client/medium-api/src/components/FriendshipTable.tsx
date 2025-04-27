"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import Link from "next/link";

interface IFriendship {
  id: number;
  follower_id: number;
  followed_id: number;
  username: string;
  userImg: string;
}

function FriendShipTable() {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

  const { data, error } = useQuery<IFriendship[]>({
    queryKey: ["friendship", user?.id],
    queryFn: () =>
      makeRequest
        .get("friendship/?follower_id=" + user?.id)
        .then((res) => res.data.data),
    enabled: !!user?.id,
  });

  const mutation = useMutation({
    mutationFn: (unfollow: { follower_id: number | undefined; followed_id: number }) =>
      makeRequest.delete(`friendship/?follower_id=${unfollow.follower_id}&followed_id=${unfollow.followed_id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship", user?.id] });
    },
  });

  if (error) {
    console.error(error);
    return (
      <div className="text-red-500 text-sm">
        Erro ao carregar seguidores.
      </div>
    );
  }

  return (
    <div className="mr-4 text-gray-600 flex flex-col gap-6 mt-8">
      <span className="font-bold text-lg border-b pb-1">Seguindo</span>
      {data?.length ? (
        data.map((friendship) => (
          <div
            key={friendship.id}
            className="flex items-center justify-between gap-8"
          >
            <Link
              href={`/profile?id=${friendship.followed_id}`}
              className="flex items-center gap-3"
            >
              <img
                src={friendship.userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                alt="Imagem do perfil."
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-base font-semibold text-gray-800">
                {friendship.username}
              </span>
            </Link>
            <button
              onClick={() => mutation.mutate({
                follower_id: user?.id,
                followed_id: friendship.followed_id
              })}
              className="text-sm border border-gray-300 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-200 transition whitespace-nowrap"
            >
              Deixar de seguir
            </button>
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500 mt-2">Você ainda não segue ninguém.</div>
      )}
    </div>
  );
}

export default FriendShipTable;
