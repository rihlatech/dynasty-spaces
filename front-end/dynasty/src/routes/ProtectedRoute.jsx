import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../config/SupabaseClient";

export default function ProtectedRoute({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const checkUser = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();


      setUser(user);
      setLoading(false);

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
    return <Navigate to="/login" replace />;
  }


  return children;
}