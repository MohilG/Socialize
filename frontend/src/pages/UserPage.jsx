import { Flex, Spinner, useToast } from "@chakra-ui/react";
import UserHeader from "../components/UserHeader.jsx";
import UserPost from "../components/UserPost.jsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "../components/Post.jsx";
import useGetProfile from "../hooks/useGetProfile.js";

const UserPage = () => {
  const toast = useToast();
  const { username } = useParams();
  const [posts,setPosts]=useState([])
  const [fetchPost,setFetchPost]=useState(true)
  const {user,loading}=useGetProfile()
  useEffect(() => {
    
    const getPost=async()=>{
      setFetchPost(true)
      try {
          const response=await axios.get(`http://localhost:4000/api/posts/user/${username}`,{withCredentials:true})
          if(response.data.error){
            toast({
              title: "Error",
              description: response.data.error,
              duration: 3000,
              isClosable: true,
            });
            return
          }
          setPosts(response.data)
      } catch (error) {
        console.error("Error Getting User Posts:", error);
        setPosts([])
        toast({
          title: "Error",
          description: "Error Getting User Posts",
          duration: 3000,
          isClosable: true,
        });
      }finally{
        setFetchPost(false)
      }
    }
    getPost()
  }, [username]);

  // console.log(user);

  // Conditional rendering based on the user state
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"}/>
      </Flex>
    )
  }
  if (!user && !loading) {
    return (
    <Flex justifyContent={"center"}>
      <h1>User Not Found.</h1>
    </Flex>
      )
  }

  return (
    <>
      <UserHeader user={user} />
      {fetchPost && posts.length!==0 && (
     <Flex justifyContent={'center'}>
      <Spinner size={"xl"}/>
     </Flex>
    )}
    {!fetchPost && posts.length!==0 && (
      posts.map((post)=>{
        return (<Post post={post} key={post._id}/>)
        
      })
    )}
    </>
  );
};

export default UserPage;
