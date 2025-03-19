"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { TbMessageCircle } from "react-icons/tb";
import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { UserContext } from "@/context/UserContext";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      return await makeRequest.post("auth/logout").then((res) => res.data);
    },
    onSuccess: () => {
      setUser(undefined);
      localStorage.removeItem("medium-api:user");
      router.push("/login");
    },
  });

  return (
    <header className="w-full h-16 bg-white shadow-md fixed top-0 left-0 flex items-center justify-between px-6 z-50">
      <Link href="/" className="text-xl font-bold text-gray-800">
        MEDIUM
      </Link>

      <div className="relative flex items-center bg-gray-100 px-3 py-2 rounded-full w-80 max-w-xs md:max-w-sm lg:max-w-md">
        <input
          type="text"
          placeholder="Pesquisar..."
          className="bg-transparent focus:outline-none w-full text-gray-600"
        />
        <FaSearch className="text-gray-500" />
      </div>

      <div className="flex items-center gap-5">
        <button className="text-gray-600 hover:text-gray-800 transition">
          <TbMessageCircle size={24} />
        </button>
        <button className="text-gray-600 hover:text-gray-800 transition">
          <FaBell size={22} />
        </button>

        <div className="relative">
          <button
            className="flex items-center gap-2"
            onClick={() => setShowMenu(!showMenu)}
          >
            <img
              src={user?.userImg ?? "https://img.freepik.com/free-icon/user_318-159711.jpg"}
              alt="Imagem do perfil."
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
            />
            <span className="text-gray-800 font-medium hidden md:block">
              {user?.username || "Usuário"}
            </span>
          </button>

          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              onMouseLeave={() => setShowMenu(false)}
            >
              <Link
                href="/editar-perfil"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Editar Perfil
              </Link>
              <button
                onClick={() => mutation.mutate()}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
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
