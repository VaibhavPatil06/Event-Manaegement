import React from "react";
import { Calendar, MapPin } from "lucide-react";

interface EventType {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

interface EventCardProps {
  event: EventType; // Wrap all properties inside `event`
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  // Format date for display
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get day and month for the badge
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString("en-US", { month: "short" });

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer card-hover"
      onClick={onClick}
    >
      <div className="relative">
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 text-center">
            {month}
          </div>
          <div className="text-gray-900 text-lg font-bold px-3 py-1 text-center">
            {day}
          </div>
        </div>

        <div className="h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={16} className="mr-2 text-indigo-500" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={16} className="mr-2 text-indigo-500" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex -space-x-2">
            {/* Simulated attendee avatars */}
            <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-medium text-indigo-600">
              JD
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-xs font-medium text-pink-600">
              AS
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-medium text-green-600">
              TK
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
              +5
            </div>
          </div>

          <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
            View Details
            <svg
              className="ml-1 w-4 h-4"
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
    </div>
  );
};

export default EventCard;
