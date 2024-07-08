import React, { useContext, useEffect, useState } from "react";
import { DUMMY_POSTS } from "../data";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext.js";
import axios from "axios";
import DeletePost from "./DeletePost.jsx";
const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // redirect to login page if user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data.posts);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [token]);

  if (isLoading) {
    return <h2 className="center">Loading...</h2>;
  }

  return (
    <section className="dashboard">
      {posts.length > 0 ? (
        <div className="container dashboard__container">
          {posts.map((post) => (
            <article key={post._id} className="dashboard__post">
              <div className="dashboard__post-info">
                <div className="dashboard__post-thumbnail">
                  <img src={post.thumbnail} alt="" />
                </div>
                <h5>{post.title}</h5>
              </div>
              <div className="dashboard__post-actions">
                <Link to={`/posts/${post._id}`} className="btn sm">
                  View
                </Link>
                <Link to={`/posts/${post._id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={post._id} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">You have no posts yet.</h2>
      )}
    </section>
  );
};

export default Dashboard;
