'use client'

import { useQuery } from "@tanstack/react-query";

function Profile({searchParams}:{searchParams:{id:string}}){

    const {} = useQuery({
        queryKey: ['profile', searchParams.id]
    })

    return (
        <div>{searchParams.id}</div>
    );
}

export default Profile;