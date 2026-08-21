import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Star } from "lucide-react";

import { supabase } from "../../../config/SupabaseClient";
import FeedbackModal from "../../../components/modals/FeedbackModal";


export default function ListingForm({
  mode = "create",
  redirectPath = "/admin/listings",
}) {

  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigate = useNavigate();
  const { listingId } = useParams();


  // =========================================================
  // GENERAL FORM STATE
  // =========================================================

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const areaRef = useRef(null);


  // =========================================================
  // DEVELOPMENTS
  // =========================================================

  const [developments, setDevelopments] = useState([]);


  // =========================================================
  // AMENITIES
  // =========================================================

  const [amenities, setAmenities] = useState([]);

  const [selectedAmenities, setSelectedAmenities] = useState([]);


  // =========================================================
  // PROPERTY MEDIA
  // =========================================================

  const [mediaFiles, setMediaFiles] = useState([]);

  const [mediaPreviews, setMediaPreviews] = useState([]);

  const [deletedMedia, setDeletedMedia] = useState([]);


  // =========================================================
  // VIRTUAL TOUR
  // =========================================================

  const [virtualTourFile, setVirtualTourFile] = useState(null);

  const [virtualTourPreview, setVirtualTourPreview] = useState("");

  const [virtualTourPath, setVirtualTourPath] = useState("");

  const [deletingVirtualTour, setDeletingVirtualTour] =
    useState(false);


  // =========================================================
  // FEEDBACK MODAL
  // =========================================================

  const [feedback, setFeedback] = useState({

    isOpen: false,

    type: "success",

    title: "",

    message: "",

  });


  // =========================================================
  // FORM DATA
  // =========================================================

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

    description: "",

    location: "",

    google_maps_url: "",

    virtual_tour_url: "",

    status: "draft",

    available_units: "",

  });



  // =========================================================
  // FETCH DEVELOPMENTS
  // =========================================================

  useEffect(() => {

    const fetchDevelopments = async () => {

      const { data, error } = await supabase
        .from("developments")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Developments fetch error:", error);
        return;
      }

      setDevelopments(data || []);
    };

    fetchDevelopments();

  }, []);


  // =========================================================
  // FETCH AMENITIES
  // =========================================================

  useEffect(() => {

    const fetchAmenities = async () => {

      const { data, error } = await supabase
        .from("amenities")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Amenities fetch error:", error);
        return;
      }

      setAmenities(data || []);
    };

    fetchAmenities();

  }, []);


  // =========================================================
  // FETCH LISTING FOR EDIT
  // =========================================================

  useEffect(() => {

    if (mode !== "edit" || !listingId) return;


    const fetchListing = async () => {

      setLoading(true);

      try {

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
            ),
            listing_amenities (
              amenity_id
            )
          `)
          .eq("id", listingId)
          .single();


        if (error) throw error;


        // -----------------------------------------------------
        // FORM DATA
        // -----------------------------------------------------

        setFormData({

          development_id: data.development_id || "",

          title: data.title || "",

          slug: data.slug || "",

          listing_type: data.listing_type || "sale",

          property_type: data.property_type || "",

          price: data.price ?? "",

          currency: data.currency || "KES",

          bedrooms: data.bedrooms ?? "",

          ensuite_status: data.ensuite_status || "",

          area_sqm: data.area_sqm ?? "",

          description: data.description || "",

          location: data.location || "",

          google_maps_url: data.google_maps_url || "",

          virtual_tour_url: data.virtual_tour_url || "",

          status: data.status || "draft",

          available_units: data.available_units ?? "",

        });


        // -----------------------------------------------------
        // VIRTUAL TOUR
        // -----------------------------------------------------

        setVirtualTourPath(
          data.virtual_tour_path || ""
        );


        // -----------------------------------------------------
        // PROPERTY MEDIA
        // -----------------------------------------------------

        if (data.listing_media) {

          const sortedMedia = [
            ...data.listing_media
          ].sort(
            (a, b) =>
              (a.display_order || 0) -
              (b.display_order || 0)
          );


          setMediaPreviews(

            sortedMedia.map((item) => ({

              id: item.id,

              url: item.media_url,

              storage_path: item.storage_path,

              type: item.media_type,

              is_primary: item.is_primary,

              display_order: item.display_order,

              isExisting: true,

            }))

          );

        }


        // -----------------------------------------------------
        // AMENITIES
        // -----------------------------------------------------

        if (data.listing_amenities) {

          setSelectedAmenities(

            data.listing_amenities.map(
              (item) => item.amenity_id
            )

          );

        }

      } catch (error) {

        console.error(
          "Listing fetch error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchListing();

  }, [mode, listingId]);


  // =========================================================
  // HANDLE FORM CHANGES
  // =========================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));


    // -------------------------------------------------------
    // AUTO-GENERATE SLUG FROM TITLE
    // -------------------------------------------------------

    if (name === "title") {

  const baseSlug = value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const uniqueNumber =
    Math.floor(
      100000 +
      Math.random() * 900000
    );

  const generatedSlug =
    baseSlug
      ? `${baseSlug}-${uniqueNumber}`
      : "";

  setFormData((prev) => ({
    ...prev,
    title: value,
    slug: generatedSlug,
  }));

}


    // -------------------------------------------------------
    // CLEAR FIELD ERROR
    // -------------------------------------------------------

    setErrors((prev) => ({

      ...prev,

      [name]: "",

    }));

  };

  // =========================================================
  // HANDLE AMENITY SELECTION
  // =========================================================

  const toggleAmenity = (amenityId) => {

    setSelectedAmenities((prev) => {

      if (prev.includes(amenityId)) {

        return prev.filter(
          (id) => id !== amenityId
        );

      }

      return [
        ...prev,
        amenityId,
      ];

    });

  };


  // =========================================================
  // HANDLE MEDIA UPLOAD
  // =========================================================

  const handleMediaUpload = (e) => {

    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) return;


    const newPreviews = files.map((file) => ({

      file,

      url: URL.createObjectURL(file),

      type: file.type.startsWith("image/")
        ? "image"
        : "video",

      isExisting: false,

      is_primary: false,

    }));


    setMediaFiles((prev) => [

      ...prev,

      ...files,

    ]);


    setMediaPreviews((prev) => [

      ...prev,

      ...newPreviews,

    ]);


    // Allow the same file
    // to be selected again

    e.target.value = "";

  };


  // =========================================================
  // REMOVE MEDIA
  // =========================================================

  const removeMedia = (index) => {

    const media = mediaPreviews[index];

    if (!media) return;


    // Existing media
    // Delete from storage/database
    // when the listing is saved

    if (media.isExisting) {

      setDeletedMedia((prev) => [

        ...prev,

        media,

      ]);

    }


    // Newly selected media
    else {

      setMediaFiles((prev) =>

        prev.filter(
          (file) => file !== media.file
        )

      );


      if (media.url) {

        URL.revokeObjectURL(
          media.url
        );

      }

    }


    setMediaPreviews((prev) =>

      prev.filter(
        (_, i) => i !== index
      )

    );

  };


  // =========================================================
  // SET COVER IMAGE
  // =========================================================

  const setCoverImage = async (index) => {

    const selectedMedia =
      mediaPreviews[index];

    if (!selectedMedia) return;


    // -------------------------------------------------------
    // NEW MEDIA
    // -------------------------------------------------------

    if (!selectedMedia.isExisting) {

      setMediaPreviews((prev) => {

        const updated = [...prev];

        const selected =
          updated.splice(index, 1)[0];

        updated.unshift(selected);

        return updated;

      });

      return;

    }


    // -------------------------------------------------------
    // EXISTING MEDIA
    // -------------------------------------------------------

    try {

      setLoading(true);


      // Remove primary status
      // from all listing media

      const {
        error: resetError
      } = await supabase

        .from("listing_media")

        .update({
          is_primary: false,
        })

        .eq(
          "listing_id",
          listingId
        );


      if (resetError) {
        throw resetError;
      }


      // Set selected media as primary

      const {
        error: primaryError
      } = await supabase

        .from("listing_media")

        .update({

          is_primary: true,

          display_order: 1,

        })

        .eq(
          "id",
          selectedMedia.id
        );


      if (primaryError) {
        throw primaryError;
      }


      // Update local order

      setMediaPreviews((prev) => {

        const updated = [...prev];

        const selected =
          updated.splice(index, 1)[0];

        updated.unshift(selected);

        return updated;

      });


    } catch (error) {

      console.error(
        "Cover image update failed:",
        error
      );


      showFeedback({

        type: "error",

        title: "Cover Image Update Failed",

        message:
          error.message ||
          "Unable to update the cover image.",

      });


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // HANDLE VIRTUAL TOUR UPLOAD
  // =========================================================

  const handleVirtualTourUpload = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) return;


    // Only videos are allowed

    if (!file.type.startsWith("video/")) {

      showFeedback({

        type: "error",

        title: "Invalid File",

        message:
          "Please select a video file.",

      });

      e.target.value = "";

      return;

    }


    // Maximum 100MB

    if (
      file.size >
      100 * 1024 * 1024
    ) {

      showFeedback({

        type: "error",

        title: "Video Too Large",

        message:
          "Virtual tour video must be smaller than 100MB.",

      });

      e.target.value = "";

      return;

    }


    // Remove previous preview URL
    // before creating a new one

    if (virtualTourPreview) {

      URL.revokeObjectURL(
        virtualTourPreview
      );

    }


    setVirtualTourFile(file);

    setVirtualTourPreview(
      URL.createObjectURL(file)
    );


    // Allow selecting the same
    // file again later

    e.target.value = "";

  };


  // =========================================================
  // REMOVE NEW VIRTUAL TOUR SELECTION
  // =========================================================

  const removeVirtualTourSelection = () => {

    if (virtualTourPreview) {

      URL.revokeObjectURL(
        virtualTourPreview
      );

    }


    setVirtualTourFile(null);

    setVirtualTourPreview("");

  };


  // =========================================================
  // DELETE SAVED VIRTUAL TOUR
  // =========================================================

  const deleteVirtualTour = async () => {

    // No saved virtual tour
    // means nothing to delete

    if (!virtualTourPath) return;


    try {

      setDeletingVirtualTour(true);


      // Remove video from storage

      const {
        error: storageError
      } = await supabase.storage

        .from("virtual-tours")

        .remove([
          virtualTourPath
        ]);


      if (storageError) {
        throw storageError;
      }


      // Remove references from listing

      const {
        error: dbError
      } = await supabase

        .from("listings")

        .update({

          virtual_tour_path: null,

          virtual_tour_url: null,

        })

        .eq(
          "id",
          listingId
        );


      if (dbError) {
        throw dbError;
      }


      // Clear local state

      setVirtualTourPath("");

      setVirtualTourFile(null);

      setVirtualTourPreview("");


      setFormData((prev) => ({

        ...prev,

        virtual_tour_url: "",

      }));


      showFeedback({

        type: "success",

        title: "Virtual Tour Deleted",

        message:
          "The virtual tour has been removed successfully.",

      });


    } catch (error) {

      console.error(
        "Virtual tour deletion failed:",
        error
      );


      showFeedback({

        type: "error",

        title: "Delete Failed",

        message:
          error.message ||
          "Unable to delete the virtual tour.",

      });


    } finally {

      setDeletingVirtualTour(false);

    }

  };

// =========================================================
// FEEDBACK MODAL
// =========================================================

const showFeedback = ({
  type = "success",
  title,
  message,
}) => {

  setFeedback({
    isOpen: true,
    type,
    title,
    message,
  });

};


const closeFeedback = () => {

  setFeedback((prev) => ({
    ...prev,
    isOpen: false,
  }));

};

// =========================================================
// VALIDATION
// =========================================================

const validate = () => {

  const newErrors = {};


  // Development
  if (!formData.development_id) {
    newErrors.development_id =
      "Please select a development";
  }


  // Title
  if (!formData.title.trim()) {
    newErrors.title =
      "Listing title is required";
  }


  // Listing type
  if (!formData.listing_type) {
    newErrors.listing_type =
      "Listing type is required";
  }


  // Property type
  if (!formData.property_type.trim()) {
    newErrors.property_type =
      "Property type is required";
  }


  // Price
  if (
    formData.price === "" ||
    formData.price === null ||
    Number(formData.price) < 0
  ) {
    newErrors.price =
      "Please enter a valid price";
  }


  // Description
  if (!formData.description.trim()) {
    newErrors.description =
      "Description is required";
  }


  // Location
  if (!formData.location.trim()) {
    newErrors.location =
      "Location is required";
  }


  // -------------------------------------------------------
  // OPTIONAL FIELDS
  // -------------------------------------------------------
  // Bedrooms, ensuite status and area are intentionally
  // optional because not every property is residential.
  //
  // Example:
  // Office → no bedrooms / ensuite / area may be undefined.
  // -------------------------------------------------------


  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;

};



// =========================================================
// UPLOAD PROPERTY MEDIA
// =========================================================

// const uploadMedia = async (listingId) => {

//   if (!mediaFiles.length) {
//     return [];
//   }

//   const uploadedFiles = [];

//   for (const [index, file] of mediaFiles.entries()) {

//     try {

//       // -----------------------------------------------------
//       // FILE EXTENSION
//       // -----------------------------------------------------

//       const fileExt =
//         file.name
//           .split(".")
//           .pop()
//           .toLowerCase();


//       // -----------------------------------------------------
//       // UNIQUE FILE NAME
//       // -----------------------------------------------------

//       const fileName =
//         `${crypto.randomUUID()}.${fileExt}`;


//       // -----------------------------------------------------
//       // STORAGE PATH
//       // -----------------------------------------------------

//       const filePath =
//         `${listingId}/${fileName}`;


//       // -----------------------------------------------------
//       // UPLOAD TO STORAGE
//       // -----------------------------------------------------

//       const {
//         error: uploadError
//       } = await supabase.storage
//         .from("listing-media")
//         .upload(
//           filePath,
//           file,
//           {
//             cacheControl: "3600",
//             upsert: false,
//           }
//         );


//       if (uploadError) {
//         throw uploadError;
//       }


//       // -----------------------------------------------------
//       // GET PUBLIC URL
//       // -----------------------------------------------------

//       const {
//         data: publicUrlData
//       } = supabase.storage
//         .from("listing-media")
//         .getPublicUrl(filePath);


//       if (!publicUrlData?.publicUrl) {

//         throw new Error(
//           "Unable to generate the public URL for the uploaded image."
//         );

//       }


//       // -----------------------------------------------------
//       // PREPARE DATABASE RECORD
//       // -----------------------------------------------------

//       uploadedFiles.push({

//         listing_id: listingId,

//         media_url:
//           publicUrlData.publicUrl,

//         storage_path:
//           filePath,

//         media_type:
//           file.type.startsWith("image/")
//             ? "image"
//             : "video",

//         is_primary:
//           index === 0 &&
//           mediaPreviews.every(
//             (media, previewIndex) =>
//               previewIndex === 0 ||
//               !media.isExisting
//           ),

//         display_order:
//           index + 1,

//         file_name:
//           file.name,

//         file_size:
//           file.size,

//       });

//     } catch (error) {

//       console.error(
//         `Media upload failed for ${file.name}:`,
//         error
//       );

//       throw error;
//     }

//   }


//   return uploadedFiles;

// };


// =========================================================
 // UPLOAD VIRTUAL TOUR
 // =========================================================

 const uploadVirtualTour = async (listingId) => {

   if (!virtualTourFile) {
     return null;
   }


   // -------------------------------------------------------
   // Get file extension
   // -------------------------------------------------------

   const fileExt =
     virtualTourFile.name
       .split(".")
       .pop()
       .toLowerCase();


   // -------------------------------------------------------
   // Generate unique filename
   // -------------------------------------------------------

   const fileName =
     `virtual-tour-${Date.now()}-${Math.random()
       .toString(36)
       .substring(2, 8)}.${fileExt}`;


   // -------------------------------------------------------
   // Listing-specific folder
   // -------------------------------------------------------

   const filePath =
     `${listingId}/${fileName}`;


   // -------------------------------------------------------
   // Upload to Storage
   // -------------------------------------------------------

   const {
     error
   } = await supabase.storage

     .from("virtual-tours")

     .upload(
       filePath,
       virtualTourFile,
       {
         cacheControl: "3600",
         upsert: false,
       }
     );


   if (error) {
     throw error;
   }


   return filePath;

 };




// =========================================================
// CLEAN UP PREVIEW URLS
// =========================================================

useEffect(() => {

  return () => {

    mediaPreviews.forEach((media) => {

      if (
        !media.isExisting &&
        media.url
      ) {

        URL.revokeObjectURL(media.url);

      }

    });

  };

}, [mediaPreviews]);


useEffect(() => {

  return () => {

    if (virtualTourPreview) {

      URL.revokeObjectURL(
        virtualTourPreview
      );

    }

  };

}, [virtualTourPreview]);

    // =========================================================
// UPLOAD PROPERTY MEDIA
// =========================================================

const uploadMedia = async (listingId) => {

  if (mediaFiles.length === 0) {
    return [];
  }


  const uploadedFiles = [];


  // -------------------------------------------------------
  // Determine whether an existing cover already exists
  // -------------------------------------------------------

  const existingPrimary =
    mediaPreviews.some(
      (media) =>
        media.isExisting &&
        media.is_primary
    );


  // -------------------------------------------------------
  // Upload each new file
  // -------------------------------------------------------

  for (
    let i = 0;
    i < mediaFiles.length;
    i++
  ) {

    const file = mediaFiles[i];


    // -----------------------------------------------------
    // File extension
    // -----------------------------------------------------

    const fileExt =
      file.name
        .split(".")
        .pop()
        .toLowerCase();


    // -----------------------------------------------------
    // Unique filename
    // -----------------------------------------------------

    const fileName =
      `${Date.now()}-${i}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${fileExt}`;


    // -----------------------------------------------------
    // Listing-specific folder
    // -----------------------------------------------------

    const filePath =
      `${listingId}/${fileName}`;


    // -----------------------------------------------------
    // Upload to Supabase Storage
    // -----------------------------------------------------

    const {
      error: uploadError
    } = await supabase.storage

      .from("listing-media")

      .upload(
        filePath,
        file
      );


    if (uploadError) {
      throw uploadError;
    }


    // -----------------------------------------------------
    // Public URL
    // -----------------------------------------------------

    const {
      data: publicUrlData
    } =
      supabase.storage

        .from("listing-media")

        .getPublicUrl(
          filePath
        );


    // -----------------------------------------------------
    // Determine whether this becomes primary
    // -----------------------------------------------------

    const correspondingPreview =
      mediaPreviews.find(
        (media) =>
          media.file === file
      );


    const previewIndex =
      mediaPreviews.findIndex(
        (media) =>
          media.file === file
      );


    const shouldBePrimary =
      !existingPrimary &&
      previewIndex === 0 &&
      correspondingPreview;


    // -----------------------------------------------------
    // Prepare database record
    // -----------------------------------------------------

    uploadedFiles.push({

      media_url:
        publicUrlData.publicUrl,

      storage_path:
        filePath,

      media_type:
        file.type.startsWith("image/")
          ? "image"
          : "video",

      is_primary:
        Boolean(shouldBePrimary),

      display_order:
        previewIndex >= 0
          ? previewIndex + 1
          : i + 1,

      file_name:
        file.name,

      file_size:
        file.size,

    });

  }


  return uploadedFiles;

};

// =========================================================
// FEEDBACK MODAL
// =========================================================

// const showFeedback = ({
//   type = "success",
//   title,
//   message,
// }) => {

//   setFeedback({

//     isOpen: true,

//     type,

//     title,

//     message,

//   });

// };


// const closeFeedback = () => {

//   setFeedback((prev) => ({

//     ...prev,

//     isOpen: false,

//   }));

// };

// =========================================================
// SAVE LISTING
// =========================================================

const saveListing = async () => {

  // -------------------------------------------------------
  // VALIDATE FORM
  // -------------------------------------------------------

  if (!validate()) {

    // Scroll to area only if it somehow
    // has an error in the future
    if (errors.area_sqm) {

      setTimeout(() => {

        areaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        areaRef.current?.focus();

      }, 50);

    }

    return;
  }


  try {

    setLoading(true);


    // =====================================================
    // PREPARE LISTING DATA
    // =====================================================

    const payload = {

      development_id:
        formData.development_id,

      title:
        formData.title.trim(),

      slug:
        formData.slug.trim(),

      listing_type:
        formData.listing_type,

      property_type:
        formData.property_type.trim(),

      price:
        formData.price === ""
          ? null
          : Number(formData.price),

      currency:
        formData.currency || "KES",

      // Optional residential fields
      bedrooms:
        formData.bedrooms === ""
          ? null
          : Number(formData.bedrooms),

      ensuite_status:
        formData.ensuite_status?.trim() || null,

      area_sqm:
        formData.area_sqm === ""
          ? null
          : Number(formData.area_sqm),

      description:
        formData.description.trim(),

      location:
        formData.location.trim(),

      google_maps_url:
        formData.google_maps_url?.trim() || null,

      virtual_tour_url:
        formData.virtual_tour_url?.trim() || null,

      status:
        formData.status || "draft",

      available_units:
        formData.available_units === ""
          ? 0
          : Number(formData.available_units),

    };


    // =====================================================
    // CREATE / UPDATE LISTING
    // =====================================================

    let listing;


    // -----------------------------------------------------
    // EDIT EXISTING LISTING
    // -----------------------------------------------------

    if (
      mode === "edit" &&
      listingId
    ) {

      const {
        data,
        error
      } = await supabase

        .from("listings")

        .update(payload)

        .eq(
          "id",
          listingId
        )

        .select()

        .single();


      if (error) {
        throw error;
      }


      listing = data;

    }


    // -----------------------------------------------------
    // CREATE NEW LISTING
    // -----------------------------------------------------

    else {

      const {
        data,
        error
      } = await supabase

        .from("listings")

        .insert([payload])

        .select()

        .single();


      if (error) {
        throw error;
      }


      listing = data;

    }


    // =====================================================
    // HANDLE VIRTUAL TOUR
    // =====================================================

    if (virtualTourFile) {

      // ---------------------------------------------------
      // Delete previous saved tour
      // ---------------------------------------------------

      if (
        mode === "edit" &&
        virtualTourPath
      ) {

        const {
          error
        } = await supabase.storage

          .from("virtual-tours")

          .remove([
            virtualTourPath
          ]);


        if (error) {
          throw error;
        }

      }


      // ---------------------------------------------------
      // Upload new tour
      // ---------------------------------------------------

      const newTourPath =
        await uploadVirtualTour(
          listing.id
        );

        setVirtualTourPath(newTourPath);


      // ---------------------------------------------------
      // Save new storage path
      // ---------------------------------------------------

      const {
        error
      } = await supabase

        .from("listings")

        .update({

          virtual_tour_path:
            newTourPath,

          virtual_tour_url:
            formData.virtual_tour_url?.trim()
              || null,

        })

        .eq(
          "id",
          listing.id
        );


      if (error) {
        throw error;
      }

    }


    // =====================================================
    // UPDATE YOUTUBE URL
    // =====================================================

    else {

      const {
        error
      } = await supabase

        .from("listings")

        .update({

          virtual_tour_url:
            formData.virtual_tour_url?.trim()
              || null,

        })

        .eq(
          "id",
          listing.id
        );


      if (error) {
        throw error;
      }

    }

    // =========================================================
// UPLOAD PROPERTY MEDIA
// =========================================================

const uploadedMedia = await uploadMedia(listing.id);


if (uploadedMedia.length > 0) {

  const { error } = await supabase
    .from("listing_media")
    .insert(
      uploadedMedia.map((media) => ({
        ...media,
        listing_id: listing.id,
      }))
    );

  if (error) {
    throw error;
  }

}





    // =====================================================
    // DELETE REMOVED PROPERTY MEDIA
    // =====================================================

    for (
      const media
      of deletedMedia
    ) {

      // ---------------------------------------------------
      // Delete from storage
      // ---------------------------------------------------

      if (
        media.storage_path
      ) {

        const {
          error
        } = await supabase.storage

          .from("listing-media")

          .remove([
            media.storage_path
          ]);


        if (error) {
          throw error;
        }

      }


      // ---------------------------------------------------
      // Delete database record
      // ---------------------------------------------------

      if (media.id) {

        const {
          error
        } = await supabase

          .from("listing_media")

          .delete()

          .eq(
            "id",
            media.id
          );


        if (error) {
          throw error;
        }

      }

    }


    // =====================================================
    // SAVE AMENITIES
    // =====================================================

    // First remove existing relationships
    // when editing.

    if (
      mode === "edit"
    ) {

      const {
        error
      } = await supabase

        .from("listing_amenities")

        .delete()

        .eq(
          "listing_id",
          listing.id
        );


      if (error) {
        throw error;
      }

    }


    // -----------------------------------------------------
    // Insert selected amenities
    // -----------------------------------------------------

    if (
      selectedAmenities.length > 0
    ) {

      const amenityRows =
        selectedAmenities.map(
          (amenityId) => ({

            listing_id:
              listing.id,

            amenity_id:
              amenityId,

          })
        );


      const {
        error
      } = await supabase

        .from("listing_amenities")

        .insert(
          amenityRows
        );


      if (error) {
        throw error;
      }

    }


    // =====================================================
    // SUCCESS
    // =====================================================

    showFeedback({

      type: "success",

      title:
        mode === "edit"
          ? "Listing Updated"
          : "Listing Created",

      message:
        mode === "edit"
          ? "The listing has been updated successfully."
          : "The listing has been created successfully.",

    });


    // Clear temporary state
    setMediaFiles([]);

    setDeletedMedia([]);



    if (virtualTourPreview) {

  URL.revokeObjectURL(
    virtualTourPreview
  );

}

setVirtualTourFile(null);

setVirtualTourPreview("");


    // -----------------------------------------------------
    // Redirect after feedback
    // -----------------------------------------------------

    setTimeout(() => {

      navigate(
        redirectPath
      );

    }, 1200);


  } catch (error) {

    console.error(
      "Save listing error:",
      error
    );


    showFeedback({

      type: "error",

      title:
        "Save Failed",

      message:
        error.message ||
        "Unable to save the listing. Please try again.",

    });

  } finally {

    setLoading(false);

  }

};





// =========================================================
// RETURN
// =========================================================

return (
  <>

  <form
    onSubmit={(e) => {
      e.preventDefault();
      saveListing();
    }}
    className="space-y-8"
  >

    {/* =====================================================
        BASIC INFORMATION
    ===================================================== */}

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

      <h2
        className="
          text-2xl
          font-bold
          dark:text-white
          mb-8
        "
      >
        Basic Information
      </h2>


      {/* DEVELOPMENT + TITLE */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* DEVELOPMENT */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Development

            <span className="text-red-500 ml-1">
              *
            </span>

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


            {developments.map(
              (development) => (

                <option
                  key={development.id}
                  value={development.id}
                >
                  {development.name}
                </option>

              )
            )}

          </select>


          {errors.development_id && (

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >
              {errors.development_id}
            </p>

          )}

        </div>


        {/* TITLE */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Listing Title

            <span className="text-red-500 ml-1">
              *
            </span>

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

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >
              {errors.title}
            </p>

          )}

        </div>

      </div>


      {/* SLUG */}

      <div className="mt-6">

  <label
    className="
      font-semibold
      dark:text-white
      block
      mb-2
    "
  >
    Slug
  </label>

  <input
    type="text"
    name="slug"
    value={formData.slug}
    readOnly
    placeholder="luxury-3-bedroom-apartment-123456"
    className="
      w-full
      rounded-xl

      border
      border-gray-300
      dark:border-white/10

      bg-gray-100
      dark:bg-[#151515]

      text-gray-500
      dark:text-gray-400

      px-4
      py-3

      cursor-not-allowed

      outline-none
    "
  />

  <p className="mt-2 text-xs text-gray-500">
    Automatically generated from the property title.
  </p>

</div>


      {/* LISTING TYPE + PROPERTY TYPE */}

      <div
        className="
          grid
          lg:grid-cols-2
          gap-6
          mt-6
        "
      >

        {/* LISTING TYPE */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Listing Type

            <span className="text-red-500 ml-1">
              *
            </span>

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

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >
              {errors.listing_type}
            </p>

          )}

        </div>


        {/* PROPERTY TYPE */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Property Type

            <span className="text-red-500 ml-1">
              *
            </span>

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

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >
              {errors.property_type}
            </p>

          )}

        </div>

      </div>

    </section>


    {/* =====================================================
        PROPERTY DETAILS & PRICING
    ===================================================== */}

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

      <h2
        className="
          text-2xl
          font-bold
          dark:text-white
          mb-8
        "
      >
        Property Details & Pricing
      </h2>


      {/* PRICE + CURRENCY */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* PRICE */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Price

            <span className="text-red-500 ml-1">
              *
            </span>

          </label>


          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="2500000"
            min="0"
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

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >
              {errors.price}
            </p>

          )}

        </div>


        {/* CURRENCY */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
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

          </select>

        </div>

      </div>


      {/* BEDROOMS + ENSUITE */}

      <div
        className="
          grid
          lg:grid-cols-2
          gap-6
          mt-6
        "
      >

        {/* BEDROOMS */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Bedrooms

            <span className="text-gray-400 text-sm ml-2">
              Optional
            </span>

          </label>


          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="3"
            min="0"
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


        {/* ENSUITE */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Ensuite Status

            <span className="text-gray-400 text-sm ml-2">
              Optional
            </span>

          </label>


          <input
            type="text"
            name="ensuite_status"
            value={formData.ensuite_status}
            onChange={handleChange}
            placeholder="All Ensuite, Master Ensuite..."
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


      {/* AREA + AVAILABLE UNITS */}

      <div
        className="
          grid
          lg:grid-cols-2
          gap-6
          mt-6
        "
      >

        {/* AREA */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Area (Square Metres)

            <span className="text-gray-400 text-sm ml-2">
              Optional
            </span>

          </label>


          <input
            ref={areaRef}
            type="number"
            name="area_sqm"
            value={formData.area_sqm}
            onChange={handleChange}
            placeholder="120"
            min="0"
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


        {/* AVAILABLE UNITS */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Available Units

            <span className="text-gray-400 text-sm ml-2">
              Optional
            </span>

          </label>


          <input
            type="number"
            name="available_units"
            value={formData.available_units}
            onChange={handleChange}
            placeholder="10"
            min="0"
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


    {/* =====================================================
        NEXT SECTION:
        DESCRIPTION & LOCATION
    ===================================================== */}

    {/* =====================================================
        DESCRIPTION & LOCATION
    ===================================================== */}

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

      <h2
        className="
          text-2xl
          font-bold
          dark:text-white
          mb-8
        "
      >
        Description & Location
      </h2>


      {/* DESCRIPTION */}

      <div>

        <label
          className="
            font-semibold
            dark:text-white
            block
            mb-2
          "
        >
          Description

          <span className="text-red-500 ml-1">
            *
          </span>

        </label>


        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={8}
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

          <p
            className="
              text-red-500
              text-sm
              mt-2
            "
          >
            {errors.description}
          </p>

        )}

      </div>


      {/* LOCATION */}

      <div
        className="
          grid
          lg:grid-cols-2
          gap-6
          mt-6
        "
      >

        {/* LOCATION */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Location

            <span className="text-red-500 ml-1">
              *
            </span>

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

            <p
              className="
                text-red-500
                text-sm
                mt-2
              "
            >
              {errors.location}
            </p>

          )}

        </div>


        {/* GOOGLE MAPS URL */}

        <div>

          <label
            className="
              font-semibold
              dark:text-white
              block
              mb-2
            "
          >
            Google Maps URL

            <span className="text-gray-400 text-sm ml-2">
              Optional
            </span>

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


    {/* =====================================================
        AMENITIES
    ===================================================== */}

    {/* <section
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

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-3
          mb-8
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
              dark:text-white
            "
          >
            Amenities
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
              mt-2
            "
          >
            Select the amenities available at this property.
          </p>

        </div>


        <span
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          {selectedAmenities.length} selected
        </span>

      </div>


      {amenities.length === 0 ? (

        <div
          className="
            border
            border-dashed
            border-gray-300
            dark:border-white/10
            rounded-2xl
            p-8
            text-center
            text-gray-500
            dark:text-gray-400
          "
        >
          No amenities available yet.
        </div>

      ) : (

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
          "
        >

          {amenities.map((amenity) => {

            const isSelected =
              selectedAmenities.includes(
                amenity.id
              );


            return (

              <button
                key={amenity.id}
                type="button"
                onClick={() =>
                  toggleAmenity(amenity.id)
                }
                className={`
                  w-full
                  text-left
                  px-5
                  py-4
                  rounded-xl
                  border
                  transition
                  duration-200
                  ${
                    isSelected
                      ? `
                        border-[#C9A758]
                        bg-[#C9A758]/10
                        text-[#C9A758]
                      `
                      : `
                        border-gray-200
                        dark:border-white/10
                        text-gray-700
                        dark:text-gray-300
                        hover:border-[#C9A758]/50
                        hover:bg-gray-50
                        dark:hover:bg-[#1A1A1A]
                      `
                  }
                `}
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <span
                    className="
                      font-medium
                    "
                  >
                    {amenity.name}
                  </span>


                  <span
                    className={`
                      w-5
                      h-5
                      rounded-md
                      border
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-bold
                      ${
                        isSelected
                          ? `
                            border-[#C9A758]
                            bg-[#C9A758]
                            text-black
                          `
                          : `
                            border-gray-300
                            dark:border-white/20
                          `
                      }
                    `}
                  >
                    {isSelected ? "✓" : ""}
                  </span>

                </div>

              </button>

            );

          })}

        </div>

      )}

    </section> */}


    {/* =====================================================
        NEXT SECTION:
        PROPERTY MEDIA
    ===================================================== */}
    {/* =====================================================
        PROPERTY MEDIA
    ===================================================== */}

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

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-3
          mb-8
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
              dark:text-white
            "
          >
            Property Media
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
              mt-2
            "
          >
            Upload images and videos for this property.
          </p>

        </div>


        {mediaPreviews.length > 0 && (

          <span
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            {mediaPreviews.length} media item
            {mediaPreviews.length !== 1 ? "s" : ""}
          </span>

        )}

      </div>


      {/* ===================================================
          UPLOAD AREA
      =================================================== */}

      <div
        className="
          border-2
          border-dashed
          border-gray-300
          dark:border-white/20
          rounded-2xl
          p-10
          text-center
          bg-gray-50
          dark:bg-[#1A1A1A]
          hover:border-[#C9A758]
          transition
        "
      >

        <input
          type="file"
          id="mediaUpload"
          multiple
          accept="image/*,video/*"
          hidden
          onChange={handleMediaUpload}
        />


        <label
          htmlFor="mediaUpload"
          className="
            cursor-pointer
            block
          "
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
              text-xs
              text-gray-400
              mt-3
            "
          >
            Images and videos are supported.
          </p>

        </label>

      </div>


      {/* ===================================================
          MEDIA PREVIEWS
      =================================================== */}

      {mediaPreviews.length === 0 ? (

        <div
          className="
            mt-8
            border
            border-dashed
            border-gray-200
            dark:border-white/10
            rounded-2xl
            p-8
            text-center
            text-gray-400
          "
        >
          No property media added yet.
        </div>

      ) : (

        <div
          className="
            grid
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
            mt-8
          "
        >

          {mediaPreviews.map(
            (media, index) => (

              <div
                key={
                  media.id ||
                  `${media.file?.name}-${index}`
                }
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-white/10
                  bg-white
                  dark:bg-[#1A1A1A]
                "
              >

                {/* =========================================
                    COVER BADGE
                ========================================= */}

                {index === 0 && (

                  <div
                    className="
                      absolute
                      top-3
                      left-3
                      z-10
                      bg-[#C9A758]
                      text-black
                      text-xs
                      font-bold
                      px-3
                      py-1.5
                      rounded-full
                      shadow-lg
                    "
                  >
                    ★ Cover
                  </div>

                )}


                {/* =========================================
                    MEDIA PREVIEW
                ========================================= */}

                <div
                  className="
                    h-56
                    bg-black
                  "
                >

                  {media.type === "image" ? (

                    <img
                      src={media.url}
                      alt="Property"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  ) : (

                    <video
                      src={media.url}
                      controls
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  )}

                </div>


                {/* =========================================
                    MEDIA ACTIONS
                ========================================= */}

                <div
                  className="
                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    {/* SET COVER */}

                    <button
                      type="button"
                      onClick={() =>
                        setCoverImage(index)
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        flex-1
                        px-3
                        py-2.5
                        rounded-xl
                        bg-[#C9A758]
                        text-black
                        text-sm
                        font-semibold
                        hover:opacity-90
                        transition
                      "
                    >

                      <Star size={15} />

                      {index === 0
                        ? "Cover"
                        : "Set Cover"}

                    </button>


                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        removeMedia(index)
                      }
                      className="
                        px-4
                        py-2.5
                        rounded-xl
                        bg-red-100
                        dark:bg-red-500/10
                        text-red-600
                        dark:text-red-400
                        text-sm
                        font-semibold
                        hover:bg-red-200
                        dark:hover:bg-red-500/20
                        transition
                      "
                    >
                      Delete
                    </button>

                  </div>


                  {/* FILE NAME */}

                  {media.file?.name && (

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mt-3
                        truncate
                      "
                      title={media.file.name}
                    >
                      {media.file.name}
                    </p>

                  )}

                </div>

              </div>

            )
          )}

        </div>

      )}

    </section>


    {/* =====================================================
        NEXT SECTION:
        VIRTUAL TOUR
    ===================================================== */}

    {/* =====================================================
        VIRTUAL TOUR
    ===================================================== */}

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

      <div className="mb-8">

        <h2
          className="
            text-2xl
            font-bold
            dark:text-white
          "
        >
          Virtual Tour
        </h2>

        <p
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
            mt-2
          "
        >
          Add a virtual tour video or YouTube link
          for this property.
        </p>

      </div>


      {/* ===================================================
          VIDEO UPLOAD
      =================================================== */}

      <div>

        <label
          className="
            font-semibold
            dark:text-white
            block
            mb-2
          "
        >
          Upload Virtual Tour

          <span
            className="
              text-gray-400
              text-sm
              font-normal
              ml-2
            "
          >
            Optional
          </span>

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
            bg-gray-50
            dark:bg-[#1A1A1A]
            hover:border-[#C9A758]
            transition
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
            className="
              cursor-pointer
              block
            "
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


            <p
              className="
                text-xs
                text-gray-400
                mt-2
              "
            >
              Maximum file size: 100MB
            </p>

          </label>

        </div>

      </div>


      {/* ===================================================
          NEW VIDEO PREVIEW
      =================================================== */}

      {virtualTourPreview && (

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-gray-200
            dark:border-white/10
            overflow-hidden
            bg-black
          "
        >

          <video
            src={virtualTourPreview}
            controls
            className="
              w-full
              max-h-[400px]
              object-contain
              bg-black
            "
          />


          <div
            className="
              flex
              justify-end
              p-4
              bg-white
              dark:bg-[#1A1A1A]
            "
          >

            <button
              type="button"
              onClick={removeVirtualTourSelection}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-red-100
                dark:bg-red-500/10
                text-red-600
                dark:text-red-400
                text-sm
                font-semibold
                hover:bg-red-200
                dark:hover:bg-red-500/20
                transition
              "
            >
              Remove Selection
            </button>

          </div>

        </div>

      )}


      {/* ===================================================
          EXISTING SAVED TOUR
      =================================================== */}

      {virtualTourPath && !virtualTourPreview && (

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-gray-200
            dark:border-white/10
            overflow-hidden
            bg-black
          "
        >

          <video
            src={supabase.storage
              .from("virtual-tours")
              .getPublicUrl(virtualTourPath).data.publicUrl}
            controls
            className="
              w-full
              max-h-[400px]
              object-contain
              bg-black
            "
          />


          <div
            className="
              flex
              justify-end
              p-4
              bg-white
              dark:bg-[#1A1A1A]
            "
          >

            <button
              type="button"
              onClick={deleteVirtualTour}
              disabled={deletingVirtualTour}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-red-600
                text-white
                text-sm
                font-semibold
                hover:bg-red-700
                transition
                disabled:opacity-50
              "
            >
              {deletingVirtualTour
                ? "Deleting..."
                : "Delete Virtual Tour"}
            </button>

          </div>

        </div>

      )}


      {/* ===================================================
          YOUTUBE URL
      =================================================== */}

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

          <span
            className="
              text-gray-400
              text-sm
              font-normal
              ml-2
            "
          >
            Optional
          </span>

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
          You can provide a YouTube tour in addition
          to, or instead of, an uploaded video.
        </p>

      </div>


      {/* ===================================================
          TOUR NOTE
      =================================================== */}

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

        <p
          className="
            text-sm
            text-gray-600
            dark:text-gray-300
          "
        >
          You can provide an uploaded video, a YouTube
          link, or both.
        </p>

      </div>

    </section>


    {/* =====================================================
        NEXT SECTION:
        STATUS + ACTIONS
    ===================================================== */}
    {/* =========================================================
    STATUS SECTION
========================================================= */}

<section className="space-y-5">

  <div>
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
      Listing Status
    </h2>

    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Choose how this listing should appear on the platform.
    </p>
  </div>


  <div className="space-y-2">

    <label
      htmlFor="status"
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Status
    </label>

    <select
      id="status"
      name="status"
      value={formData.status}
      onChange={handleChange}
      disabled={loading}
      className="w-full px-4 py-3
                 border border-gray-300 dark:border-gray-700
                 bg-white dark:bg-[#101F34]
                 text-gray-900 dark:text-white
                 focus:outline-none
                 focus:ring-2 focus:ring-[#C9A758]"
    >

      <option value="draft">
        Draft
      </option>

      <option value="published">
        Published
      </option>

      <option value="archived">
        Archived
      </option>

    </select>

  </div>

</section>

{/* =========================================================
    FORM ACTIONS SECTION
========================================================= */}

<section className="pt-6 border-t border-gray-200 dark:border-gray-800">

  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

    {/* CANCEL */}

    <button
      type="button"
      onClick={() => navigate(redirectPath)}
      disabled={loading}
      className="w-full sm:w-auto
                 px-6 py-3
                 border border-gray-300 dark:border-gray-700
                 text-gray-700 dark:text-gray-300
                 hover:bg-gray-100 dark:hover:bg-gray-800
                 disabled:opacity-50
                 disabled:cursor-not-allowed
                 transition"
    >

      Cancel

    </button>

    {/* SAVE */}

    <button
      type="button"
      onClick={saveListing}
      disabled={loading}
      className="w-full sm:w-auto
                 inline-flex items-center justify-center gap-2
                 px-6 py-3
                 bg-[#C9A758]
                 text-black font-medium
                 hover:bg-[#E6C56A]
                 disabled:opacity-50
                 disabled:cursor-not-allowed
                 transition"
    >

      <Save size={18} />

      {loading
        ? "Saving..."
        : mode === "edit"
          ? "Save Changes"
          : "Save Listing"
      }

    </button>
  </div>

</section>


</form>

<FeedbackModal
  isOpen={feedback.isOpen}
  type={feedback.type}
  title={feedback.title}
  message={feedback.message}
  onClose={closeFeedback}
/>
</>
);
}



