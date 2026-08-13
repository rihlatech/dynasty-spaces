import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
// import { MessageCircle } from "lucide-react";

export default function Layout() {
  return (
    <>
      <Navbar />
      <ScrollToTop/>
      <main>
        <Outlet />
        {/* =========================================================
    FLOATING WHATSAPP BUTTON
========================================================= */}

<a
  href="https://wa.me/254797983216"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chat with Dynasty Spaces on WhatsApp"
  className="
    fixed
    right-5
    bottom-5
    z-50

    w-14
    h-14

    rounded-full

    bg-[#25D366]
    text-white

    flex
    items-center
    justify-center

    shadow-lg
    shadow-black/30

    hover:scale-110
    hover:shadow-xl

    transition-all
    duration-300
  "
>
  <svg
  viewBox="0 0 32 32"
  className="w-7 h-7"
  fill="currentColor"
  aria-hidden="true"
>
  <path
    d="M16.01 3C8.83 3 3 8.83 3 16c0 2.3.6 4.55 1.75 6.54L3 29l6.63-1.73A12.93 12.93 0 0 0 16 29c7.17 0 13-5.83 13-13S23.18 3 16.01 3Zm0 23.7c-2.03 0-4.01-.55-5.73-1.59l-.41-.24-3.94 1.03 1.05-3.84-.27-.42A10.72 10.72 0 1 1 16.01 26.7Zm5.88-8.04c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.81 1.04-.99 1.25-.18.21-.36.24-.67.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.57-1.88-1.75-2.2-.18-.32-.02-.49.14-.65.15-.15.32-.37.47-.55.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.72-.97-2.36-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.55.08-.84.39-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.76.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.16-1.52.26-.75.26-1.39.18-1.52-.08-.13-.29-.21-.6-.37Z"
  />
</svg>
</a>
      </main>
      <Footer />
    </>
  );
}