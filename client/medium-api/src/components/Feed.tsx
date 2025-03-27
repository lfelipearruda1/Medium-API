import { useEffect, useState } from "react";
import Post from "./Post";
import { makeRequest } from "../../axios";
import Share from "./Share";

interface IPost {
  id: number;
  post_desc: string;
  img?: string;
  username: string;
  userImg: string;
  created_at: string;
}

function Feed() {
  const [posts, setPosts] = useState<IPost[] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    makeRequest
      .get("post/")
      .then((res) => {
        setPosts(res.data.data);
      })
      .catch((err) => {
        console.error("Erro ao carregar posts:", err);
        if (err.response?.data?.msg) {
          setError(err.response.data.msg);
        } else {
          setError("Erro inesperado ao carregar os posts.");
        }
      });
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <Share />
      {error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : (
        posts?.map((post, id) => <Post post={post} key={id} />)
      )}
    </div>
  );
}

export default Feed;
