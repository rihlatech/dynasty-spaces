import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../config/SupabaseClient";

import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

import logo from "../../assets/logo/dynasty-logo.png";


export default function ResetPassword() {

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");


  useEffect(() => {

    const checkSession = async () => {

      try {

        const {
          data: { session },
        } = await supabase.auth.getSession();


        if (!session) {

          setError(
            "This password reset link is invalid or has expired."
          );

        }

      } catch (error) {

        console.error(error);

        setError(
          "Unable to verify the password reset session."
        );

      } finally {

        setCheckingSession(false);

      }

    };


    checkSession();

  }, []);


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    if (password.length < 6) {

      setError(
        "Password must be at least 6 characters."
      );

      return;

    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;

    }


    try {

      setLoading(true);


      const { error } =
        await supabase.auth.updateUser({
          password,
        });


      if (error) {
        throw error;
      }


      setSuccess(true);


      setTimeout(() => {

        navigate("/login");

      }, 2500);


    } catch (error) {

      console.error(
        "Update password error:",
        error
      );

      setError(
        error.message ||
        "Unable to update your password."
      );


    } finally {

      setLoading(false);

    }

  };


  if (checkingSession) {

    return (

      <div
        className="
          min-h-screen
          bg-[#F8F9FB]
          dark:bg-[#0B0B0B]

          flex
          items-center
          justify-center

          text-gray-500
          dark:text-gray-400
        "
      >

        <Loader2
          size={28}
          className="animate-spin"
        />

      </div>

    );

  }


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
            className="
              w-40
              h-40
              object-contain
            "
          />

        </div>


        {success ? (

          <div className="text-center">

            <CheckCircle
              size={55}
              className="
                mx-auto
                text-[#C9A758]
              "
            />


            <h1
              className="
                mt-5
                text-3xl
                font-bold
                text-[#101F34]
                dark:text-white
              "
            >
              Password Updated
            </h1>


            <p
              className="
                mt-3
                text-gray-500
                dark:text-gray-400
              "
            >
              Your password has been changed
              successfully.
            </p>


            <p
              className="
                mt-3
                text-sm
                text-gray-400
              "
            >
              Redirecting you to login...
            </p>

          </div>

        ) : error && !password ? (

          <div className="text-center">

            <h1
              className="
                text-2xl
                font-bold
                text-[#101F34]
                dark:text-white
              "
            >
              Reset Link Expired
            </h1>


            <p
              className="
                mt-3
                text-gray-500
                dark:text-gray-400
              "
            >
              {error}
            </p>


            <Link
              to="/forgot-password"
              className="
                mt-6
                inline-flex
                items-center
                gap-2

                text-[#C9A758]
                font-semibold

                hover:underline
              "
            >

              Request a New Link

            </Link>

          </div>

        ) : (

          <>

            <h1
              className="
                text-3xl
                font-bold
                text-center
                text-[#101F34]
                dark:text-white
              "
            >
              Create New Password
            </h1>


            <p
              className="
                mt-2
                text-center
                text-gray-500
                dark:text-gray-400
              "
            >
              Choose a strong new password for
              your Dynasty Spaces account.
            </p>


            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

              {/* PASSWORD */}

              <div>

                <label
                  className="
                    block
                    mb-2
                    font-semibold
                    dark:text-white
                  "
                >
                  New Password
                </label>


                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter new password"
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
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2

                      text-gray-500
                    "
                  >

                    {showPassword
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                    }

                  </button>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div>

                <label
                  className="
                    block
                    mb-2
                    font-semibold
                    dark:text-white
                  "
                >
                  Confirm Password
                </label>


                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
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
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2

                      text-gray-500
                    "
                  >

                    {showConfirmPassword
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                    }

                  </button>

                </div>

              </div>


              {error && (

                <p className="text-sm text-red-500">
                  {error}
                </p>

              )}


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

                  disabled:opacity-60
                "
              >

                {loading ? (

                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Updating Password...

                  </>

                ) : (

                  "Update Password"

                )}

              </button>

            </form>


            <div className="mt-8 text-center">

              <Link
                to="/login"
                className="
                  inline-flex
                  items-center
                  gap-2

                  text-sm
                  font-semibold

                  text-[#C9A758]

                  hover:underline
                "
              >

                <ArrowLeft size={17} />

                Back to Login

              </Link>

            </div>

          </>

        )}

      </div>

    </div>

  );

}