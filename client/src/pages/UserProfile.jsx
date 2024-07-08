import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheck, FaEdit } from "react-icons/fa";
import { UserContext } from "../context/userContext";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

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
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { name, email, avatar } = response.data.user;
        // console.log(avatar);
        setName(name);
        setEmail(email);
        setAvatar(avatar);
      } catch {}
    };
    fetchUser();
  }, []);

  const changeAvatar = async (e) => {
    e.preventDefault();
    setIsAvatarTouched(false);
    try {
      const formData = new FormData();
      formData.set("avatar", avatar);
      // console.log(formData.get("avatar"));
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAvatar(response?.data.user.avatar);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmNewPassword", confirmNewPassword);

      // console.log(formData.get("name"));
      // console.log(formData.get("email"));
      // console.log(formData.get("currentPassword"));
      // console.log(formData.get("newPassword"));
      // console.log(formData.get("confirmNewPassword"));
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        navigate(`/logout`);
      }
    } catch (err) {
      console.log("Error response:", err.response);
      setError(err.response.data.message);
    }
  };

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser.id}`} className="btn">
          My Posts
        </Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={avatar} alt="" />
            </div>
            {/* Form to update */}
            <form className="avatar__form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="png,jpg,jpeg"
              />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}>
                <FaEdit />
              </label>
            </form>
            {isAvatarTouched && (
              <button className="profile__avatar-btn" onClick={changeAvatar}>
                <FaCheck />
              </button>
            )}
          </div>
          <h1>{currentUser.name}</h1>

          {/* form to update user details */}
          <form className="form profile__form" onSubmit={updateUserDetails}>
            {error && <p className="form__error-message">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="submit" className="btn primary">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
