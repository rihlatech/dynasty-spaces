import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/dynasty-logo.png";

import { supabase } from "../../config/SupabaseClient";

import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

    const {
    data: { user },
    error: userError,
    } = await supabase.auth.getUser();

if (userError) throw userError;

      if (user) {
        await supabase
          .from("profiles")
          .update({
            last_login: new Date().toISOString(),
          })
          .eq("id", user.id);
      }

      navigate("/admin");

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div
    className="
      min-h-screen
      bg-[#F8F9FB]
      dark:bg-[#0B0B0B]
      flex
      items-center
      justify-center
      p-6
    "
  >
    <div
      className="
        w-full
        max-w-md
        bg-white
        dark:bg-[#121212]
        rounded-3xl
        border
        border-gray-200
        dark:border-white/10
        p-8
        shadow-sm
      "
    >   

    
        <div className="flex justify-center">
    
      <img
        src={logo}
        alt="Dynasty Spaces"
        className="w-45 h-45 object-contain"
      />
    
    </div>

      <h1 className="text-3xl font-bold text-center text-[#101F34] dark:text-white">
        Welcome Back
      </h1>

      <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
        Sign in to continue to Dynasty Spaces.
      </p>

      <form
        className="mt-8 space-y-6"
        onSubmit={handleLogin}
      >

        <div>

          <label className="block mb-2 font-semibold dark:text-white">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1A1A1A] dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A758]"
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-500">
              {errors.email}
            </p>
          )}

        </div>

        <div>

          <label className="block mb-2 font-semibold dark:text-white">
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1A1A1A] dark:text-white px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#C9A758]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password}
            </p>
          )}

        </div>

        <div className="flex justify-end">
          <button
  type="button"
  onClick={() => navigate("/forgot-password")}
  className="text-sm text-[#C9A758] hover:underline"
>
  Forgot Password?
</button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#101F34] text-white py-3 hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#C9A758] hover:underline"
          >
            Create Account
          </Link>
        </p>

      </form>

    </div>
  </div>
);
}