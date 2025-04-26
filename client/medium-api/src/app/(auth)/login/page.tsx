'use client'

import { useContext, useState } from "react";
import AuthInput from "@/components/AuthInput";
import Link from "next/link";
import { makeRequest } from "../../../../axios";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {setUser} = useContext(UserContext);

    const router = useRouter();

    const handleLogin = (e: any) => {
        e.preventDefault();
        makeRequest.post("auth/login", { email, password })
            .then((res) => {
                localStorage.setItem(
                    "medium-api:user",
                    JSON.stringify(res.data.user)
                );
                setUser(res.data.user);
                setError('');
                router.push("/main");
            })
            .catch((err) => {
                setError(err.response?.data?.msg || "Erro ao logar. Tente novamente.");
            });
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">LOGIN</h1>
            <AuthInput label="Email:" newState={setEmail} />
            <AuthInput label="Senha:" newState={setPassword} IsPassword />
            {error.length > 0 && <span className="text-red-600">* {error}</span>}
            <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={handleLogin}
            >
                ENTRAR
            </button>
            <Link href="/register" className="text-blue-600 text-center mt-4 hover:underline">
                Cadastrar-se
            </Link>
        </>
    );
}

export default Login;
