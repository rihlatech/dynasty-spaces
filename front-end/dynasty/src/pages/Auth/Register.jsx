import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../config/SupabaseClient";
import logo from "../../assets/logo/dynasty-logo.png";
import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  if (!formData.full_name.trim()) {
    newErrors.full_name = "Full name is required";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  }

  if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

const handleRegister = async (e) => {
  e.preventDefault();

  if (!validate()) return;

 try {
  setLoading(true);

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (error) throw error;

  const user = data.user;

  if (!user) {
    throw new Error("Registration failed.");
  }

  console.log("User from Auth:", user);
console.log("User ID:", user.id);

const {
  data: { session },
} = await supabase.auth.getSession();

console.log("Session:", session);
console.log("Auth UID:", session?.user?.id);

  const { error: profileError } = await supabase
  .from("profiles")
  .insert([
    {
      id: user.id,
      full_name: formData.full_name,
      email: formData.email,
      role: "user",
      status: "active",
    },
  ]);

if (profileError) {
  console.error("Profile insert error:", profileError);
  throw profileError;
}

alert("Account created successfully!");

navigate("/login");

} catch (error) {
  console.error(error);
  console.error("Full error:", error);
  alert(JSON.stringify(error, null, 2));
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

    <h1
      className="
        mt-1
        text-3xl
        font-bold
        text-center
        text-[#101F34]
        dark:text-white
      "
    >
      Create Account
    </h1>

    <p
      className="
        mt-2
        text-center
        text-gray-500
        dark:text-gray-400
      "
    >
      Join Dynasty Spaces and start managing properties.
    </p>

    <form
  className="mt-8 space-y-6"
  onSubmit={handleRegister}
>

  <div>

    <label className="block mb-2 font-semibold dark:text-white">
      Full Name
    </label>

    <input
      type="text"
      name="full_name"
      placeholder="John Doe"
      value={formData.full_name}
      onChange={handleChange}
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        dark:border-white/10
        bg-white
        dark:bg-[#1A1A1A]
        dark:text-white
        px-4
        py-3
        outline-none
        focus:ring-2
        focus:ring-[#C9A758]
      "
    />

    {errors.full_name && (
  <p className="mt-2 text-sm text-red-500">
    {errors.full_name}
  </p>
)}
    

  </div>

  <div>

    <label className="block mb-2 font-semibold dark:text-white">
      Email Address
    </label>

    <input
      type="email"
      name="email"
      placeholder="john@example.com"
      value={formData.email}
      onChange={handleChange}
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        dark:border-white/10
        bg-white
        dark:bg-[#1A1A1A]
        dark:text-white
        px-4
        py-3
        outline-none
        focus:ring-2
        focus:ring-[#C9A758]
      "
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
      placeholder="Enter your password"
      value={formData.password}
      onChange={handleChange}
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        dark:border-white/10
        bg-white
        dark:bg-[#1A1A1A]
        dark:text-white
        px-4
        py-3
        pr-12
        outline-none
        focus:ring-2
        focus:ring-[#C9A758]
      "
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        text-gray-500
      "
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

<div>

  <label className="block mb-2 font-semibold dark:text-white">
    Confirm Password
  </label>

  <div className="relative">

    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      placeholder="Confirm your password"
      value={formData.confirmPassword}
      onChange={handleChange}
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        dark:border-white/10
        bg-white
        dark:bg-[#1A1A1A]
        dark:text-white
        px-4
        py-3
        pr-12
        outline-none
        focus:ring-2
        focus:ring-[#C9A758]
      "
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        text-gray-500
      "
    >
      {showConfirmPassword ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>

  </div>

  {errors.confirmPassword && (
  <p className="mt-2 text-sm text-red-500">
    {errors.confirmPassword}
  </p>
)}

</div>

<button
  type="submit"
  disabled={loading}
  className="
    w-full
    flex
    items-center
    justify-center
    gap-2
    rounded-xl
    bg-[#101F34]
    text-white
    py-3
    hover:opacity-90
    transition
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
>
  {loading ? (
    <>
      <Loader2 size={20} className="animate-spin" />
      Creating Account...
    </>
  ) : (
    "Create Account"
  )}
</button>

<p className="text-center text-gray-500 dark:text-gray-400">

  Already have an account?{" "}

  <Link
    to="/login"
    className="font-semibold text-[#C9A758] hover:underline"
  >
    Sign In
  </Link>

</p>


</form>

  </div>


    </div>
  );
}
