import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import axios from "axios";
import Spinner from "./Spinner";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts`
        );
        // console.log(response);
        setPosts(response?.data.posts || []);
      } catch (error) {}
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <section className="posts">
      {posts?.length > 0 ? (
        <div className="container posts__container">
          {posts.map(
            ({
              _id: id,
              thumbnail,
              category,
              title,
              description,
              creator,
              createdAt,
            }) => (
              <PostItem
                key={id}
                postId={id}
                thumbnail={thumbnail}
                category={category}
                title={title}
                description={description}
                authorID={creator}
                createdAt={createdAt}
              />
            )
          )}
        </div>
      ) : (
        <h2 className="center">No posts found</h2>
      )}
    </section>
  );
};

export default Posts;
