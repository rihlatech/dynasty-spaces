// pages/Dashboard/Admin/Editors.jsx
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { Users } from "lucide-react";

export default function Editors() {
  return (
    <DashboardLayout>
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-[#C9A758]">
          Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Editors
        </h1>

        <p className="mt-2 text-gray-400">
          Manage users who can access and manage property content.
        </p>
      </div>


      {/* DEVELOPMENT NOTICE */}

      <section
        className="
          min-h-[400px]
          rounded-3xl
          border
          border-white/10
          bg-[#121212]
          flex
          items-center
          justify-center
          text-center
          p-8
        "
      >

        <div className="max-w-md">

          <div
            className="
              w-20
              h-20
              mx-auto
              rounded-2xl
              bg-[#C9A758]/10
              border
              border-[#C9A758]/20
              flex
              items-center
              justify-center
              text-[#C9A758]
            "
          >
            <Users size={34} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-white">
            Editors
          </h2>

          <p className="mt-3 text-gray-400 leading-relaxed">
            Editor management is currently under development.
            This feature will allow administrators to invite,
            manage and control editor access.
          </p>

          <div
            className="
              inline-flex
              mt-6
              px-4
              py-2
              rounded-full
              border
              border-[#C9A758]/30
              bg-[#C9A758]/10
              text-[#C9A758]
              text-sm
              font-semibold
            "
          >
            Not Available
          </div>

        </div>

      </section>

    </div>
    </DashboardLayout>
  );
}