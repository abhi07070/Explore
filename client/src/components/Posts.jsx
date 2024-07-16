import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import axios from "axios";
import Spinner from "./Spinner";
import { FaSearch, FaTimes } from "react-icons/fa";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showClearIcon, setShowClearIcon] = useState(false);

  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/posts`,
        {
          params: { page, limit: 9 },
        }
      );
      setPosts(response?.data.posts || []);
      setTotalPages(response?.data.totalPages || 1);
      setCurrentPage(response?.data.currentPage || 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setShowClearIcon(true);
    } else {
      setShowClearIcon(false);
    }
  };

  const clearSearchInput = () => {
    setSearchQuery("");
    setShowClearIcon(false);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="posts">
      <div className="container posts__search">
        <input
          type="text"
          placeholder="Search by title or category"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {showClearIcon ? (
          <FaTimes
            size={18}
            className="posts__search-icon"
            onClick={clearSearchInput}
          />
        ) : (
          <FaSearch size={18} className="posts__search-icon" />
        )}
      </div>
      {filteredPosts.length > 0 ? (
        <div className="container posts__container">
          {filteredPosts.map(
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
      <div className="container pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn primary"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn primary"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Posts;
