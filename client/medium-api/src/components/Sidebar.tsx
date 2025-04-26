"use client";

import Link from "next/link";
import { FaAlignLeft, FaUserFriends } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";

interface IUser {
  userImg: string;
  username: string;
  id?: number;
}

function Sidebar() {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const value = localStorage.getItem("medium-api:user");
    if (value) {
      setUser(JSON.parse(value));
    }
  }, []);

  return (
    <aside className="w-56 h-screen bg-[#1C2B3A] shadow-lg px-4 pt-12 flex flex-col items-center text-white">
      <nav className="w-full flex flex-col items-center font-semibold">
        <Link
          href={`/profile?id=${user?.id}`}
          className="flex flex-col items-center gap-4 pb-10"
        >
          <img
            src={
              user?.userImg
                ? user.userImg
                : "https://img.freepik.com/free-icon/user_318-159711.jpg"
            }
            alt="Imagem do perfil."
            className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-md"
          />
          <span className="text-lg font-semibold text-white">
            {user?.username || "Usuário"}
          </span>
        </Link>

        <div className="w-full flex flex-col gap-3">
          <Link
            href="/friends"
            className="flex items-center gap-4 text-lg px-5 py-4 hover:bg-[#253B50] rounded-lg transition w-full"
          >
            <FaUserFriends className="text-white w-6 h-6" />
            Amigos
          </Link>
          <Link
            href="/"
            className="flex items-center gap-4 text-lg px-5 py-4 hover:bg-[#253B50] rounded-lg transition w-full"
          >
            <FaAlignLeft className="text-white w-6 h-6" />
            Feed
          </Link>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
