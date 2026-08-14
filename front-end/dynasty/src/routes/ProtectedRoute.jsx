import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../config/SupabaseClient";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkUser = async () => {

      try {

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          setLoading(false);
          return;
        }

        setUser(user);

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        setProfile(profile);

      } catch (error) {

        console.error(
          "Protected route error:",
          error
        );

        setUser(null);
        setProfile(null);

      } finally {

        setLoading(false);

      }

    };

    checkUser();

  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // =========================================================
  // ROLE CHECK
  // =========================================================

  if (
    allowedRoles.length > 0 &&
    (!profile || !allowedRoles.includes(profile.role))
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  return children;

}