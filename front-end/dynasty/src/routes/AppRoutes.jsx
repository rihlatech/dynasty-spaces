import { Routes, Route } from "react-router-dom";

// =========================================================
// LAYOUT
// =========================================================

import Layout from "../components/layout/Layout";


// =========================================================
// PUBLIC WEBSITE PAGES
// =========================================================

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contacts/Contact";
import Partnership from "../pages/Partnership/Partnership";


// =========================================================
// PUBLIC PROPERTY PAGES
// =========================================================

import Properties from "../pages/properties/Properties";
import ListingDetails from "../pages/properties/ListingDetails";



// =========================================================
// AUTHENTICATION PAGES
// =========================================================

import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";


// =========================================================
// ADMIN DASHBOARD PAGES
// =========================================================

// Dashboard
import Dashboard from "../pages/Dashboard/Admin/Dashboard";


// Listings
import Listings from "../pages/Dashboard/Admin/Listings";
import NewListing from "../pages/Dashboard/Admin/NewListing";
import EditListing from "../pages/Dashboard/Admin/EditListing";

// Analytics
import Analytics from "../pages/Dashboard/Admin/Analytics";

// Editors
import Editors from "../pages/Dashboard/Admin/Editors";

//Settings
import Settings from "../pages/Dashboard/Admin/Settings";


// =========================================================
// ROUTE PROTECTION
// =========================================================

import ProtectedRoute from "./ProtectedRoute";


// =========================================================
// APPLICATION ROUTES
// =========================================================

export default function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC WEBSITE
      ===================================================== */}

      <Route element={<Layout />}>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />


        {/* Properties */}
        <Route
          path="/properties"
          element={<Properties />}
        />

        <Route
          path="/properties/:listingId"
          element={<ListingDetails />}
        />


        {/* Partnership */}
        <Route
          path="/partnership"
          element={<Partnership />}
        />


        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />


        {/* Contact */}
        <Route
          path="/contact"
          element={<Contact />}
        />

      </Route>


      {/* =====================================================
          AUTHENTICATION
      ===================================================== */}

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* =====================================================
          ADMIN DASHBOARD
          Protected Routes
      ===================================================== */}

      {/* Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          ADMIN — DEVELOPMENTS
      ===================================================== */}

    


      {/* =====================================================
          ADMIN — LISTINGS
      ===================================================== */}

      {/* All Listings */}
      <Route
        path="/admin/listings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Listings />
          </ProtectedRoute>
        }
      />


      {/* Create Listing */}
      <Route
        path="/admin/listings/new"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <NewListing />
          </ProtectedRoute>
        }
      />


      {/* Edit Listing */}
      <Route
        path="/admin/listings/:listingId/edit"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EditListing />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          ADMIN — ANALYTICS
      ===================================================== */}

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
    ADMIN — EDITORS
===================================================== */}

<Route
  path="/admin/editors"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Editors />
    </ProtectedRoute>
  }
/>

{/* =====================================================
    ADMIN — SETTINGS
  ===================================================== */}


<Route
  path="/admin/settings"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Settings />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}