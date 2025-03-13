'use client'

import { useState } from "react";
import AuthInput from "@/components/AuthInput";
import Link from "next/link";
import { makeRequest } from "../../../../axios";
import { useRouter } from "next/navigation";

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    const handleLogin = (e:any)=>{
        e.preventDefault()
        makeRequest.post("auth/login", { email, password }).then((res)=>{
            console.log(res.data);
            localStorage.setItem(
                "medium-api:user",
                JSON.stringify(res.data.data.user)
            );
            localStorage.setItem(
                "medium-api:token",
                JSON.stringify(res.data.data.token)
            );
            setError('');
            router.push("/");
        }).catch((err)=>{
            console.log(err);
            setError(err.response.msg);
        })
    }

    return (
        <>
                <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">LOGIN</h1>
                <AuthInput label="Email:" newState={setEmail}/>
                <AuthInput label="Senha:" newState={setPassword} IsPassword/>
                {error.length>0 && <span className="text-red-600">* {error}</span>}
                <button type="submit" 
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" 
                onClick={(e)=>handleLogin(e)}>
                    ENTRAR
                </button>
                <Link href="/register" className="text-blue-600 text-center mt-4 hover:underline">Cadastrar-se</Link>
        </>
    );
}

export default Login;
 