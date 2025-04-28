"use client";

import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../../../axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UserContext } from "@/context/UserContext";

interface IUser {
  id: number;
  username: string;
  userImg?: string;
}

interface IPost {
  id: number;
  post_desc: string;
  img?: string;
  username: string;
  userImg: string;
  created_at: string;
  userId: number;
}

interface IFriendship {
  id: number;
  follower_id: number;
  followed_id: number;
}

function SearchPage() {
  const { user } = useContext(UserContext);
  const params = useSearchParams();
  const searchParam = params.get("params") || "";
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery<IUser[]>({
    queryKey: ["search-users", searchParam],
    queryFn: async () => {
      const res = await makeRequest.get(`search/search-users?params=${encodeURIComponent(searchParam)}`);
      return res.data;
    },
    enabled: !!searchParam,
  });

  const { data: friendships = [] } = useQuery<IFriendship[]>({
    queryKey: ["friendships", user?.id],
    queryFn: async () => {
      const res = await makeRequest.get(`friendship/?follower_id=${user?.id}`);
      return res.data.data;
    },
    enabled: !!user?.id,
  });

  const { data: allPosts = [] } = useQuery<IPost[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await makeRequest.get("/post/");
      return res.data.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: (follow: { follower_id: number | undefined; followed_id: number }) =>
      makeRequest.post("friendship/", follow),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendships", user?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (unfollow: { follower_id: number | undefined; followed_id: number }) =>
      makeRequest.delete(`friendship/?follower_id=${unfollow.follower_id}&followed_id=${unfollow.followed_id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendships", user?.id] });
    },
  });

  const isFollowing = (userId: number) => {
    return friendships?.some((friendship) => friendship.followed_id === userId);
  };

  const handleFollow = (followedId: number) => {
    addMutation.mutate({ follower_id: user?.id, followed_id: followedId });
  };

  const handleUnfollow = (followedId: number) => {
    deleteMutation.mutate({ follower_id: user?.id, followed_id: followedId });
  };

  const filteredPosts = allPosts.filter((post) => users.some((u) => u.id === post.userId));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Resultados para: "{searchParam}"</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Usuários</h2>
        {users.length ? (
          <div className="flex flex-col gap-4">
            {users.map((userFound) => (
              <div
                key={userFound.id}
                className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-100 transition"
              >
                <Link href={`/profile?id=${userFound.id}`} className="flex items-center gap-3">
                  <img
                    src={userFound.userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                    alt={userFound.username}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span className="text-gray-800">{userFound.username}</span>
                </Link>

                {user?.id !== userFound.id && (
                  isFollowing(userFound.id) ? (
                    <button
                      onClick={() => handleUnfollow(userFound.id)}
                      className="text-sm text-gray-700 border px-4 py-1 rounded-md hover:bg-gray-200"
                    >
                      Deixar de seguir
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(userFound.id)}
                      className="text-sm text-white bg-blue-500 px-4 py-1 rounded-md hover:bg-blue-600"
                    >
                      Seguir
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum usuário encontrado.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Posts</h2>
        {filteredPosts.length ? (
          <div className="flex flex-col gap-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-4 border rounded-md hover:shadow-md transition">
                <Link href={`/profile?id=${post.userId}`} className="flex items-center gap-3 mb-2">
                  <img
                    src={post.userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                    alt={post.username}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span className="text-gray-800">{post.username}</span>
                </Link>
                <p className="text-gray-700">{post.post_desc}</p>
                {post.img && (
                  <img
                    src={`/upload/${post.img}`}
                    alt="Imagem do post"
                    className="w-full h-auto mt-2 rounded-md object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum post encontrado.</p>
        )}
      </section>
    </div>
  );
}

export default SearchPage;
