import { useState } from "react";
import { motion } from "framer-motion";

import {
  Mail,
  Phone,
  MessageCircle,
  Send,
} from "lucide-react";

import { supabase } from "../../config/SupabaseClient";

export default function Contact() {

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });


  // =========================================================
  // UI STATE
  // =========================================================

  const [sending, setSending] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");


  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =========================================================
  // SUBMIT CONTACT FORM
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSending(true);

    setSuccess("");

    setError("");


    try {

      // -------------------------------------------------------
      // WEB3FORMS
      // -------------------------------------------------------

      const web3FormData = new FormData();

      web3FormData.append(
        "access_key",
        "YOUR_WEB3FORMS_ACCESS_KEY"
      );

      web3FormData.append(
        "name",
        formData.name
      );

      web3FormData.append(
        "email",
        formData.email
      );

      web3FormData.append(
        "subject",
        formData.subject
      );

      web3FormData.append(
        "message",
        formData.message
      );


      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: web3FormData,
        }
      );


      const result = await response.json();


      if (!result.success) {
        throw new Error(
          result.message ||
          "Failed to send message."
        );
      }


      // -------------------------------------------------------
      // SAVE MESSAGE TO SUPABASE
      // -------------------------------------------------------

      const { error: databaseError } =
        await supabase
          .from("contact_messages")
          .insert([
            {
              name: formData.name,
              email: formData.email,
              subject: formData.subject,
              message: formData.message,
            },
          ]);


      if (databaseError) {
        console.error(
          "Supabase message storage error:",
          databaseError
        );
      }


      // -------------------------------------------------------
      // SUCCESS
      // -------------------------------------------------------

      setSuccess(
        "Thank you. Your message has been sent successfully."
      );


      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });


    } catch (error) {

      console.error(
        "Contact form error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );

    } finally {

      setSending(false);

    }

  };


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <>
    <Helmet>
  <title>
    Contact Dynasty Spaces | Real Estate in Kenya
  </title>

  <meta
    name="description"
    content="Contact Dynasty Spaces for property enquiries, real estate opportunities, and information about our developments in Kenya."
  />

  <link
    rel="canonical"
    href="https://dynastyspace.com/contact"
  />

  <meta
    property="og:title"
    content="Contact Dynasty Spaces | Real Estate in Kenya"
  />

  <meta
    property="og:description"
    content="Contact Dynasty Spaces for property enquiries, real estate opportunities, and information about our developments in Kenya."
  />

  <meta
    property="og:url"
    content="https://dynastyspace.com/contact"
  />

  <meta
    property="og:type"
    content="website"
  />

  <meta
    property="og:image"
    content="https://dynastyspace.com/dynasty_meta_logo.jpeg"
  />
