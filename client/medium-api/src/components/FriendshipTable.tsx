import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

interface IFriendship{
    id: number,
    follower_id: number,
    followed_id: number,
    username: string,
    userImg: string,
}

function FriendShipTable(){

    const {user}=useContext(UserContext)

    const {data, error} = useQuery({
        queryKey:['friendship'],
        queryFn:()=>makeRequest.get('friendship/?follower_id='+user?.id).then((res)=>{
            return res.data.data
        })
    })

    if (error){
        console.log(error)
    }

    return (
        <div>
            <span>Seguindo</span>
            {data?.map((friendship: IFriendship)=>{
                return(
                    <div key={friendship.id}>
                        <img
                        src={
                            friendship && friendship.userImg
                            ? friendship.userImg
                            : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                        }
                            alt="Imagem do perfil."
                            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                        />
                        <span className="text-gray-800 font-medium">
                            {friendship.username || "Usuário"}
                        </span>
                    </div>
                )
            })}
        </div>
    );
}

export default FriendShipTable;