// import DashboardLayout from "../../../components/dashboard/DashboardLayout";
// import ListingForm from "../../../components/dashboard/listings/ListingForm";

// export default function EditListing() {
//   return (
//     <DashboardLayout>
//       <ListingForm mode="edit" />
//     </DashboardLayout>
//   );
// }

import { useLocation } from "react-router-dom";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import ListingForm from "../../../components/dashboard/listings/ListingForm";

export default function EditListing() {

  const location = useLocation();

  const developmentId = location.state?.development;


  return (
    <DashboardLayout>

      <ListingForm
        mode="edit"
        redirectPath={
          developmentId
            ? `/admin/developments/${developmentId}/listings`
            : "/admin/listings"
        }
      />

    </DashboardLayout>
  );
}