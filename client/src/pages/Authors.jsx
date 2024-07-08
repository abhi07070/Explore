import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Profile from "../Images/profile.png";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users`
        );
        // console.log(response);
        setAuthors(response?.data.users || []);
      } catch (error) {}
      setIsLoading(false);
    };
    fetchAuthors();
  }, []);

  if (isLoading) {
    return <h2 className="center">Loading...</h2>;
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({ _id: id, avatar, name, posts }) => {
            const avatarUrl = avatar ? avatar : Profile;

            return (
              <Link key={id} to={`/posts/users/${id}`} className="author">
                <div className="author__avatar">
                  <img src={avatarUrl} alt={`Image of ${name}`} />
                </div>
                <div className="author__info">
                  <h4>{name}</h4>
                  <p>{posts}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No users/authors found.</h2>
      )}
    </section>
  );
};

export default Authors;
