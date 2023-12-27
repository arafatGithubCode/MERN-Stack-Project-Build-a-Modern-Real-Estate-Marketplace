import { FaSearch } from "react-icons/fa";

import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex p-3 justify-between items-center max-w-6xl mx-auto">
        <h1 className="flex flex-wrap font-bold text-sm sm:text-xl">
          <span className="text-slate-500">Arafat</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <form className="flex items-center justify-center bg-white p-2 rounded-lg">
          <input
            className="bg-transparent w-24 sm:w-64 focus:outline-none"
            type="text"
            name="search"
            id="search"
            placeholder="Search..."
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
          <Link to="/sign-in">
            <li className="hover:underline text-slate-700">Sign In</li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
