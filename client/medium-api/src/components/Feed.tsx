import Post from "./Post";

const posts = [{
    id:1,
    post_desc:"teste",
    img:"https://tse4.mm.bing.net/th?id=OIP.s_vGI_uIYXbmNE6f35HSmgHaHa&pid=Api&P=0&h=180",
    username:"teste",
    userImg:"",
},{
    id:2,
    post_desc:"teste",
    img:"https://wallpapers.com/images/featured/imagem-da-aguia-q8v2b6c61y1jhcav.jpg",
    username:"user",
    userImg:"",
}]

function Feed(){

    return(
        <div className="flex flex-col items-center gap-6">
            {posts.map((post, id)=>{
                return(
                    <Post post={post} key={id}/>
                )
            })}
        </div>
    );
}

export default Feed;