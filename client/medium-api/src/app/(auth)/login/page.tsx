'use client'

import { useState, useContext } from "react";
import AuthInput from "@/components/AuthInput";
import Link from "next/link";
import { makeRequest } from "../../../../axios";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext"

function Login() {

    const [email, setEmail] = useState('teste@gmail.com');
    const [password, setPassword] = useState('teste');
    const [error, setError] = useState('');
    const {setUser} = useContext(UserContext);

    const router = useRouter();

    const handleLogin = (e: any) => {
        e.preventDefault();
        makeRequest.post("auth/login", { email, password })
            .then((res) => {
                console.log(res.data);
                localStorage.setItem(
                    "medium-api:user",
                    JSON.stringify(res.data.user),
                );
                setUser(res.data.user)
                localStorage.setItem(
                    "medium-api:token",
                    JSON.stringify(res.data.token)
                );
                setError('');
                router.push("/");
            })
            .catch((err) => {
                console.error("Erro no login:", err);
                const errorMsg = err.response?.data?.msg || "Erro ao tentar fazer login. Tente novamente.";
                setError(errorMsg);
            });
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">LOGIN</h1>
            <AuthInput label="Email:" newState={setEmail} />
            <AuthInput label="Senha:" newState={setPassword} IsPassword />
            {error && error.length > 0 && <span className="text-red-600">* {error}</span>}            
            <button type="submit" 
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" 
                onClick={(e) => handleLogin(e)}>
                ENTRAR
            </button>
            <Link href="/register" className="text-blue-600 text-center mt-4 hover:underline">
                Cadastrar-se
            </Link>
        </>
    );
}

export default Login;
