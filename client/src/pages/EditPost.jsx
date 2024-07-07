import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // redirect to login page if user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const POST_CATEGORIES = [
    "Uncategorized",
    "Business",
    "Education",
    "Entertainment",
    "Health",
    "Music",
    "Sports",
    "Art",
    "Inventment",
    "Weather",
    "Travel",
    "Food",
    "Tech",
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
      .then(({ data }) => {
        // console.log(data);
        const { title, description, category } = data.post;
        setTitle(title);
        setCategory(category);
        setDescription(description);
      })
      .catch((err) => {
        // setError(err.response.data.message);
      });
  }, [id]);

  const editPost = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("thumbnail", thumbnail);
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, formData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <div className="form__error-message">{error}</div>}
        <form className="form create-post__form" onSubmit={editPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
          />
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="png,jpg,jpeg"
          />
          <button type="submit" className="btn primary">
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
