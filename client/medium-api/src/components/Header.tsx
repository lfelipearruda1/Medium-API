"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { TbMessageCircle } from "react-icons/tb";
import { makeRequest } from "../../axios";
import { UserContext } from "@/context/UserContext";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      return await makeRequest.post("auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      setUser(undefined);
      localStorage.removeItem("medium-api:user");
      router.push("/login");
    },
  });

  const { data: searchResults } = useQuery({
    queryKey: ["search", search],
    queryFn: () =>
      makeRequest
        .get(`search/search-users?params=${encodeURIComponent(search || "")}`)
        .then((res) => res.data),
    enabled: !!search,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(!!value.trim());
  };

  const handleViewAll = () => {
    if (search?.trim()) {
      router.push(`/search?params=${encodeURIComponent(search.trim())}`);
      setShowDropdown(false);
    }
  };

  return (
    <header className="w-full bg-white shadow-md flex items-center justify-between px-6 py-4 relative">
      <Link href="/main" className="text-3xl font-bold text-gray-800">
        API
      </Link>

      <div className="relative flex items-center bg-gray-100 px-3 py-2 rounded-full w-72">
        <input
          type="text"
          placeholder="Pesquisar usuários..."
          className="bg-transparent focus:outline-none w-full text-gray-600"
          onChange={handleInputChange}
          value={search || ""}
          onFocus={() => search && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        <FaSearch className="text-gray-500" />

        {showDropdown && searchResults?.length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md z-50">
            {searchResults.slice(0, 5).map((user: any) => (
              <Link
                key={user.id}
                href={`/profile?id=${user.id}`}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 transition"
                onClick={() => setShowDropdown(false)}
              >
                <img
                  src={user.userImg || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-gray-800 text-sm">{user.username}</span>
              </Link>
            ))}

            <button
              onClick={handleViewAll}
              className="w-full text-center py-2 text-blue-600 hover:bg-gray-100 text-sm font-medium"
            >
              Ver todos resultados
            </button>
          </div>
        )}
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
                user && user.userImg
                  ? user.userImg
                  : "https://img.freepik.com/free-icon/user_318-159711.jpg"
              }
              alt="Imagem do perfil."
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
            />
            <span className="text-gray-800 font-medium">
              {user?.username || "Usuário"}
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
                onClick={() => mutation.mutate()}
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
