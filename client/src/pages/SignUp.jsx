import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="my-7 text-center text-3xl font-semibold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="bg-slate-700 p-3 text-white uppercase font-semibold rounded-lg hover:opacity-95 disabled:opacity-58"
          type="submit"
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
      </form>
      <div className="flex gap-2 mt-6">
        <p className="text-black text-md">Have an account?</p>
        <Link>
          <span className="text-blue-600">Sign in</span>
        </Link>
      </div>
      {error && <p>{error}</p>}
    </section>
  );
};

export default SignUp;
