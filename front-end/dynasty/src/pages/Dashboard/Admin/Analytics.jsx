import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {
  BarChart3,
  Eye,
  MessageCircle,
  Building2,
  TrendingUp,
} from "lucide-react";


export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#C9A758]">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Analytics
          </h1>

          <p className="mt-2 text-gray-400">
            Monitor your property performance and visitor activity.
          </p>
        </div>


        {/* DEVELOPMENT NOTICE */}
        <div
          className="
            rounded-2xl
            border
            border-[#C9A758]/20
            bg-[#C9A758]/5
            p-6
          "
        >
          <div className="flex items-start gap-4">

            <div
              className="
                w-11
                h-11
                shrink-0
                rounded-xl
                bg-[#C9A758]/10
                flex
                items-center
                justify-center
                text-[#C9A758]
              "
            >
              <TrendingUp size={21} />
            </div>

            <div>
              <h2 className="text-white font-semibold">
                Analytics are under development
              </h2>

              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Detailed property analytics, visitor tracking,
                listing performance, inquiries and engagement
                statistics will be available here once analytics
                tracking is fully implemented.
              </p>
            </div>

          </div>
        </div>


        {/* OVERVIEW */}
        <section
          className="
            rounded-3xl
            border
            border-white/10
            bg-[#121212]
            p-6
          "
        >

          <div className="flex items-center gap-3 mb-6">

            <BarChart3
              size={21}
              className="text-[#C9A758]"
            />

            <h2 className="text-xl font-semibold text-white">
              Overview
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            <AnalyticsCard
              icon={<Building2 size={19} />}
              title="Total Listings"
            />

            <AnalyticsCard
              icon={<Eye size={19} />}
              title="Property Views"
            />

            <AnalyticsCard
              icon={<MessageCircle size={19} />}
              title="Inquiries"
            />

            <AnalyticsCard
              icon={<TrendingUp size={19} />}
              title="Engagement"
            />

          </div>

        </section>


        {/* EMPTY ANALYTICS AREA */}
        <section
          className="
            min-h-[280px]
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

          <div>

            <div
              className="
                w-16
                h-16
                mx-auto
                rounded-2xl
                bg-white/[0.04]
                border
                border-white/10
                flex
                items-center
                justify-center
                text-gray-500
              "
            >
              <BarChart3 size={28} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Analytics data will appear here
            </h3>

            <p className="mt-2 text-sm text-gray-500 max-w-md">
              Visitor activity, property views, inquiries and
              performance trends will be displayed once
              analytics tracking is implemented.
            </p>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}


function AnalyticsCard({ icon, title }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-5
      "
    >

      <div className="flex items-center justify-between">

        <p className="text-sm text-gray-400">
          {title}
        </p>

        <div className="text-[#C9A758]">
          {icon}
        </div>

      </div>

      <p className="mt-4 text-3xl font-bold text-white">
        —
      </p>

    </div>
  );
}