</Helmet>

    <main
      className="
        min-h-screen
        bg-[#050505]
        text-white
        pt-28
        pb-20
      "
    >

   {/* =========================================================
    CONTACT INTRO
========================================================= */}

<section className="max-w-7xl mx-auto px-6">

  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="max-w-3xl"
  >

    <p
      className="
        text-sm
        uppercase
        tracking-[0.35em]
        text-[#C9A758]
        font-medium
      "
    >
      Contact Dynasty Spaces
    </p>

    <h1
      className="
        mt-4
        text-4xl
        md:text-5xl
        lg:text-6xl
        font-bold
        leading-tight
      "
    >
      Let's Start a
      <span className="text-[#C9A758]">
        {" "}Conversation.
      </span>
    </h1>

    <p
      className="
        mt-5
        max-w-2xl
        text-base
        md:text-lg
        leading-relaxed
        text-gray-400
      "
    >
      Whether you're looking for a property, interested in
      partnering with us, or simply have a question, we'd
      be happy to hear from you.
    </p>

  </motion.div>

</section>

{/* =========================================================
    CONTACT METHODS
========================================================= */}

<section className="max-w-7xl mx-auto px-6 mt-12">

 <div className="
  grid
  grid-cols-1
  md:grid-cols-3
  gap-5
  max-w-6xl
">

  {/* EMAIL */}

  <a
    href="mailto:dynastyspaces@gmail.com"
    className="
      group
      rounded-2xl
      border
      border-white/10
      bg-white/[0.03]
      p-6
      hover:border-[#C9A758]/50
      hover:bg-[#C9A758]/5
      transition-all
      duration-300
    "
  >

    <Mail
      size={24}
      className="
        text-[#C9A758]
        group-hover:scale-110
        transition
      "
    />

    <p className="mt-5 text-sm text-gray-500">
      Email Us
    </p>

    <p className="
      mt-1
      text-white
      font-medium
      break-all
    ">
      dynastyspaces@gmail.com
    </p>

  </a>


  {/* PHONE — DISPLAY ONLY */}

  <div
    className="
      group
      rounded-2xl
      border
      border-white/10
      bg-white/[0.03]
      p-6
      hover:border-[#C9A758]/50
      hover:bg-[#C9A758]/5
      transition-all
      duration-300
    "
  >

    <Phone
      size={24}
      className="
        text-[#C9A758]
        group-hover:scale-110
        transition
      "
    />

    <p className="mt-5 text-sm text-gray-500">
      Phone
    </p>

    <p className="mt-1 text-white font-medium">
      +254 797 983 216
    </p>

  </div>


  {/* WHATSAPP */}

  <a
    href="https://wa.me/254797983216"
    target="_blank"
    rel="noopener noreferrer"
    className="
      group
      rounded-2xl
      border
      border-white/10
      bg-white/[0.03]
      p-6
      hover:border-[#C9A758]/50
      hover:bg-[#C9A758]/5
      transition-all
      duration-300
    "
  >

    <MessageCircle
      size={24}
      className="
        text-[#C9A758]
        group-hover:scale-110
        transition
      "
    />

    <p className="mt-5 text-sm text-gray-500">
      WhatsApp
    </p>

    <p className="mt-1 text-white font-medium">
      Chat With Us
    </p>

  </a>

</div>

</section>

{/* =========================================================
    SEND A MESSAGE
========================================================= */}

<section className="max-w-7xl mx-auto px-6 mt-20">

  <div className="
    grid
    lg:grid-cols-[0.8fr_1.2fr]
    gap-10
    items-start
  ">

    {/* LEFT SIDE */}

    <motion.div
      initial={{ opacity: 0, x: -25 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >

      <p
        className="
          text-sm
          uppercase
          tracking-[0.3em]
          text-[#C9A758]
          font-medium
        "
      >
        Send a Message
      </p>

      <h2
        className="
          mt-3
          text-3xl
          md:text-4xl
          font-bold
        "
      >
        How can we help?
      </h2>

      <p
        className="
          mt-5
          max-w-md
          text-gray-400
          leading-relaxed
        "
      >
        Have a question about a property, partnership,
        or our services? Send us a message and our team
        will get back to you as soon as possible.
      </p>

      {/* Small accent */}

      <div
        className="
          mt-8
          w-20
          h-px
          bg-[#C9A758]
        "
      />

    </motion.div>


    {/* FORM */}

    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 25 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        p-6
        md:p-8
        space-y-5
      "
    >

     {/* =========================================================
    FORM FIELDS
========================================================= */}

<div className="space-y-5">

  {/* EMAIL */}

  <div>

    <label className="
      block
      mb-2
      text-sm
      font-medium
      text-gray-300
    ">
      Email Address
    </label>

    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
      placeholder="you@example.com"
      className="
        w-full
        rounded-xl
        border
        border-white/10
        bg-black/40
        px-4
        py-3
        text-white
        placeholder-gray-600
        outline-none
        focus:border-[#C9A758]
        focus:ring-1
        focus:ring-[#C9A758]/40
        transition
      "
    />

  </div>


  {/* SUBJECT */}

  <div>

    <label className="
      block
      mb-2
      text-sm
      font-medium
      text-gray-300
    ">
      Subject
    </label>

    <input
      type="text"
      name="subject"
      value={formData.subject}
      onChange={handleChange}
      required
      placeholder="How can we help?"
      className="
        w-full
        rounded-xl
        border
        border-white/10
        bg-black/40
        px-4
        py-3
        text-white
        placeholder-gray-600
        outline-none
        focus:border-[#C9A758]
        focus:ring-1
        focus:ring-[#C9A758]/40
        transition
      "
    />

  </div>


  {/* MESSAGE */}

  <div>

  </div>

</div>


{/* MESSAGE */}

<div>

  <label className="block mb-2 text-sm font-medium text-gray-300">
    Message
  </label>

  <textarea
    name="message"
    value={formData.message}
    onChange={handleChange}
    required
    rows={6}
    placeholder="Tell us how we can help..."
    className="
      w-full
      rounded-xl
      border
      border-white/10
      bg-black/40
      px-4
      py-3
      text-white
      placeholder-gray-600
      outline-none
      focus:border-[#C9A758]
      focus:ring-1
      focus:ring-[#C9A758]/40
      transition
      resize-none
    "
  />

</div>


{/* =========================================================
    STATUS MESSAGES
========================================================= */}

{success && (

  <div
    className="
      rounded-xl
      border
      border-green-500/20
      bg-green-500/10
      px-4
      py-3
      text-sm
      text-green-400
    "
  >
    {success}
  </div>

)}


{error && (

  <div
    className="
      rounded-xl
      border
      border-red-500/20
      bg-red-500/10
      px-4
      py-3
      text-sm
      text-red-400
    "
  >
    {error}
  </div>

)}


{/* =========================================================
    SEND BUTTON
========================================================= */}

<button
  type="submit"
  disabled={sending}
  className="
    w-full
    flex
    items-center
    justify-center
    gap-2
    rounded-xl
    bg-[#C9A758]
    text-black
    py-3.5
    font-semibold
    hover:bg-[#D8B968]
    disabled:opacity-50
    disabled:cursor-not-allowed
    transition
    duration-300
  "
>

  {sending ? (
    "Sending..."
  ) : (
    <>
      <Send size={18} />
      Send Message
    </>
  )}

</button>

    </motion.form>

  </div>

</section>



    </main>
    </>
  );

}