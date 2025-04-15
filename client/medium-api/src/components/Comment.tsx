import moment from "moment";
import "moment/locale/pt-br";

interface IComments {
    id: number;
    comment_desc: string;
    userImg: string;
    comment_user_id: number;
    username: string;
    post_id: number;
    created_at: string;
}

function Comment(props: { comment: IComments }) {
    const { comment_desc, userImg, username, created_at } = props.comment;

    return (
        <div className="flex items-start gap-3 mb-4">
            <img
                className="w-10 h-10 rounded-full border object-cover"
                src={userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                alt="Imagem do usuário que fez o comentário."
            />
            <div className="bg-gray-100 rounded-xl px-4 py-2 max-w-[80%]">
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-800">{username}</span>
                    <span className="text-sm text-gray-700">{comment_desc}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">{moment(created_at).fromNow()}</span>
            </div>
        </div>
    );
}

export default Comment;
