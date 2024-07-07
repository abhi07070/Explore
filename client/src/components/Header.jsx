import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
const { UserContext } = require("../context/userContext.js");

const Header = () => {
  const [showNav, setShowNav] = useState(
    window.innerWidth > 800 ? true : false
  );

  const { currentUser } = useContext(UserContext);

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  };
  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeNavHandler}>
          <h2>Explore</h2>
        </Link>

        {currentUser?.id && showNav && (
          <ul className="nav__menu">
            <li>
              <Link
                to={`/profile/${currentUser?.id}`}
                onClick={closeNavHandler}
              >
                {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavHandler}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavHandler}>
                Logout
              </Link>
            </li>
          </ul>
        )}
        {!currentUser?.id && showNav && (
          <ul className="nav__menu">
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavHandler}>
                Login
              </Link>
            </li>
          </ul>
        )}

        <button
          className="nav__toggle-btn"
          onClick={() => setShowNav(!showNav)}
        >
          {showNav ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
