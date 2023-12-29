import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <section>
      <h1 className="text-center font-semibold my-7 text-xl">Profile</h1>
      <form className="flex flex-col gap-3 p-4 max-w-2xl mx-auto">
        <img
          className="rounded-full w-24 h-24 self-center mb-5"
          src={currentUser.avatar}
          alt="profile"
        />
        <input
          className="p-3 rounded-lg shadow"
          placeholder="username"
          type="text"
          id="username"
          value={currentUser.username}
        />
        <input
          className="p-3 rounded-lg shadow"
          placeholder="email"
          type="email"
          id="email"
          value={currentUser.email}
        />
        <input
          className="p-3 rounded-lg shadow"
          placeholder="password"
          type="password"
          id="password"
        />
        <button
          className="bg-slate-700 uppercase p-3 rounded-lg text-md hover:opacity-95 disabled:opacity-80 text-white"
          type="submit"
        >
          update
        </button>
      </form>
      <div className="flex justify-between text-red-600 p-3">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign out</span>
      </div>
    </section>
  );
};

export default Profile;
