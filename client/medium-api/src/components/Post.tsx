import { useEffect, useState } from "react";
import { FaPaperPlane, FaRegComment, FaThumbsUp } from "react-icons/fa";

interface IPost {
    id: number,
    post_desc: string,
    img?: string,
    username: string,
    userImg: string,
}

interface IUser {
    userImg: string;
    username: string;
}

function Post(props: { post: IPost }) {
    const { post_desc, img, username, userImg } = props.post;
    const [user, setUser] = useState<IUser | undefined>(undefined);

    useEffect(() => {
        let value = localStorage.getItem("medium-api:user");
        if (value) {
            setUser(JSON.parse(value));
        }
    }, []);

    return (
        <div className="w-1/3 bg-white rounded-lg p-4 shadow-md border border-gray-200">
            <header className="flex gap-2 pb-4 border-b items-center">
                <img
                    className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                    src={userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                    alt="Imagem do usuário que fez o post."
                />
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{username}</span>
                    <span className="text-xs text-gray-500">06/01/2023</span>
                </div>
            </header>
            {post_desc && (
                <div className="py-4 w-full text-gray-700">
                    <span>{post_desc}</span>
                </div>
            )}
            {img && img.trim() !== "" && (
                <img src={img} alt="Imagem do post." className="w-full h-auto rounded-md mt-2" />
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
    );
}

export default Post;
