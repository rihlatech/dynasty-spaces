import { useEffect, useState } from "react";

import {
  X,
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Loader2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../../config/SupabaseClient";


export default function AdminProfileModal({
  isOpen,
  onClose,
}) {

  // =========================================================
  // AUTHENTICATED USER
  // =========================================================

  const [user, setUser] = useState(null);


  // =========================================================
  // PROFILE DATA
  // =========================================================

  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    email: "",
    avatar_url: "",
    role: "admin",
    status: "active",
    last_login: null,
    updated_at: null,
  });


  const [fullName, setFullName] = useState("");


  // =========================================================
  // AVATAR
  // =========================================================

  const [avatarFile, setAvatarFile] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState("");


  // =========================================================
  // PASSWORD
  // =========================================================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  // =========================================================
  // LOADING STATES
  // =========================================================

  const [loadingProfile, setLoadingProfile] =
    useState(false);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);


  // =========================================================
  // FEEDBACK
  // =========================================================

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isEditingProfile, setIsEditingProfile] = useState(false);


  // =========================================================
  // FETCH CURRENT USER + PROFILE
  // =========================================================

  const fetchProfile = async () => {

    try {

      setLoadingProfile(true);

      setError("");
      setSuccess("");


      // -------------------------------------------------------
      // GET AUTHENTICATED USER
      // -------------------------------------------------------

      const {
        data: {
          user: currentUser,
        },
        error: userError,
      } = await supabase.auth.getUser();


      if (userError) {
        throw userError;
      }


      if (!currentUser) {

        throw new Error(
          "No authenticated user found."
        );

      }


      setUser(currentUser);


      // -------------------------------------------------------
      // GET PROFILE
      // -------------------------------------------------------

      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          role,
          status,
          last_login,
          updated_at
        `)
        .eq("id", currentUser.id)
        .single();


      if (profileError) {
        throw profileError;
      }


      // -------------------------------------------------------
      // NORMALIZE PROFILE
      // -------------------------------------------------------

      const profileInfo = {

        id:
          profileData?.id ||
          currentUser.id,

        full_name:
          profileData?.full_name ||
          currentUser.user_metadata?.full_name ||
          "",

        email:
          profileData?.email ||
          currentUser.email ||
          "",

        avatar_url:
          profileData?.avatar_url ||
          "",

        role:
          profileData?.role ||
          "admin",

        status:
          profileData?.status ||
          "active",

        last_login:
          profileData?.last_login ||
          null,

        updated_at:
          profileData?.updated_at ||
          null,

      };


      setProfile(profileInfo);

      setFullName(
        profileInfo.full_name
      );

      setAvatarPreview(
        profileInfo.avatar_url
      );


    } catch (error) {

      console.error(
        "Fetch profile error:",
        error
      );

      setError(
        error.message ||
        "Failed to load profile."
      );

    } finally {

      setLoadingProfile(false);

    }

  };


  // =========================================================
  // LOAD PROFILE WHEN MODAL OPENS
  // =========================================================

  useEffect(() => {

    if (!isOpen) return;

    fetchProfile();


    // Clear temporary password fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setAvatarFile(null);

  }, [isOpen]);


  // =========================================================
  // AVATAR SELECTION
  // =========================================================

  const handleAvatarChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) return;


    // -------------------------------------------------------
    // IMAGE TYPE
    // -------------------------------------------------------

    if (!file.type.startsWith("image/")) {

      setError(
        "Please select a valid image."
      );

      return;

    }


    // -------------------------------------------------------
    // FILE SIZE
    // -------------------------------------------------------

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setError(
        "Avatar image must be smaller than 5MB."
      );

      return;

    }


    setError("");
    setSuccess("");

    setAvatarFile(file);


    // -------------------------------------------------------
    // REVOKE PREVIOUS LOCAL PREVIEW
    // -------------------------------------------------------

    if (
      avatarPreview &&
      avatarPreview.startsWith("blob:")
    ) {

      URL.revokeObjectURL(
        avatarPreview
      );

    }


    // -------------------------------------------------------
    // CREATE LOCAL PREVIEW
    // -------------------------------------------------------

    const previewUrl =
      URL.createObjectURL(file);

    setAvatarPreview(
      previewUrl
    );

  };


  // =========================================================
  // UPLOAD AVATAR
  // =========================================================

  const uploadAvatar = async () => {

    if (!avatarFile || !user) {

      return (
        profile.avatar_url ||
        null
      );

    }


    const fileExt =
      avatarFile.name
        .split(".")
        .pop()
        ?.toLowerCase();


    if (!fileExt) {

      throw new Error(
        "Unable to determine avatar file type."
      );

    }


    // -------------------------------------------------------
    // USER-SPECIFIC STORAGE PATH
    // -------------------------------------------------------

    const filePath =
      `${user.id}/avatar-${Date.now()}.${fileExt}`;


    // -------------------------------------------------------
    // UPLOAD TO AVATARS BUCKET
    // -------------------------------------------------------

    const {
      error: uploadError,
    } = await supabase.storage
      .from("avatars")
      .upload(
        filePath,
        avatarFile,
        {
          upsert: true,
          contentType: avatarFile.type,
        }
      );


    if (uploadError) {
      throw uploadError;
    }


    // -------------------------------------------------------
    // GET PUBLIC URL
    // -------------------------------------------------------

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("avatars")
      .getPublicUrl(
        filePath
      );


    const avatarUrl =
      publicUrlData?.publicUrl;


    if (!avatarUrl) {

      throw new Error(
        "Failed to generate avatar URL."
      );

    }


    // Cache-buster so the browser displays the
    // newly uploaded avatar immediately.

    return `${avatarUrl}?t=${Date.now()}`;

  };

  // =========================================================
// SAVE PROFILE
// =========================================================

const saveProfile = async () => {

  try {

    setSavingProfile(true);

    setError("");
    setSuccess("");


    // -------------------------------------------------------
    // AUTHENTICATED USER
    // -------------------------------------------------------

    if (!user) {

      throw new Error(
        "No authenticated user found."
      );

    }


    // -------------------------------------------------------
    // VALIDATE NAME
    // -------------------------------------------------------

    if (!fullName.trim()) {

      throw new Error(
        "Full name cannot be empty."
      );

    }


    // -------------------------------------------------------
    // UPLOAD AVATAR IF CHANGED
    // -------------------------------------------------------

    const avatarUrl =
      await uploadAvatar();


    // -------------------------------------------------------
    // UPDATE PROFILE
    // -------------------------------------------------------

    const {
      data: updatedProfile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .update({

        full_name:
          fullName.trim(),

        avatar_url:
          avatarUrl,

        updated_at:
          new Date().toISOString(),

      })
      .eq("id", user.id)
      .select()
      .single();


    if (profileError) {
      throw profileError;
    }


    // -------------------------------------------------------
    // UPDATE LOCAL PROFILE STATE
    // -------------------------------------------------------

    setProfile(updatedProfile);


    setFullName(
      updatedProfile.full_name || ""
    );


    setAvatarPreview(
      updatedProfile.avatar_url || ""
    );


    setAvatarFile(null);


    // -------------------------------------------------------
    // SUCCESS
    // -------------------------------------------------------

    setSuccess(
      "Profile updated successfully."
    );


    // IMPORTANT:
    // Tell the caller that saving succeeded.

    return true;


  } catch (error) {

    console.error(
      "Save profile error:",
      error
    );


    setError(
      error.message ||
      "Failed to update profile."
    );


    // IMPORTANT:
    // Tell the caller that saving failed.

    return false;


  } finally {

    setSavingProfile(false);

  }

};


  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const changePassword = async () => {

    try {

      setChangingPassword(true);

      setError("");
      setSuccess("");


      if (!user?.email) {

        throw new Error(
          "Unable to identify the current account."
        );

      }


      // -------------------------------------------------------
      // VALIDATION
      // -------------------------------------------------------

      if (!currentPassword) {

        throw new Error(
          "Enter your current password."
        );

      }


      if (!newPassword) {

        throw new Error(
          "Enter a new password."
        );

      }


      if (
        newPassword.length < 8
      ) {

        throw new Error(
          "New password must be at least 8 characters."
        );

      }


      if (
        newPassword !==
        confirmPassword
      ) {

        throw new Error(
          "New passwords do not match."
        );

      }


      if (
        currentPassword ===
        newPassword
      ) {

        throw new Error(
          "New password must be different from your current password."
        );

      }


      // -------------------------------------------------------
      // VERIFY CURRENT PASSWORD
      // -------------------------------------------------------

      const {
        error: verificationError,
      } =
        await supabase.auth
          .signInWithPassword({

            email:
              user.email,

            password:
              currentPassword,

          });


      if (verificationError) {

        throw new Error(
          "Current password is incorrect."
        );

      }


      // -------------------------------------------------------
      // UPDATE PASSWORD
      // -------------------------------------------------------

      const {
        error: passwordError,
      } =
        await supabase.auth
          .updateUser({

            password:
              newPassword,

          });


      if (passwordError) {
        throw passwordError;
      }


      // -------------------------------------------------------
      // CLEAR PASSWORD FIELDS
      // -------------------------------------------------------

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");


      setSuccess(
        "Password changed successfully."
      );


    } catch (error) {

      console.error(
        "Change password error:",
        error
      );

      setError(
        error.message ||
        "Failed to change password."
      );

    } finally {

      setChangingPassword(false);

    }

  };


  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  const handleForgotPassword = async () => {

    try {

      setError("");
      setSuccess("");


      if (!user?.email) {

        throw new Error(
          "Unable to identify your email address."
        );

      }


      const {
        error: resetError,
      } =
        await supabase.auth
          .resetPasswordForEmail(
            user.email,
            {
              redirectTo:
                `${window.location.origin}/reset-password`,
            }
          );


      if (resetError) {
        throw resetError;
      }


      setSuccess(
        "Password reset instructions have been sent to your email."
      );


    } catch (error) {

      console.error(
        "Forgot password error:",
        error
      );

      setError(
        error.message ||
        "Failed to send password reset email."
      );

    }

  };


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleClose = () => {

    if (
      avatarPreview &&
      avatarPreview.startsWith("blob:")
    ) {

      URL.revokeObjectURL(
        avatarPreview
      );

    }

    setAvatarFile(null);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setError("");
    setSuccess("");

    onClose();

  };


  // =========================================================
  // INITIAL AVATAR LETTER
  // =========================================================

  const getInitial = () => {

    const value =
      fullName ||
      profile.full_name ||
      user?.email ||
      "A";

    return value
      .trim()
      .charAt(0)
      .toUpperCase();

  };

  return (
  <>
    {isOpen && (
      <>
        {/* =====================================================
            BACKDROP
        ===================================================== */}

        <div
          className="
            fixed
            inset-0
            z-[90]

            bg-black/50
            backdrop-blur-sm

            transition-opacity
            duration-300
          "
          onClick={handleClose}
        />


        {/* =====================================================
            PROFILE PANEL
        ===================================================== */}

        <aside
          className="
            fixed
            top-0
            right-0
            z-[100]

            h-screen
            w-full
            max-w-md

            overflow-y-auto

            bg-white
            dark:bg-[#101010]

            border-l
            border-gray-200
            dark:border-white/10

            shadow-2xl

            animate-slide-in-right
          "
          onClick={(e) => e.stopPropagation()}
        >

          {/* ===================================================
              HEADER
          =================================================== */}

          <div
            className="
              sticky
              top-0
              z-20

              flex
              items-center
              justify-between

              px-6
              py-5

              bg-white/95
              dark:bg-[#101010]/95

              backdrop-blur-xl

              border-b
              border-gray-200
              dark:border-white/10
            "
          >

            {/* HEADER TEXT */}

            <div>

              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]

                  text-[#C9A758]
                "
              >
                Administration
              </p>

              <h2
                className="
                  mt-1

                  text-xl
                  font-bold

                  text-gray-900
                  dark:text-white
                "
              >
                My Profile
              </h2>

            </div>


            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close profile"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                text-gray-500
                dark:text-gray-400

                hover:bg-gray-100
                dark:hover:bg-white/10

                hover:text-gray-900
                dark:hover:text-white

                transition
                duration-200
              "
            >
              <X size={20} />
            </button>

          </div>


          {/* ===================================================
              CONTENT CONTAINER
          =================================================== */}

          <div className="p-6">

           {/* ===================================================
    PROFILE OVERVIEW
=================================================== */}

<div
  className="
    rounded-2xl

    border
    border-gray-200
    dark:border-white/10

    bg-gray-50
    dark:bg-white/[0.03]

    p-6
  "
>

  {/* =================================================
      AVATAR
  ================================================= */}

  <div className="flex flex-col items-center">

    <div
      className="
        relative

        flex
        h-28
        w-28

        items-center
        justify-center

        overflow-hidden

        rounded-full

        bg-[#C9A758]

        text-4xl
        font-bold
        text-black

        ring-4
        ring-[#C9A758]/10
      "
    >

      {avatarPreview ? (

        <img
          src={avatarPreview}
          alt="Profile avatar"
          className="
            h-full
            w-full
            object-cover
          "
        />

      ) : (

        getInitial()

      )}

    </div>


    {/* =================================================
        CHANGE PHOTO
    ================================================= */}

    <label
      htmlFor="adminAvatar"
      className="
        mt-4

        inline-flex
        cursor-pointer
        items-center
        gap-2

        rounded-xl

        border
        border-gray-200
        dark:border-white/10

        bg-white
        dark:bg-white/[0.04]

        px-4
        py-2

        text-sm
        font-semibold

        text-gray-700
        dark:text-gray-300

        hover:border-[#C9A758]
        hover:text-[#C9A758]

        transition
        duration-200
      "
    >

      <Camera size={16} />

      Change Photo

    </label>


    <input
      id="adminAvatar"
      type="file"
      accept="image/*"
      hidden
      onChange={handleAvatarChange}
    />


    <p
      className="
        mt-3

        text-center
        text-xs

        text-gray-500
        dark:text-gray-500
      "
    >
      JPG, PNG or WebP · Maximum 5MB
    </p>

  </div>


  {/* =================================================
      IDENTITY
  ================================================= */}

  <div className="mt-6 text-center">

    {/* NAME */}

    <h3
      className="
        text-xl
        font-bold

        text-gray-900
        dark:text-white
      "
    >
      {fullName || "Administrator"}
    </h3>


    {/* EMAIL */}

    <p
      className="
        mt-1

        text-sm

        text-gray-500
        dark:text-gray-400
      "
    >
      {user?.email || profile?.email}
    </p>


    {/* ROLE */}

    <div
      className="
        mt-4

        inline-flex
        items-center
        gap-2

        rounded-full

        border
        border-[#C9A758]/20

        bg-[#C9A758]/10

        px-3
        py-1.5

        text-xs
        font-semibold
        uppercase
        tracking-wider

        text-[#C9A758]
      "
    >

      <User size={13} />

      {profile?.role || "Administrator"}

    </div>

  </div>

</div> 

{/* ===================================================
    FEEDBACK MESSAGES
=================================================== */}

{error && (
  <div
    className="
      mt-5

      flex
      items-start
      gap-3

      rounded-xl

      border
      border-red-500/20

      bg-red-500/10

      px-4
      py-3

      text-sm
      text-red-500
      dark:text-red-400
    "
  >
    <div className="min-w-0">
      {error}
    </div>
  </div>
)}


{success && (
  <div
    className="
      mt-5

      flex
      items-start
      gap-3

      rounded-xl

      border
      border-green-500/20

      bg-green-500/10

      px-4
      py-3

      text-sm
      text-green-600
      dark:text-green-400
    "
  >
    <div className="min-w-0">
      {success}
    </div>
  </div>
)}

{/* ===================================================
    PERSONAL INFORMATION
=================================================== */}

<div
  className="
    mt-8
    pt-8

    border-t
    border-gray-200
    dark:border-white/10
  "
>

  {/* =================================================
      SECTION HEADER
  ================================================= */}

  <div
    className="
      flex
      items-start
      justify-between
      gap-4

      mb-5
    "
  >

    <div>

      <p
        className="
          text-xs
          uppercase
          tracking-[0.25em]
          text-[#C9A758]
        "
      >
        Account
      </p>

      <h3
        className="
          mt-1
          text-lg
          font-bold

          text-gray-900
          dark:text-white
        "
      >
        Personal Information
      </h3>

    </div>


    {/* EDIT BUTTON */}

    {!isEditingProfile && (

      <button
        type="button"
        onClick={() => {
          setIsEditingProfile(true);
          setError("");
          setSuccess("");
        }}
        className="
          inline-flex
          items-center
          gap-2

          rounded-xl

          border
          border-gray-200
          dark:border-white/10

          bg-white
          dark:bg-white/[0.04]

          px-4
          py-2

          text-sm
          font-semibold

          text-gray-700
          dark:text-gray-300

          hover:border-[#C9A758]
          hover:text-[#C9A758]

          transition
          duration-200
        "
      >

        <User size={16} />

        Edit Profile

      </button>

    )}

  </div>


  {/* =================================================
      VIEW MODE
  ================================================= */}

  {!isEditingProfile && (

    <div
      className="
        rounded-2xl

        border
        border-gray-200
        dark:border-white/10

        bg-gray-50
        dark:bg-white/[0.03]

        divide-y
        divide-gray-200
        dark:divide-white/10
      "
    >

      {/* FULL NAME */}

      <div className="p-4">

        <p
          className="
            text-xs
            uppercase
            tracking-wider

            text-gray-500
            dark:text-gray-500
          "
        >
          Full Name
        </p>

        <p
          className="
            mt-1

            font-medium

            text-gray-900
            dark:text-white
          "
        >
          {fullName || "Not provided"}
        </p>

      </div>


      {/* EMAIL */}

      <div className="p-4">

        <p
          className="
            text-xs
            uppercase
            tracking-wider

            text-gray-500
            dark:text-gray-500
          "
        >
          Email Address
        </p>

        <p
          className="
            mt-1

            font-medium

            break-all

            text-gray-900
            dark:text-white
          "
        >
          {user?.email || profile?.email || "Not available"}
        </p>

      </div>

    </div>

  )}


  {/* =================================================
      EDIT MODE
  ================================================= */}

  {isEditingProfile && (

    <div>

      {/* FULL NAME */}

      <div>

        <label
          htmlFor="adminFullName"
          className="
            block
            mb-2

            text-sm
            font-medium

            text-gray-700
            dark:text-gray-300
          "
        >
          Full Name
        </label>

        <div className="relative">

          <User
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2

              text-gray-400
            "
          />

          <input
            id="adminFullName"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setError("");
              setSuccess("");
            }}
            placeholder="Enter your full name"
            disabled={
              loadingProfile ||
              savingProfile
            }
            className="
              w-full
              h-12

              pl-11
              pr-4

              rounded-xl

              border
              border-gray-200
              dark:border-white/10

              bg-gray-50
              dark:bg-[#1A1A1A]

              text-gray-900
              dark:text-white

              placeholder:text-gray-400

              outline-none

              focus:border-[#C9A758]
              focus:ring-2
              focus:ring-[#C9A758]/20

              disabled:opacity-60
              disabled:cursor-not-allowed

              transition
            "
          />

        </div>

      </div>


      {/* EMAIL */}

      <div className="mt-5">

        <label
          htmlFor="adminEmail"
          className="
            block
            mb-2

            text-sm
            font-medium

            text-gray-700
            dark:text-gray-300
          "
        >
          Email Address
        </label>

        <div className="relative">

          <Mail
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2

              text-gray-400
            "
          />

          <input
            id="adminEmail"
            type="email"
            value={
              user?.email ||
              profile?.email ||
              ""
            }
            disabled
            className="
              w-full
              h-12

              pl-11
              pr-4

              rounded-xl

              border
              border-gray-200
              dark:border-white/10

              bg-gray-100
              dark:bg-white/[0.03]

              text-gray-500
              dark:text-gray-400

              cursor-not-allowed

              outline-none
            "
          />

        </div>

        <p
          className="
            mt-2

            text-xs
            leading-relaxed

            text-gray-500
            dark:text-gray-500
          "
        >
          Your email address is managed by your authentication
          account.
        </p>

      </div>


      {/* =================================================
          ACTIONS
      ================================================= */}

      <div
        className="
          mt-6

          flex
          gap-3
        "
      >

        {/* CANCEL */}

        <button
          type="button"
          onClick={() => {

            setFullName(
              profile.full_name || ""
            );

            setAvatarFile(null);

            if (
              profile.avatar_url
            ) {

              setAvatarPreview(
                profile.avatar_url
              );

            } else {

              setAvatarPreview("");

            }

            setError("");
            setSuccess("");

            setIsEditingProfile(false);

          }}
          disabled={savingProfile}
          className="
            flex-1

            h-12

            rounded-xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/[0.04]

            text-sm
            font-semibold

            text-gray-700
            dark:text-gray-300

            hover:bg-gray-100
            dark:hover:bg-white/10

            disabled:opacity-60

            transition
          "
        >
          Cancel
        </button>


        {/* SAVE */}

        <button
          type="button"
       onClick={async () => {const saved = await saveProfile();
        if (saved) {setIsEditingProfile(false);
          }}}
          
          disabled={
            loadingProfile ||
            savingProfile ||
            !fullName.trim()
          }
          className="
            flex-1

            h-12

            rounded-xl

            flex
            items-center
            justify-center
            gap-2

            bg-[#C9A758]

            text-black

            text-sm
            font-semibold

            hover:bg-[#D8B968]

            disabled:opacity-60
            disabled:cursor-not-allowed

            transition
          "
        >

          {savingProfile ? (

            <>
              <Loader2
                size={17}
                className="animate-spin"
              />

              Saving...
            </>

          ) : (

            <>
              <Save size={17} />

              Save Changes
            </>

          )}

        </button>

      </div>

    </div>

  )}

</div>

          </div>

        </aside>
      </>
    )}
  </>
);


 
}