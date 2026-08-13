import { useRef, useState } from "react";
import {
  UploadCloud,
  Image,
  Video,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { supabase } from "../../../config/SupabaseClient";

export default function MediaUpload({
  label,
  accept,
  folder,
  value,
  onUpload,
}) {
  const inputRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const isImage = accept.includes("image");
  // const isVideo = accept.includes("video");

  const previewUrl = value
  ? value.startsWith("http")
    ? value
    : supabase.storage
        .from("development-media")
        .getPublicUrl(value).data.publicUrl
  : "";

  const openPicker = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    onUpload("");
    setProgress(0);
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setProgress(15);

      const extension = file.name.split(".").pop();

      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${extension}`;

      const filePath = `${folder}/${filename}`;

      const { error } = await supabase.storage
        .from("development-media")
        .upload(filePath, file);

      if (error) throw error;

      setProgress(80);

     onUpload(filePath);

        if (inputRef.current) {
  inputRef.current.value = "";
}
   
      setProgress(100);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = async (e) => {
    if (!e.target.files.length) return;

    await uploadFile(e.target.files[0]);
  };

  const handleDrop = async (e) => {
    e.preventDefault();

    setDragging(false);

    if (!e.dataTransfer.files.length) return;

    await uploadFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-4">

      <label className="font-semibold text-black dark:text-white flex items-center gap-2">
        {label}
        <span className="text-red-500">*</span>
      </label>


      {!value ? (

        <div
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            cursor-pointer
            rounded-3xl
            border-2
            border-dashed
            transition-all
            duration-300
            p-10

            ${
              dragging
                ? "border-[#C9A758] bg-[#C9A758]/10"
                : "border-gray-300 dark:border-white/10"
            }

            hover:border-[#C9A758]
            hover:bg-[#C9A758]/5
          `}
        >

          <input
            ref={inputRef}
            hidden
            type="file"
            accept={accept}
            onChange={handleChange}
          />

          <div className="flex flex-col items-center text-center gap-6">

            <div
              className="
                w-20
                h-20
                rounded-full
                bg-[#101F34]
                flex
                items-center
                justify-center
              "
            >
              <UploadCloud
                size={36}
                className="text-white"
              />
            </div>

            <div>

              <h3 className="text-xl font-semibold dark:text-white">
                Drag & Drop your {label}
              </h3>

              <p className="mt-2 text-gray-500 dark:text-gray-400">
                or click here to browse files
              </p>

              <p className="mt-2 text-sm text-gray-400">
                {isImage
                  ? "JPG • PNG • WEBP"
                  : "MP4 • MOV • WEBM"}
              </p>

            </div>

            {uploading && (

              <div className="w-full">

                <div className="h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-[#1A1A1A]">

                  <div
                    className="h-full bg-[#C9A758] transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Uploading...
                </p>

              </div>

            )}

          </div>

        </div>

      ) : (  <div
          className="
            bg-white
            dark:bg-[#121212]
            border
            border-gray-200
            dark:border-white/10
            rounded-3xl
            p-6
          "
        >

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Preview */}

            <div
              className="
                w-full
                lg:w-72
                rounded-2xl
                overflow-hidden
                bg-gray-100
                dark:bg-[#1A1A1A]
              "
            >

              {isImage ? (

<img
  src={previewUrl}
  alt={label}
  className="w-full h-full object-cover"
/>

              ) : (

               <video
  controls
  className="w-full h-56 object-cover"
>
  <source src={previewUrl} />
</video>

              )}

            </div>

            {/* Details */}

            <div className="flex-1">

              <div className="flex items-center gap-3">

                {isImage ? (
                  <Image
                    size={26}
                    className="text-[#C9A758]"
                  />
                ) : (
                  <Video
                    size={26}
                    className="text-[#C9A758]"
                  />
                )}

                <h3 className="text-xl font-semibold text-black dark:text-white">
                  {label} Uploaded
                </h3>

              </div>

              <p className="mt-4 break-all text-sm text-gray-500 dark:text-gray-400">
                {value}
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

              <button
                  type="button"
                  onClick={openPicker}
                  className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-3
                    rounded-xl
                    bg-[#101F34]
                    text-white
                    hover:opacity-90
                    transition
                  "
                >
                  <RefreshCw size={18} />
                  Replace
                </button>

                <button
                  type="button"
                  onClick={removeFile}
                  className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-3
                    rounded-xl
                    bg-red-500
                    text-white
                    hover:bg-red-600
                    transition
                  "
                >
                  <Trash2 size={18} />
                  Remove
                </button>
                

              </div>

            </div>

          </div>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept={accept}
            onChange={handleChange}
          />

        </div>

      )}

    </div>
  );
}