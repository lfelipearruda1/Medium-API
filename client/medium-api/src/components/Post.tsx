import { useEffect, useState } from "react";
import { FaPaperPlane, FaRegComment, FaThumbsUp } from "react-icons/fa";

interface IPost {
    id: number,
    post_desc: string,
    img?: string,
    username: string,
    userImg: string,
    created_at: string,
}

interface IUser {
    userImg: string;
    username: string;
}

function Post(props: { post: IPost }) {
    const { post_desc, img, username, userImg, created_at } = props.post;
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let value = localStorage.getItem("medium-api:user");
        if (value) {
            setUser(JSON.parse(value));
        }
    }, []);

    let date = new Date(created_at);
    let formatedDate =
        String(date.getDate()).padStart(2, '0') + "/" +
        String(date.getMonth() + 1).padStart(2, '0') + "/" +
        date.getFullYear();

    return (
        <>
            <div className="w-full max-w-xl bg-white rounded-lg p-4 shadow-md border border-gray-200">
                <header className="flex gap-2 pb-4 border-b items-center">
                    <img
                        className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                        src={userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                        alt="Imagem do usuário que fez o post."
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{username}</span>
                        <span className="text-xs text-gray-500">{formatedDate}</span>
                    </div>
                </header>

                {post_desc && (
                    <div className="py-4 w-full text-gray-700">
                        <span>{post_desc}</span>
                    </div>
                )}

                {img && img.trim() !== "" && (
                    <img
                        src={`./upload/${img}`}
                        alt="Imagem do post."
                        className="w-full h-auto rounded-md mt-2 cursor-pointer transition hover:brightness-90"
                        onClick={() => setIsModalOpen(true)}
                    />
                )}

                <div className="mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaThumbsUp className="text-blue-500" /> <span className="text-sm">3</span>
                    </div>
                    <span className="text-sm text-gray-500">5 comentários</span>

                    <div className="flex justify-between mt-3 border-t pt-3">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition">
                            <FaThumbsUp /> Curtir
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition">
                            <FaRegComment /> Comentar
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mt-3 border-t pt-3">
                        <img
                            src={user?.userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                            alt="Imagem do perfil."
                            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                        />
                        <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Escreva um comentário..."
                        />
                        <button className="text-blue-500 hover:text-blue-700 transition">
                            <FaPaperPlane className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <img
                        src={img}
                        alt="Imagem em tela cheia"
                        className="max-w-[90%] max-h-[90%] rounded-lg cursor-pointer"
                        onClick={(e) => e.stopPropagation()} // impede o fechamento ao clicar na imagem
                    />
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-bold cursor-pointer"
                        onClick={() => setIsModalOpen(false)}
                    >
                        &times;
                    </button>
                </div>
            )}
        </>
    );
}

export default Post;
