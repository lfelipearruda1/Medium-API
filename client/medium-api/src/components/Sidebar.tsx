import Link from "next/link";
import { FaAlignLeft, FaUserFriends } from "react-icons/fa";
import { useEffect, useState } from "react";

interface IUser {
  userImg: string;
  username: string;
}

function Sidebar() {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  useEffect(() => {
    let value = localStorage.getItem("medium-api:user");
    if (value) {
      setUser(JSON.parse(value));
    }
  }, []);

  return (
    <aside className="w-56 h-screen bg-[#1C2B3A] shadow-lg p-4 flex flex-col items-center text-white">
      <nav className="w-full flex flex-col gap-6 font-semibold">
        <Link href="" className="flex items-center gap-4 pb-6 w-full hover:bg-[#253B50] p-3 rounded-lg transition">
          <img
            src={
              user?.userImg
                ? user.userImg
                : "https://img.freepik.com/free-icon/user_318-159711.jpg"
            }
            alt="Imagem do perfil."
            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
          />
          <span className="text-lg">{user?.username || "Usuário"}</span>
        </Link>
        <Link
          href=""
          className="flex items-center gap-3 text-lg p-3 w-full hover:bg-[#253B50] rounded-lg transition"
        >
          <FaUserFriends className="text-white w-6 h-6" />
          Amigos
        </Link>
        <Link
          href=""
          className="flex items-center gap-3 text-lg p-3 w-full hover:bg-[#253B50] rounded-lg transition"
        >
          <FaAlignLeft className="text-white w-6 h-6" />
          Feed
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;