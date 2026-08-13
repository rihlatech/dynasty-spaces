import { useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../../config/SupabaseClient";

import {
  ArrowLeft,
  Mail,
  Loader2,
  CheckCircle,
} from "lucide-react";

import logo from "../../assets/logo/dynasty-logo.png";


export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [sent, setSent] = useState(false);

  const [error, setError] = useState("");


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }


    try {

      setLoading(true);


      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo:
              `${window.location.origin}/reset-password`,
          }
        );


      if (error) {
        throw error;
      }


      setSent(true);


    } catch (error) {

      console.error(
        "Password reset error:",
        error
      );

      setError(
        error.message ||
        "Unable to send password reset email."
      );


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

        {/* LOGO */}

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


        {!sent ? (

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
              Forgot Password?
            </h1>


            <p
              className="
                mt-2
                text-center
                text-gray-500
                dark:text-gray-400
              "
            >
              Enter your email address and we'll
              send you a link to reset your password.
            </p>


            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

              <div>

                <label
                  className="
                    block
                    mb-2
                    font-semibold
                    dark:text-white
                  "
                >
                  Email Address
                </label>


                <div className="relative">

                  <Mail
                    size={19}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />


                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="john@example.com"
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
                      pl-11

                      outline-none

                      focus:ring-2
                      focus:ring-[#C9A758]
                    "
                  />

                </div>


                {error && (

                  <p className="mt-2 text-sm text-red-500">
                    {error}
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

                  disabled:opacity-60
                "
              >

                {loading ? (

                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Sending Link...

                  </>

                ) : (

                  "Send Reset Link"

                )}

              </button>

            </form>

          </>

        ) : (

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
              Check Your Email
            </h1>


            <p
              className="
                mt-3
                text-gray-500
                dark:text-gray-400
                leading-relaxed
              "
            >
              If an account exists for{" "}
              <span className="font-semibold">
                {email}
              </span>
              , we've sent a password reset link.
            </p>


            <p
              className="
                mt-4
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Check your inbox and spam folder.
            </p>

          </div>

        )}


        {/* BACK TO LOGIN */}

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

      </div>

    </div>

  );

}