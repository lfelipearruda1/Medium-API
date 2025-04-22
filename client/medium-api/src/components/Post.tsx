import { useEffect, useState } from "react";
import { FaPaperPlane, FaRegComment, FaThumbsUp } from "react-icons/fa";
import moment from "moment";
import 'moment/locale/pt-br';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Comment from "./Comment";

interface IPost {
    id: number;
    post_desc: string;
    img?: string;
    username: string;
    userImg: string;
    created_at: string;
}

interface IUser {
    id: number;
    userImg: string;
    username: string;
}

interface IComments {
    id: number;
    comment_desc: string;
    userImg: string;
    comment_user_id: number;
    username: string;
    post_id: number;
    created_at: string;
}

interface ILikes {
    id: number;
    likes_user_id: number;
    username: string;
    likes_post_id: number;
}

interface ICreateComment {
    comment_desc: string;
    comment_user_id: number | undefined;
    post_id: number;
}

function Post(props: { post: IPost }) {
    const { post_desc, img, username, userImg, created_at, id } = props.post;
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showCommentsBox, setShowCommentsBox] = useState(false);
    const [liked, setLiked] = useState(false);
    const [comment_desc, setComment_desc] = useState('');
    const [modalCommentDesc, setModalCommentDesc] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        const storedUser = localStorage.getItem("medium-api:user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // LIKES QUERY
    
    const likesQuery = useQuery<ILikes[] | undefined>({
        queryKey: ['likes', id],
        queryFn: () => makeRequest.get('likes/?likes_post_id=' + id).then((res) => {
            res.data.data.map((like:ILikes)=>{
                if (like.likes_user_id == user?.id){
                    return setLiked(true)
                }
                else{
                    setLiked(false);
                }
            })
            return res.data.data;
        }),
        enabled: !!id
    });

    if (likesQuery.error){
        console.log(likesQuery.error);
    }

    const likesMutation = useMutation({
        mutationFn: async (newLikes: {}) => {
            if(liked){
                return await makeRequest.delete(`likes/?likes_post_id=${id}&likes_user_id=${user?.id}`).then((res) => res.data);
            } else{
                return await makeRequest.post("likes/", newLikes).then((res) => res.data);
            }

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['likes', id] });
        }
    });

    const shareLikes = () => {
        if (!comment_desc.trim()) return;
        likesMutation.mutate({
            likes_user_id: user?.id,
            likes_post_id: id
        });
    };


    // COMMENTS QUERY

    const commentQuery = useQuery<IComments[] | undefined>({
        queryKey: ['comments', id],
        queryFn: () => makeRequest.get('comment/?post_id=' + id).then((res) => res.data.data),
        enabled: !!id
    });

    if (commentQuery.error){
        console.log(commentQuery.error);
    }

    const commentsMutation = useMutation({
        mutationFn: async (newComment: ICreateComment) => {
            return await makeRequest.post("comment/", newComment).then((res) => res.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] });
        }
    });

    const shareComment = () => {
        if (!comment_desc.trim()) return;
        commentsMutation.mutate({
            comment_desc,
            comment_user_id: user?.id,
            post_id: id
        });
        setComment_desc('');
    };

    const shareModalComment = () => {
        if (!modalCommentDesc.trim()) return;
        commentsMutation.mutate({
            comment_desc: modalCommentDesc,
            comment_user_id: user?.id,
            post_id: id
        });
        setModalCommentDesc('');
    };

    return (
        <>
            <div className="w-full max-w-xl bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <header className="flex gap-3 pb-4 border-b items-center">
                    <img
                        className="w-10 h-10 rounded-full border object-cover"
                        src={userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                        alt="Imagem do usuário que fez o post."
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{username}</span>
                        <span className="text-xs text-gray-400">{moment(created_at).fromNow()}</span>
                    </div>
                </header>

                {post_desc && (
                    <p className="py-4 text-gray-800 text-base">{post_desc}</p>
                )}

                {img && img.trim() !== "" && (
                    <img
                        src={`/upload/${img}`}
                        alt="Imagem do post"
                        className="w-full h-auto rounded-md mb-2 cursor-pointer transition hover:brightness-95"
                        onClick={() => setIsModalOpen(true)}
                    />
                )}

                <hr className="border-t border-gray-200 my-3" />

                <div className="flex items-center justify-between text-sm text-gray-500 mt-1 mb-2 px-1">
                    <div className="flex items-center gap-1">
                        <FaThumbsUp className="text-blue-500 w-4 h-4" />
                        <span>36 mil</span>
                    </div>
                    {commentQuery.data && commentQuery.data.length > 0 && (
                        <span>{commentQuery.data.length} {commentQuery.data.length === 1 ? 'comentário' : 'comentários'}</span>
                    )}
                </div>

                <hr className="border-t border-gray-200 my-2" />

                <div className="flex justify-around text-gray-600 text-sm font-medium">
                    <button className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 transition w-full justify-center">
                        <FaThumbsUp className="w-4 h-4" />
                        Curtir
                    </button>
                    <button
                        className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 transition w-full justify-center"
                        onClick={() => setShowCommentsBox(true)}
                    >
                        <FaRegComment className="w-4 h-4" />
                        Comentários
                    </button>
                </div>

                <hr className="border-t border-gray-200 my-2" />

                <div className="flex items-center gap-2 mt-2">
                    <img
                        src={user?.userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                        alt="Perfil"
                        className="w-9 h-9 rounded-full object-cover border"
                    />
                    <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Escreva um comentário..."
                        value={comment_desc}
                        onChange={(e) => setComment_desc(e.target.value)}
                    />
                    <button className="text-blue-500 hover:text-blue-700 transition" onClick={shareComment}>
                        <FaPaperPlane className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="relative w-[95vw] max-h-[90vh] flex justify-center items-start"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={`/upload/${img}`}
                            alt="Imagem em tela cheia"
                            className="w-full h-auto max-h-[90vh] rounded-md object-contain shadow-lg"
                        />
                        <button
                            className="absolute top-3 right-3 text-white text-3xl font-bold hover:text-gray-300 transition z-20"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}


            {showCommentsBox && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
                    onClick={() => setShowCommentsBox(false)}
                >
                    <div
                        className="bg-white w-full max-w-lg h-[80vh] rounded-xl shadow-lg border border-gray-200 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Comentários</h2>
                            <button
                                className="text-xl font-bold text-gray-500 hover:text-gray-700"
                                onClick={() => setShowCommentsBox(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {commentQuery.data?.length ? (
                                commentQuery.data.map((comment) => (
                                    <Comment key={comment.id} comment={comment} />
                                ))
                            ) : (
                                <p className="text-gray-500">Nenhum comentário ainda.</p>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t flex items-center gap-2">
                            <img
                                src={user?.userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                                alt="Perfil"
                                className="w-9 h-9 rounded-full object-cover border"
                            />
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Escreva um comentário..."
                                value={modalCommentDesc}
                                onChange={(e) => setModalCommentDesc(e.target.value)}
                            />
                            <button className="text-blue-500 hover:text-blue-700 transition" onClick={shareModalComment}>
                                <FaPaperPlane className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Post;
