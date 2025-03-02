import React from "react";
import { Event } from "../types";
import {
  X,
  Calendar,
  MapPin,
  Share2,
  Heart,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface EventModalProps {
  event: Event;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Format date for display
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-[fadeIn_0.3s_ease-in-out]">
        <div className="relative">
          <div className="h-72 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
          </div>

          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-3xl font-bold mb-2 drop-shadow-md">
              {event.title}
            </h2>
            <div className="flex items-center text-white/90 text-sm">
              <Calendar size={16} className="mr-2" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="absolute top-4 left-4 bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            Featured Event
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px] bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center text-gray-700 mb-2">
                <Calendar size={18} className="mr-2 text-indigo-600" />
                <span className="font-medium">Date & Time</span>
              </div>
              <p className="text-gray-600 ml-7">{formattedDate}</p>
              <p className="text-gray-600 ml-7">7:00 PM - 10:00 PM</p>
            </div>

            <div className="flex-1 min-w-[200px] bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center text-gray-700 mb-2">
                <MapPin size={18} className="mr-2 text-indigo-600" />
                <span className="font-medium">Location</span>
              </div>
              <p className="text-gray-600 ml-7">{event.location}</p>
              <a
                href="#"
                className="text-indigo-600 text-sm ml-7 flex items-center mt-1 hover:text-indigo-800"
              >
                <ExternalLink size={14} className="mr-1" />
                View on map
              </a>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              About this event
            </h3>
            <p className="text-gray-600 whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Attendees
            </h3>
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-sm font-medium text-indigo-600">
                  JD
                </div>
                <div className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-sm font-medium text-pink-600">
                  AS
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-sm font-medium text-green-600">
                  TK
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-white flex items-center justify-center text-sm font-medium text-yellow-600">
                  MJ
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                  +12
                </div>
              </div>
              <span className="text-gray-600">16 people attending</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-3 justify-between items-center">
            <div className="flex space-x-2">
              <button className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                <Heart
                  size={20}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                />
              </button>
              <button className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                <Bookmark
                  size={20}
                  className="text-gray-500 hover:text-indigo-500 transition-colors"
                />
              </button>
              <button className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                <Share2
                  size={20}
                  className="text-gray-500 hover:text-indigo-500 transition-colors"
                />
              </button>
            </div>
            {user?.role === "admin" && (
              <div className="flex space-x-3">
                <button
                  onClick={() => onDelete(event?.id)} // Fix: Pass function instead of executing it immediately
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Delete
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                  onClick={() => onUpdate(event?.id)} // Fix: Pass function correctly
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
