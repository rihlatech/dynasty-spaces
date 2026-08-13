import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import ListingForm from "../../../components/dashboard/listings/ListingForm";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


export default function NewListing(){
    const navigate = useNavigate();

return (

<DashboardLayout>

<div className="mb-10">

       <button
             onClick={() => navigate("/admin/listings")}
            className="
              flex
              items-center
              gap-2
              text-gray-500
              dark:text-gray-400
            "
          >
            <ArrowLeft size={18}
          />
            Back to Listings
          </button>

<h1 className="text-4xl font-bold text-black dark:text-white">
New Listing
</h1>

<p className="mt-2 text-gray-500 dark:text-gray-400">
Create a new property listing.
</p>

</div>


<ListingForm mode="create" />


</DashboardLayout>

);

}