import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";
import axios from "axios";

const DeletePost = ({ postId }) => {
  // console.log(postID);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // redirect to login page if user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const removePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${postId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        if (location.pathname === `/myposts/${currentUser._id}`) {
          navigate(0);
        } else {
          navigate("/");
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  // if (isLoading) {
  //   return <h2 className="center">Loading...</h2>;
  // }

  return (
    <Link className="btn sm danger" onClick={removePost}>
      Delete
    </Link>
  );
};

export default DeletePost;
