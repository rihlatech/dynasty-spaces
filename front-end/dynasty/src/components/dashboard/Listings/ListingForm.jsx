import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Star } from "lucide-react";

import { supabase } from "../../../config/SupabaseClient";



export default function ListingForm({
  mode = "create",
  redirectPath = "/admin/listings",
}) {

  const navigate = useNavigate();
  const { listingId } = useParams();


  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [deletedMedia, setDeletedMedia] = useState([]);


  const [developments, setDevelopments] = useState([]);

const [mediaFiles, setMediaFiles] = useState([]);

const [mediaPreviews, setMediaPreviews] = useState([]);

const [virtualTourFile, setVirtualTourFile] = useState(null);
const [virtualTourPreview, setVirtualTourPreview] = useState("");
const [virtualTourPath, setVirtualTourPath] = useState("");

// const [uploadingMedia, setUploadingMedia] = useState(false);


 

  const [formData, setFormData] = useState({

    development_id: "",

    title: "",

    slug: "",

    listing_type: "sale",

    property_type: "",

    price: "",

    currency: "KES",

    bedrooms: "",

    ensuite_status: "",

    area_sqm: "",

    available_units: "",

    description: "",

    location: "",

    google_maps_url: "",

    virtual_tour_url: "",

    status: "draft",

  });



  useEffect(() => {

    const fetchDevelopments = async () => {

      const { data, error } = await supabase
        .from("developments")
        .select("id, name")
        // .eq("status", ["draft" , "published"])
        .order("name");


      if (error) {
        console.error(error);
        return;
      }


      setDevelopments(data || []);

    };


    fetchDevelopments();

  }, []);

  useEffect(() => {
  if (mode !== "edit" || !listingId) return;

  const fetchListing = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        listing_media (
          id,
          media_url,
          storage_path,
          media_type,
          is_primary,
          display_order
        )
      `)
      .eq("id", listingId)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setFormData({
      development_id: data.development_id || "",
      title: data.title || "",
      slug: data.slug || "",
      listing_type: data.listing_type || "sale",
      property_type: data.property_type || "",
      price: data.price || "",
      currency: data.currency || "KES",
      bedrooms: data.bedrooms || "",
      ensuite_status: data.ensuite_status || "",
      area_sqm: data.area_sqm || "",
      available_units: data.available_units || "",
      description: data.description || "",
      location: data.location || "",
      google_maps_url: data.google_maps_url || "",
      virtual_tour_url: data.virtual_tour_url || "",
      status: data.status || "draft",
    });

    setVirtualTourPath(data.virtual_tour_path || "");

    if (data.listing_media) {
      setMediaPreviews(
        data.listing_media.map((item) => ({
          id: item.id,
          url: item.media_url,
          storage_path: item.storage_path,
          type: item.media_type,
          isExisting: true,
        }))
      );
    }

    setLoading(false);
  };

  fetchListing();
}, [mode, listingId]);



  const handleChange = (e) => {

    const { name, value } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    if (name === "title") {

      setFormData((prev) => ({
        ...prev,

        title: value,

       slug:
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") +
  "-" +
  Date.now(),

      }));

    }


    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

  };

  // ==============================================
  const removeMedia = (index) => {

  const media = mediaPreviews[index];


  if(media.isExisting){
    setDeletedMedia(prev => [
      ...prev,
      media
    ]);
  }


  const updatedPreviews = [...mediaPreviews];

  URL.revokeObjectURL(updatedPreviews[index].url);

  updatedPreviews.splice(index,1);


  setMediaPreviews(updatedPreviews);


  const updatedFiles = mediaFiles.filter(
    (_,i)=> i !== index
  );

  setMediaFiles(updatedFiles);

};

// ============================
  

  const setCoverImage = async (index) => {

  const selectedMedia = mediaPreviews[index];

  if (!selectedMedia.isExisting) {
    // For new uploads, just reorder locally
    const previews = [...mediaPreviews];
    const selectedPreview = previews.splice(index, 1)[0];
    previews.unshift(selectedPreview);

    setMediaPreviews(previews);
    return;
  }


  try {

    // Remove primary from all media
    await supabase
      .from("listing_media")
      .update({ is_primary: false })
      .eq("listing_id", listingId);


    // Set selected image as primary
    await supabase
      .from("listing_media")
      .update({ 
        is_primary: true,
        display_order: 1
      })
      .eq("id", selectedMedia.id);


    // Reorder UI
    const previews = [...mediaPreviews];

    const selectedPreview = previews.splice(index, 1)[0];

    previews.unshift(selectedPreview);

    setMediaPreviews(previews);


  } catch (error) {

    console.error("Cover update failed:", error);

  }

};


  const validate = () => {

  const newErrors = {};


  if (!formData.development_id)
    newErrors.development_id = "Please select a development";


  if (!formData.title.trim())
    newErrors.title = "Listing title is required";


  if (!formData.listing_type)
    newErrors.listing_type = "Listing type is required";


  if (!formData.property_type)
    newErrors.property_type = "Property type is required";


  if (!formData.price)
    newErrors.price = "Price is required";


  if (!formData.bedrooms)
    newErrors.bedrooms = "Bedrooms are required";


  if (!formData.ensuite_status)
    newErrors.ensuite_status = "Ensuite status is required";


  if (!formData.area_sqm)
    newErrors.area_sqm = "Area is required";


  if (!formData.description.trim())
    newErrors.description = "Description is required";


  if (!formData.location.trim())
    newErrors.location = "Location is required";


  setErrors(newErrors);


  return Object.keys(newErrors).length === 0;

};

const uploadMedia = async (listingId) => {
  if (mediaFiles.length === 0) return [];

  const uploadedFiles = [];

  for (let i = 0; i < mediaFiles.length; i++) {
    const file = mediaFiles[i];

    const fileExt = file.name.split(".").pop();

    const fileName = `${Date.now()}-${i}.${fileExt}`;

    const filePath = `${listingId}/${fileName}`;

    const { error } = await supabase.storage
      .from("listing-media")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("listing-media")
      .getPublicUrl(filePath);

    uploadedFiles.push({
      media_url: data.publicUrl,
      storage_path: filePath,
      media_type: file.type.startsWith("image/")
        ? "image"
        : "video",
      is_primary: false,
      display_order: i + 1,
      file_name: file.name,
      file_size: file.size,
    });
  }

  return uploadedFiles;
};

const uploadVirtualTour = async (listingId) => {
  if (!virtualTourFile) return null;

  const fileExt = virtualTourFile.name.split(".").pop();

  const fileName = `virtual-tour-${Date.now()}.${fileExt}`;

  const filePath = `${listingId}/${fileName}`;

  const { error } = await supabase.storage
    .from("virtual-tours")
    .upload(filePath, virtualTourFile);

  if (error) throw error;

  return filePath;
};

// ===============================SAVELISTING================

const saveListing = async () => {
  if (!validate()) return;

  try {
    setLoading(true);

    const payload = {
      ...formData,
      status: formData.status ,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      area_sqm: formData.area_sqm
        ? Number(formData.area_sqm)
        : null,
      available_units: formData.available_units
        ? Number(formData.available_units)
        : 0,
    };

    let data;

if (mode === "edit") {

  const { data: updatedListing, error } = await supabase
    .from("listings")
    .update(payload)
    .eq("id", listingId)
    .select()
    .single();

  if (error) throw error;

  data = updatedListing;

  console.log("Listing updated:", data);

} else {

  const { data: newListing, error } = await supabase
    .from("listings")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;

  data = newListing;

  console.log("Listing created:", data);

}

// ==============================================
// VIRTUAL TOUR
// ==============================================

if (virtualTourFile) {

  // ----------------------------------------------
  // DELETE OLD VIRTUAL TOUR
  // ----------------------------------------------

  if (mode === "edit" && virtualTourPath) {

    const { error: deleteOldTourError } =
      await supabase.storage
        .from("virtual-tours")
        .remove([
          virtualTourPath
        ]);

    if (deleteOldTourError) {
      throw deleteOldTourError;
    }

  }


  // ----------------------------------------------
  // UPLOAD NEW VIRTUAL TOUR
  // ----------------------------------------------

  const newVirtualTourPath =
    await uploadVirtualTour(data.id);


  // ----------------------------------------------
  // SAVE NEW PATH + YOUTUBE URL
  // ----------------------------------------------

  const { error: virtualTourError } =
    await supabase
      .from("listings")
      .update({
        virtual_tour_path: newVirtualTourPath,
        virtual_tour_url:
          formData.virtual_tour_url || null,
      })
      .eq("id", data.id);


  if (virtualTourError) {
    throw virtualTourError;
  }

}

// ==============================================
// UPDATE YOUTUBE URL
// ==============================================

if (!virtualTourFile) {

  const { error: youtubeError } =
    await supabase
      .from("listings")
      .update({
        virtual_tour_url:
          formData.virtual_tour_url || null,
      })
      .eq("id", data.id);

  if (youtubeError) {
    throw youtubeError;
  }

}

// const uploadedMedia = await uploadMedia(data.id);

const uploadedMedia = await uploadMedia(data.id);


if (uploadedMedia.length > 0) {

  const { error: mediaError } = await supabase
    .from("listing_media")
    .insert(
      uploadedMedia.map((media) => ({
        ...media,
        listing_id: data.id,
      }))
    );

  if (mediaError) throw mediaError;

}

for (const media of deletedMedia) {

  await supabase.storage
    .from("listing-media")
    .remove([
      media.storage_path
    ]);


  const { error } = await supabase
    .from("listing_media")
    .delete()
    .eq("id", media.id);


  if (error) throw error;

}
  
    alert(
  mode === "edit"
    ? "Listing updated successfully!"
    : "Listing created successfully!"
);


   navigate(redirectPath, {
  replace: true,
});


  } catch (error) {

    console.error(error);

    alert(error.message);

  } finally {

    setLoading(false);

  }
};
// ----------------------

const handleVirtualTourUpload = (e) => {

  const file = e.target.files?.[0];

  if (!file) return;

  // Only allow video files
  if (!file.type.startsWith("video/")) {

    alert("Please select a video file.");

    return;

  }

  // Optional: 100 MB limit
  if (file.size > 100 * 1024 * 1024) {

    alert("Virtual tour video must be smaller than 100MB.");

    return;

  }

  setVirtualTourFile(file);

  setVirtualTourPreview(
    URL.createObjectURL(file)
  );

};

  return (
<form className="space-y-8">

{/* BASIC INFORMATION */}

<section
className="
bg-white
dark:bg-[#121212]
border
border-gray-200
dark:border-white/10
rounded-3xl
p-8
"
>

<h2 className="text-2xl font-bold dark:text-white mb-8">
Basic Information
</h2>


{/* DEVELOPMENT + TITLE */}

<div className="grid lg:grid-cols-2 gap-6">


<div>

<label className="font-semibold dark:text-white block mb-2">
Development
<span className="text-red-500 ml-1">*</span>
</label>


<select
name="development_id"
value={formData.development_id}
onChange={handleChange}
className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"
>

<option value="">
Select Development
</option>


{developments.map((development)=>(

<option
key={development.id}
value={development.id}
>
{development.name}
</option>

))}

</select>


{errors.development_id && (
<p className="text-red-500 text-sm mt-2">
{errors.development_id}
</p>
)}

</div>



<div>

<label className="font-semibold dark:text-white block mb-2">
Listing Title
<span className="text-red-500 ml-1">*</span>
</label>


<input
type="text"
name="title"
value={formData.title}
onChange={handleChange}
placeholder="Luxury 3 Bedroom Apartment"
className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"
/>


{errors.title && (
<p className="text-red-500 text-sm mt-2">
{errors.title}
</p>
)}

</div>


</div>



{/* SLUG */}

<div className="mt-6">

<label className="font-semibold dark:text-white block mb-2">
Slug
</label>


<input
type="text"
name="slug"
value={formData.slug}
onChange={handleChange}
placeholder="luxury-3-bedroom-apartment"
className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
bg-gray-100
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
"
/>

</div>




{/* LISTING TYPE + PROPERTY TYPE */}

<div className="grid lg:grid-cols-2 gap-6 mt-6">


<div>

<label className="font-semibold dark:text-white block mb-2">
Listing Type
<span className="text-red-500 ml-1">*</span>
</label>


<select
name="listing_type"
value={formData.listing_type}
onChange={handleChange}
className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"
>

<option value="">
Select Type
</option>

<option value="sale">
Sale
</option>

<option value="rent">
Rent
</option>

<option value="both">
Sale & Rent
</option>

</select>


{errors.listing_type && (
<p className="text-red-500 text-sm mt-2">
{errors.listing_type}
</p>
)}

</div>




<div>

<label className="font-semibold dark:text-white block mb-2">
Property Type
<span className="text-red-500 ml-1">*</span>
</label>


<input
type="text"
name="property_type"
value={formData.property_type}
onChange={handleChange}
placeholder="Apartment, Maisonette, Office..."
className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"
/>


{errors.property_type && (
<p className="text-red-500 text-sm mt-2">
{errors.property_type}
</p>
)}

</div>


</div>


</section>

{/* PROPERTY DETAILS & PRICING */}

<section
className="
bg-white
dark:bg-[#121212]
border
border-gray-200
dark:border-white/10
rounded-3xl
p-8
"
>

<h2 className="text-2xl font-bold dark:text-white mb-8">
Property Details & Pricing
</h2>


{/* PRICE + CURRENCY */}

<div className="grid lg:grid-cols-2 gap-6">


<div>

<label className="font-semibold dark:text-white block mb-2">
Price
<span className="text-red-500 ml-1">*</span>
</label>


<input
type="number"
name="price"
value={formData.price}
onChange={handleChange}
placeholder="2500000"
className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"
/>


{errors.price && (
<p className="text-red-500 text-sm mt-2">
{errors.price}
</p>
)}

</div>




<div>

<label className="font-semibold dark:text-white block mb-2">
Currency
</label>


<select
name="currency"
value={formData.currency}
onChange={handleChange}
className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"
>

<option value="KES">
KES
</option>

{/* <option value="USD">
USD
</option> */}

</select>


</div>


</div>




{/* BEDROOMS + ENSUITE */}

<div className="grid lg:grid-cols-2 gap-6 mt-6">


<div>

<label className="font-semibold dark:text-white block mb-2">
Bedrooms
<span className="text-red-500 ml-1">*</span>
</label>


<input
type="number"
name="bedrooms"
value={formData.bedrooms}
onChange={handleChange}
placeholder="3"
className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"
/>


{errors.bedrooms && (
<p className="text-red-500 text-sm mt-2">
{errors.bedrooms}
</p>
)}

</div>




<div>

<label className="font-semibold dark:text-white block mb-2">
Ensuite Status
<span className="text-red-500 ml-1">*</span>
</label>


<input
  type="text"
  name="ensuite_status"
  value={formData.ensuite_status}
  onChange={handleChange}
  placeholder="e.g. All Ensuite, Master Ensuite, 3 of 5 Ensuite"
  className="
    w-full
    rounded-xl
    border
    border-gray-300
    dark:border-white/10
    dark:bg-[#1A1A1A]
    dark:text-white
    px-4
    py-3
    outline-none
    focus:border-[#C9A758]
  "
/>


{errors.ensuite_status && (
<p className="text-red-500 text-sm mt-2">
{errors.ensuite_status}
</p>
)}

</div>


</div>





{/* AREA + AVAILABLE UNITS */}

<div className="grid lg:grid-cols-2 gap-6 mt-6">


<div>

<label className="font-semibold dark:text-white block mb-2">
Area (Square Metres)
{/* <span className="text-red-500 ml-1">*</span> */}
</label>


<input
type="number"
name="area_sqm"
value={formData.area_sqm}
onChange={handleChange}
placeholder="120"
className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"
/>


{/* {errors.area_sqm && (
<p className="text-red-500 text-sm mt-2">
{errors.area_sqm}
</p>
)} */}

</div>




<div>

<label className="font-semibold dark:text-white block mb-2">
Available Units
</label>


<input
type="number"
name="available_units"
value={formData.available_units}
onChange={handleChange}
placeholder="10"
className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"
/>


</div>


</div>


</section>

{/* DESCRIPTION & LOCATION */}

<section
className="
bg-white
dark:bg-[#121212]
border
border-gray-200
dark:border-white/10
rounded-3xl
p-8
"
>

<h2 className="text-2xl font-bold dark:text-white mb-8">
Description & Location
</h2>



{/* DESCRIPTION */}

<div>

<label className="font-semibold dark:text-white block mb-2">
Description
<span className="text-red-500 ml-1">*</span>
</label>


<textarea
  rows={8}
  name="description"
  value={formData.description}
  onChange={handleChange}
  placeholder={`Describe the property, its key features and amenities.

Example:
Modern 3-bedroom apartment with spacious living areas and natural lighting.

Amenities:
• Swimming pool
• Fully equipped gym
• Secure parking
• 24/7 security
• Borehole water
• Backup generator
• High-speed internet`}
  className="
    w-full
    rounded-xl
    border
    border-gray-300
    dark:border-white/10
    dark:bg-[#1A1A1A]
    dark:text-white
    px-4
    py-3
    outline-none
    resize-none
    focus:border-[#C9A758]
  "
/>


{errors.description && (
<p className="text-red-500 text-sm mt-2">
{errors.description}
</p>
)}

</div>





{/* LOCATION */}

<div className="grid lg:grid-cols-2 gap-6 mt-6">


<div>

<label className="font-semibold dark:text-white block mb-2">
Location
<span className="text-red-500 ml-1">*</span>
</label>


<input

type="text"

name="location"

value={formData.location}

onChange={handleChange}

placeholder="Westlands, Nairobi"

className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"

/>


{errors.location && (
<p className="text-red-500 text-sm mt-2">
{errors.location}
</p>
)}

</div>




<div>

<label className="font-semibold dark:text-white block mb-2">
Google Maps URL
</label>


<input

type="url"

name="google_maps_url"

value={formData.google_maps_url}

onChange={handleChange}

placeholder="https://maps.google.com/..."

className="
w-full
rounded-xl
border
border-gray-300
dark:border-white/10
dark:bg-[#1A1A1A]
dark:text-white
px-4
py-3
outline-none
focus:border-[#C9A758]
"

/>


</div>


</div>


</section>

{/* PROPERTY MEDIA */}

<section
className="
bg-white
dark:bg-[#121212]
border
border-gray-200
dark:border-white/10
rounded-3xl
p-8
"
>

<h2 className="text-2xl font-bold dark:text-white mb-8">
Property Media
</h2>


<div
className="
border-2
border-dashed
border-gray-300
dark:border-white/20
rounded-3xl
p-10
text-center
hover:border-[#C9A758]
transition
cursor-pointer
bg-gray-50
dark:bg-[#1A1A1A]
"
>


<input

type="file"

multiple

accept="image/*,video/*"

id="mediaUpload"

hidden

onChange={(e) => {

  const files = Array.from(e.target.files);


  const newFiles = [
    ...mediaFiles,
    ...files
  ];


  const newPreviews = files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
    type: file.type.startsWith("image/")
      ? "image"
      : "video",
    isExisting: false,
  }));


  setMediaFiles(newFiles);


  setMediaPreviews([
    ...mediaPreviews,
    ...newPreviews
  ]);

}}

/>



<label
htmlFor="mediaUpload"
className="cursor-pointer block"
>


<div
className="
w-16
h-16
mx-auto
rounded-full
bg-[#C9A758]/10
flex
items-center
justify-center
text-[#C9A758]
text-3xl
mb-4
"
>

+

</div>



<h3
className="
text-lg
font-semibold
dark:text-white
"
>

Upload Property Images & Videos

</h3>



<p
className="
text-gray-500
dark:text-gray-400
mt-2
"
>

Click to browse or select multiple files

</p>



<p
className="
text-sm
text-gray-400
mt-3
"
>

First image selected will automatically become the cover image.

</p>


</label>

</div>

{mediaPreviews.length > 0 && (

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

{mediaPreviews.map((media, index) => (

<div
key={index}
className="
relative
rounded-2xl
overflow-hidden
border
border-gray-200
dark:border-white/10
bg-white
dark:bg-[#1A1A1A]
"
>

  {index === 0 && (
  <div
    className="
      absolute
      top-3
      left-3
      bg-[#C9A758]
      text-black
      text-xs
      font-bold
      px-3
      py-1
      rounded-full
      shadow-lg
    "
  >
    ★ Cover
  </div>
)}

{media.type === "image" ? (

<img
src={media.url}
alt=""
className="
w-full
h-56
object-cover
cursor-pointer
"
/>

) : (

<video
src={media.url}
controls
className="
w-full
h-56
object-cover
"
/>

)}

<div className="p-4">
  <div className="flex justify-between items-center w-full">

    <button
      type="button"
      onClick={() => setCoverImage(index)}
      className="
        flex
        items-center
        gap-2
        px-3
        py-2
        rounded-lg
        bg-[#C9A758]
        text-black
        hover:opacity-90
        transition
      "
    >
      <Star size={15} />
      {index === 0 ? "Cover" : "Set Cover"}
    </button>

    <button
      type="button"
      onClick={() => removeMedia(index)}
      className="
        px-3
        py-2
        rounded-lg
        bg-red-100
        text-red-600
        hover:bg-red-200
        transition
      "
    >
      Delete
    </button>

  </div>
</div>

</div>

))}

</div>

)}



</section>

{/* =========================================================
    VIRTUAL TOUR
========================================================= */}

<section
  className="
    bg-white
    dark:bg-[#121212]
    border
    border-gray-200
    dark:border-white/10
    rounded-3xl
    p-8
  "
>

  <h2 className="text-2xl font-bold dark:text-white mb-2">
    Virtual Tour
  </h2>

  <p className="text-gray-500 dark:text-gray-400 mb-8">
    Add a virtual tour video for this property. You can
    upload a video, provide a YouTube link, or use both.
    This section is optional.
  </p>


  {/* =====================================================
      UPLOAD VIDEO
  ===================================================== */}

  <div>

    <label className="font-semibold dark:text-white block mb-2">
      Upload Virtual Tour
    </label>

    <div
      className="
        border-2
        border-dashed
        border-gray-300
        dark:border-white/20
        rounded-2xl
        p-8
        text-center
        hover:border-[#C9A758]
        transition
        bg-gray-50
        dark:bg-[#1A1A1A]
      "
    >

      <input
        type="file"
        id="virtualTourUpload"
        accept="video/*"
        hidden
        onChange={handleVirtualTourUpload}
      />

      <label
        htmlFor="virtualTourUpload"
        className="cursor-pointer block"
      >

        <div
          className="
            w-14
            h-14
            mx-auto
            rounded-full
            bg-[#C9A758]/10
            flex
            items-center
            justify-center
            text-[#C9A758]
            text-2xl
            mb-4
          "
        >
          +
        </div>

        <h3
          className="
            text-lg
            font-semibold
            dark:text-white
          "
        >
          {virtualTourFile
            ? virtualTourFile.name
            : "Upload Virtual Tour Video"}
        </h3>

        <p
          className="
            mt-2
            text-gray-500
            dark:text-gray-400
          "
        >
          Click to browse and select a video
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Maximum size: 100MB
        </p>

      </label>

    </div>


    {/* VIDEO PREVIEW */}

    {virtualTourPreview && (

      <div className="mt-6">

        <video
          src={virtualTourPreview}
          controls
          className="
            w-full
            max-h-[400px]
            rounded-2xl
            object-cover
            bg-black
          "
        />

      </div>

    )}

  </div>


  {/* =====================================================
      YOUTUBE LINK
  ===================================================== */}

  <div className="mt-8">

    <label
      className="
        font-semibold
        dark:text-white
        block
        mb-2
      "
    >
      YouTube Virtual Tour
    </label>

    <input
      type="url"
      name="virtual_tour_url"
      value={formData.virtual_tour_url}
      onChange={handleChange}
      placeholder="https://www.youtube.com/watch?v=..."
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        dark:border-white/10
        dark:bg-[#1A1A1A]
        dark:text-white
        px-4
        py-3
        outline-none
        focus:border-[#C9A758]
      "
    />

    <p
      className="
        mt-2
        text-sm
        text-gray-500
        dark:text-gray-400
      "
    >
      Optional. Add a YouTube link if the virtual tour
      is also available on YouTube.
    </p>

  </div>


  {/* =====================================================
      BOTH OPTIONS
  ===================================================== */}

  <div
    className="
      mt-8
      rounded-2xl
      border
      border-[#C9A758]/20
      bg-[#C9A758]/5
      p-5
    "
  >

    <p className="text-sm text-gray-400">

      💡 You can provide either option or both. Visitors
      will be able to choose how they want to view the
      virtual tour.

    </p>

  </div>

</section>

{/* ------------------------STATUS----------------------------- */}

<div className="mt-6">

  <label className="font-semibold dark:text-white block mb-2">
    Status
  </label>

  <select
    name="status"
    value={formData.status}
    onChange={handleChange}
    className="
      w-full
      rounded-xl
      border
      border-gray-300
      dark:border-white/10
      dark:bg-[#1A1A1A]
      dark:text-white
      px-4
      py-3
      outline-none
      focus:border-[#C9A758]
    "
  >
    <option value="draft">
      Draft
    </option>

    <option value="published">
      Published
    </option>

  </select>

</div>


{/* ACTION BUTTONS */}

<section
  className="
    flex
    flex-col
    md:flex-row
    justify-end
    gap-4
    pt-2
  "
>

  <button
    type="button"
    onClick={() => navigate("/admin/listings")}
    className="
      px-8
      py-3
      rounded-xl
      border
      border-gray-300
      dark:border-white/10
      dark:text-white
      hover:bg-gray-100
      dark:hover:bg-[#1A1A1A]
      transition
    "
  >
    Cancel
  </button>

  <button
  type="button"
  onClick={saveListing}
  disabled={loading}
  className="
    px-8
    py-3
    rounded-xl
    bg-[#101F34]
    text-white
    hover:opacity-90
    transition
    flex
    items-center
    justify-center
    gap-2
    disabled:opacity-50
  "
>
  <Save size={18} />

  {loading ? "Saving..." : "Save Listing"}
</button>

</section>


</form>
);
}