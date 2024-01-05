import { FaSearch } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex p-3 justify-between items-center max-w-6xl mx-auto">
        <h1 className="flex flex-wrap font-bold text-sm sm:text-xl">
          <Link to="/">
            <span className="text-slate-500">Arafat</span>
            <span className="text-slate-700">Estate</span>
          </Link>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center bg-white p-2 rounded-lg"
        >
          <input
            className="bg-transparent w-24 sm:w-64 focus:outline-none"
            type="text"
            name="search"
            id="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex items-center justify-center gap-3">
          <Link to="/">
            <li className="hidden sm:inline-block hover:underline text-slate-700">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline-block hover:underline text-slate-700">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full w-7 h-7 object-cover bg-white"
                src={currentUser.avatar || "./avatar.png"}
                alt="Image"
              />
            ) : (
              <li className="hover:underline text-slate-700">Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
