import { Settings } from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      {/* <div className="min-h-full bg-[#050505] p-6 md:p-10"> */}

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[#C9A758]">
            Administration
          </p>

          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-white">
            Settings
          </h1>

          <p className="mt-3 text-gray-400">
            Manage system preferences and administrative configuration.
          </p>
        </div>

        {/* Under Construction */}
        {/* Under Construction */}
<div className="min-h-[60vh] flex items-center justify-center px-4">

  <div
    className="
      w-full
      max-w-4xl

      rounded-3xl

      border
      border-white/10

      bg-[#101010]

      p-12
      md:p-16
      lg:p-20

      text-center

      shadow-2xl
    "
  >

    {/* Settings Icon */}
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
            <Settings size={34} />
          </div>


    {/* Status */}
    <span
      className="
        inline-flex

        mt-9

        px-5
        py-2.5

        rounded-full

        border
        border-[#C9A758]/30

        bg-[#C9A758]/10

        text-[#C9A758]

        text-xs
        font-semibold

        uppercase
        tracking-[0.2em]
      "
    >
      Under Construction
    </span>


    {/* Title */}
    <h2
      className="
        mt-7

        text-3xl
        md:text-4xl

        font-bold

        text-white
      "
    >
      Settings 
    </h2>


    {/* Description */}
    <p
      className="
        mt-5

        max-w-2xl
        mx-auto

        text-gray-400

        text-base
        md:text-lg

        leading-relaxed
      "
    >
      Administrative settings will be available here soon.
      This section is currently under development as we continue
      building the Dynasty Spaces management portal.
    </p>

  </div>

</div>

      {/* </div> */}
    </DashboardLayout>
  );
}