function AuthPage({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#1e2a38]">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-200">
                <form className="flex flex-col space-y-6">
                    {children}
                </form>
            </div>
        </main>
    );
}

export default AuthPage;
