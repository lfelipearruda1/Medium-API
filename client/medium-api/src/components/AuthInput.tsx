interface AuthInputProps {
    newState: (state: string) => void;
    label: string;
    IsPassword?: boolean;
}

function AuthInput(props: AuthInputProps) {
    return (
        <div className="flex flex-col w-full">
            <label className="text-gray-700 font-medium">{props.label}</label>
            <input 
                type={props.IsPassword ? "password" : "text"}
                onChange={(e) => props.newState(e.currentTarget.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
        </div>
    );
}

export default AuthInput;
