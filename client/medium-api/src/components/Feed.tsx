"use client";

import Post from "./Post";

interface IPost {
  id: number;
  post_desc: string;
  img?: string;
  username: string;
  userImg: string;
  created_at: string;
  userId: number;
}

function Feed(props: { post: IPost[] | undefined }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {props.post ? (
        props.post.length > 0 ? (
          props.post.map((post) => <Post post={post} key={post.id} />)
        ) : (
          <div className="text-gray-500 font-semibold">Nenhum post encontrado.</div>
        )
      ) : (
        <div className="text-red-500 font-semibold">Erro ao carregar posts.</div>
      )}
    </div>
  );
}

export default Feed;
