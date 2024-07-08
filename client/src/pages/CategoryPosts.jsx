import React, { useEffect, useState } from "react";
import PostItem from "../components/PostItem";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { category } = useParams();
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`
        );
        // console.log(response);
        setPosts(response?.data.posts || []);
      } catch (error) {}
      setIsLoading(false);
    };
    fetchPosts();
  }, [category]);

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

export default CategoryPosts;
