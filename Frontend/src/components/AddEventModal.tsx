import React, { useState } from "react";
import { X, Calendar, MapPin, Image, FileText, Info } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface AddEventModalProps {
  onClose: () => void;
  setAddUpdateSuccess: (value: boolean) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  onClose,
  setAddUpdateSuccess,
}) => {
  const { title, description, date, image, location, update, id } = useSelector(
    (state: RootState) => state.events
  );
  const [eventTitle, setTitle] = useState(title || "");
  const [desc, setDescription] = useState(description || "");
  const [eventDate, setDate] = useState(date || "");
  const [eventLocation, setLocation] = useState(location || "");
  const [img, setImage] = useState<File | null>(() => {
    return image instanceof File ? image : null;
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(image); // Stores preview URL

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be under 5MB.");
        e.target.value = ""; // Reset input
        return;
      }

      const imageUrl = URL.createObjectURL(file); // Convert file to preview URL
      setImage(file);
      setImagePreview(imageUrl);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", eventTitle);
      formData.append("description", desc);
      formData.append("date", eventDate);
      formData.append("location", eventLocation);
      if (img) {
        formData.append("image", img); // Append file
      }
      formData.append("id", id);

      console.log("Sending FormData:", formData);

      const response = update
        ? await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/update-event`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // ✅ Don't manually set boundary
              },
              withCredentials: true, // ✅ Required if using cookies/authentication
            }
          )
        : await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/create-event`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // ✅ Don't manually set boundary
              },
              withCredentials: true, // ✅ Required if using cookies/authentication
            }
          );
      if (response.data.success) {
        setIsSubmitting(false);
        toast.success(response.data.message || "Event created successfully");
        onClose();
        setAddUpdateSuccess(true);
      }
    } catch (error) {
      setIsSubmitting(false);
      const err = error as AxiosError<{ message: string }>; // 👈 Explicitly cast error as AxiosError
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max -h-[90vh] overflow-y-auto animate-[fadeIn_0.3s_ease-in-out]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold gradient-text">
            {update ? "Update " : "Create New "}Event
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress steps */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-8">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setCurrentStep(1)}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div
                className={`ml-2 text-sm font-medium ${
                  currentStep >= 1 ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                Basic Info
              </div>
            </div>
            <div
              className={`flex-1 h-1 mx-4 ${
                currentStep >= 2 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setCurrentStep(2)}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 2
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <div
                className={`ml-2 text-sm font-medium ${
                  currentStep >= 2 ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                Details
              </div>
            </div>
            <div
              className={`flex-1 h-1 mx-4 ${
                currentStep >= 3 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            ></div>
            <div className="flex items-center">
              <div className={`flex items <div className="flex items-center`}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 3
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
                <div
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= 3 ? "text-indigo-600" : "text-gray-500"
                  }`}
                >
                  Preview
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            <div
              className={`px-6 pb-6 ${currentStep === 1 ? "block" : "hidden"}`}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Event Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={18} className="text-indigo-500" />
                  </div>
                  <input
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                    id="title"
                    type="text"
                    placeholder="Give your event a clear, catchy title"
                    value={eventTitle}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                  id="description"
                  placeholder="Describe your event in detail. What can attendees expect?"
                  rows={4}
                  value={desc}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md flex items-center"
                  disabled={!eventTitle || !desc}
                >
                  Next
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Step 2: Details */}
            <div
              className={`px-6 pb-6 ${currentStep === 2 ? "block" : "hidden"}`}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="date"
                >
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-indigo-500" />
                  </div>
                  <input
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                    id="date"
                    type="date"
                    name="date" // ✅ Add this to ensure form validation
                    value={eventDate ? eventDate.split("T")[0] : ""}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="location"
                >
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-indigo-500" />
                  </div>
                  <input
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                    id="location"
                    type="text"
                    placeholder="Where will your event take place?"
                    value={eventLocation}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="imageUrl"
                >
                  Image
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image size={18} className="text-indigo-500" />
                  </div>
                  <input
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                    id="imageUpload"
                    type="file"
                    accept="image/*" // ✅ Allows only images
                    onChange={handleImageChange}
                  />
                </div>
                {/* Display the last uploaded image's file name */}
                {image && typeof image === "string" && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Last uploaded file:{" "}
                      <strong>{image.split("/").pop()}</strong>
                    </p>
                    <p className="text-sm text-gray-400">
                      Upload a new file to replace the existing one.
                    </p>
                  </div>
                )}
                {img && img instanceof File && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected file: <strong>{img.name}</strong>
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors flex items-center"
                >
                  <svg
                    className="mr-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md flex items-center"
                  disabled={!eventDate || !eventLocation}
                >
                  Next
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Step 3: Preview */}
            <div
              className={`px-6 pb-6 ${currentStep === 3 ? "block" : "hidden"}`}
            >
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Event Preview
                </h3>

                <div className="mb-4">
                  <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                    <img
                      src={
                        imagePreview instanceof File
                          ? URL.createObjectURL(imagePreview) // Convert File to URL
                          : imagePreview || // Use existing image path if available
                            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" // Fallback to default image
                      }
                      alt={eventTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-3 text-white">
                      <h4 className="text-lg font-bold">{eventTitle}</h4>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Calendar size={16} className="mr-2 text-indigo-600" />
                      <span>
                        {eventDate
                          ? new Date(eventDate).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Date not set"}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <MapPin size={16} className="mr-2 text-indigo-600" />
                      <span>{eventLocation || "Location not set"}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-700">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info size={18} className="text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p>
                        This is a preview of how your event will appear to
                        users. Please review all details before creating.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors flex items-center"
                >
                  <svg
                    className="mr-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md flex items-center pulse-on-hover"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {update ? "Updating" : "Creating"} Event...
                    </span>
                  ) : (
                    <span>{update ? "Update" : "Create"} Event</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
