import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="my-7 text-center text-3xl font-semibold">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
        />
        <button
          className="bg-slate-700 p-3 text-white uppercase font-semibold rounded-lg hover:opacity-95 disabled:opacity-58"
          type="submit"
        >
          sign up
        </button>
      </form>
      <div className="flex gap-2 mt-6">
        <p className="text-black text-md">Have an account?</p>
        <Link>
          <span className="text-blue-600">Sign in</span>
        </Link>
      </div>
    </section>
  );
};

export default SignUp;
