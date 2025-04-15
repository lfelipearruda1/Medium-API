import Post from "./Post";
import { makeRequest } from "../../axios";
import Share from "./Share";
import { useQuery } from "@tanstack/react-query";

interface IPost {
  id: number;
  post_desc: string;
  img?: string;
  username: string;
  userImg: string;
  created_at: string;
}

function Feed() {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<IPost[]>({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("post/").then((res) => res.data.data),
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <Share />
      {isLoading ? (
        <span>Carregando...</span>
      ) : error ? (
        <div className="text-red-500 font-semibold">
          Erro ao carregar posts.
        </div>
      ) : (
        posts?.map((post) => <Post post={post} key={post.id} />)
      )}
    </div>
  );
}

export default Feed;
