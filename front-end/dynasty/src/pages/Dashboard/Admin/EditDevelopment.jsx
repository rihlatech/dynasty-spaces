import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import DevelopmentForm from "../../../components/dashboard/developments/DevelopmentForm";
import { useNavigate, useParams } from "react-router-dom";


export default function EditDevelopment() {

  const navigate = useNavigate();
  const { developmentId } = useParams();


  return (

    <DashboardLayout>


      <div className="flex items-center justify-between mb-10">


        <div>


          <button
            onClick={() => navigate("/admin/developments")}
            className="
              flex
              items-center
              gap-2
              text-gray-500
              dark:text-gray-400
            "
          >

            <ArrowLeft size={18} />

            Back to Developments

          </button>



          <h1 className="text-4xl font-bold text-black dark:text-white">

            Edit Development

          </h1>



          <p className="mt-2 text-gray-500 dark:text-gray-400">

            Update development information.

          </p>


        </div>


      </div>



      <DevelopmentForm 
        mode="edit"
        developmentId={developmentId}
      />


    </DashboardLayout>

  );
}