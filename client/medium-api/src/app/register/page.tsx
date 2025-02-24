"use client";

import AuthPage from "@/components/AuthPage";
import AuthInput from "@/components/AuthInput";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = (e: any) => {
        e.preventDefault();
        axios
            .post("http://localhost:8001/api/auth/register", {
                username,
                email,
                password,
                confirmPassword,
            })
            .then((res) => {
                console.log(res.data);
                setSuccess(res.data.msg);
                setError('');
            })
            .catch((err) => {
                console.log(err);
                setError(err.response.data.msg);
                setSuccess('');
            });
    };

    return (
        <AuthPage>
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
                REGISTER
            </h1>
            <AuthInput label="Nome:" newState={setUsername} />
            <AuthInput label="Email:" newState={setEmail} />
            <AuthInput label="Senha:" newState={setPassword} IsPassword />
            <AuthInput
                label="Comfirme a sua senha:"
                newState={setConfirmPassword}
                IsPassword
            />
            {error.length>0 && <span className="text-red-600">* {error}</span>}
            {success.length>0 && <span className="text-green-600">* {success}</span>}
            <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={(e) => handleRegister(e)}
            >
                CADASTRAR-SE
            </button>
            <Link
                href="/login"
                className="text-blue-600 text-center mt-4 hover:underline"
            >
                Logar
            </Link>
        </AuthPage>
    );
}

export default Register;
