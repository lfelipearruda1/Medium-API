"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { TbMessageCircle } from "react-icons/tb";

function Header() {
  const [user, setUser] = useState({ username: "", userImg: "" });
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let value = localStorage.getItem("medium-api:user");
    if (value) {
      setUser(JSON.parse(value));
    }
  }, []);

  const logout = (e:any) => {
    e.preventDefault();
    localStorage.removeItem("medium-api:token");
    router.push("/login");
  };

  return (
    <header className="w-full bg-white shadow-md flex items-center justify-between px-6 py-4">
      <Link href="/" className="text-xl font-bold text-gray-800">
        MEDIUM
      </Link>

      <div className="relative flex items-center bg-gray-100 px-3 py-2 rounded-full w-72">
        <input
          type="text"
          placeholder="Pesquisar..."
          className="bg-transparent focus:outline-none w-full text-gray-600"
        />
        <FaSearch className="text-gray-500" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <button className="text-gray-600 hover:text-gray-800 transition">
            <TbMessageCircle size={24} />
          </button>
          <button className="text-gray-600 hover:text-gray-800 transition">
            <FaBell size={22} />
          </button>
        </div>
        <div className="relative" onMouseLeave={() => setShowMenu(false)}>
          <button
            className="flex items-center gap-2"
            onClick={() => setShowMenu(!showMenu)}
          >
            <img
              src={
                user?.userImg?.length > 0
                  ? user.userImg
                  : "https://img.freepik.com/free-icon/user_318-159711.jpg"
              }
              alt="Imagem do perfil."
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
            />
            <span className="text-gray-800 font-medium">
              {user.username || "Usuário"}
            </span>
          </button>
          {showMenu && (
            <div className="absolute flex flex-col bg-white p-2 shadow-lg rounded-md gap-1 border border-gray-200 whitespace-nowrap right-[-8px] w-40">
              <Link
                href="/editar-perfil"
                className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition"
              >
                Editar Perfil
              </Link>
              <button
                onClick={(e) => logout(e)}
                className="py-2 px-4 text-red-600 hover:bg-gray-100 rounded-md transition text-left w-full"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
