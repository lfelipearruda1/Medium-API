import { UserContext } from "@/context/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaUserFriends } from "react-icons/fa";
import { TbPhoto } from "react-icons/tb";
import { makeRequest } from "../../axios";

function Share() {
    const { user } = useContext(UserContext);
    const [post_desc, setDesc] = useState('');
    const [postImg, setPostImg] = useState<string | null>(null);
    const [img, setImg] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (img) {
            const objectUrl = URL.createObjectURL(img);
            setPostImg(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPostImg(null);
        }
    }, [img]);

    const mutation = useMutation({
        mutationFn: async (newPost: {}) => {
            await makeRequest.post("post/", newPost).then((res) => {
                return res.data;
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const upload = async () => {
        try {
            const formData = new FormData();
            img && formData.append('file', img);
            const res = await makeRequest.post('upload/', formData);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const sharePost = async () => {
        let imgUrl = '';
        if (img) {
            imgUrl = await upload();
        }
        mutation.mutate({ post_desc, img: imgUrl, userId: user?.id });
        setDesc('');
        setImg(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full max-w-xl bg-white rounded-xl p-5 shadow-md flex flex-col gap-4 border border-gray-100">
            {postImg && <img className="rounded-lg" src={postImg} alt="Imagem do post." />}
            <div className="flex items-start gap-3">
                <img
                    src={user?.userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                    alt="Imagem do perfil."
                    className="w-12 h-12 rounded-full border border-gray-300 object-cover"
                />
                <div className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        value={post_desc}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={`No que você está pensando, ${user?.username}?`}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                    <button className="text-blue-500 hover:text-blue-700 transition" onClick={sharePost}>
                        <FaPaperPlane className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex justify-around border-t pt-3 text-base text-gray-600">
                <input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    id="img"
                    onChange={(e) => e.target.files && setImg(e.target.files[0])}
                />
                <label htmlFor="img" className="flex cursor-pointer">
                    <TbPhoto className="text-2xl" /> Adicionar Imagem
                </label>
                <button className="flex items-center gap-2 hover:text-blue-500 transition py-2 px-4">
                    <FaUserFriends className="text-2xl" /> Marcar Amigo
                </button>
            </div>
        </div>
    );
}

export default Share;
