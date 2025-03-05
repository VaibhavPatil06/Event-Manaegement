import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import AddEventModal from "../components/AddEventModal";
import { Event } from "../types";
import { Loader, Calendar, Search, Grid, List, MapPin } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  setDate,
  setDescription,
  setId,
  setImage,
  setLocation,
  setTitle,
  setUpdate,
} from "../store/slices/eventsSlice";

type EventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
};

interface Events {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUpdateSuccess, setAddUpdateSuccess] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<EventType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore,setHasMore] = useState(false);

  const fetchEvents = async (page: number, search: string) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/event/all-event?page=${page}&limit=10&searchTerm=${search}`
      );

      if (response.data.success) {
        setHasMore(response?.data?.hasMore)
        const newEvents = response.data.data.map((item: Events) => ({
          id: item._id,
          title: item.title,
          description: item.description,
          date: item.date,
          location: item.location,
          image: `${import.meta.env.VITE_BACKEND_URL}/${item.image.replace(
            /\\/g,
            "/"
          )}`,
        }));

        setEvents(newEvents);
        setTotalPages(Math.ceil(response.data.total / 10)); // Assuming 10 events per page
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  // Fetch when search term or page changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEvents(page, searchTerm);
    }, 500); // Debounce API call by 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page]);

  useEffect(() => {
    if (addUpdateSuccess) {
      fetchEvents(page, searchTerm);
    }
  }, [addUpdateSuccess,page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to the first page when searching
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;

    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/event/delete-event?id=${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Event deleted successfully");
        setEvents((prevEvents) => prevEvents.filter((item) => item.id !== id));
        setSelectedEvent(null);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleUpdate = async (id: string) => {
    const data = events.find((e) => e.id === id);
    dispatch(setId(data?.id));
    dispatch(setTitle(data?.title));
    dispatch(setDescription(data?.description));
    dispatch(setDate(data?.date));
    dispatch(setLocation(data?.location));
    dispatch(setImage(data?.image));
    dispatch(setUpdate(true));
    setShowAddModal(true);
  };

  const handleAddEvent = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    fetchEvents(page, searchTerm);
    setSelectedEvent(null);
    dispatch(setId(""));
    dispatch(setTitle(""));
    dispatch(setDescription(""));
    dispatch(setDate(""));
    dispatch(setLocation(""));
    dispatch(setUpdate(false));
    dispatch(setImage(""));
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddEvent={handleAddEvent} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="relative rounded-2xl overflow-hidden mb-10">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"
              alt="Events banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-indigo-900/60"></div>
          </div>
          <div className="relative py-12 px-8 sm:px-12 lg:px-16">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Discover Amazing Events
              </h1>
              <p className="text-indigo-100 text-lg mb-8">
                Find and join events that match your interests, connect with
                people, and create memorable experiences.
              </p>

              <div className="bg-white rounded-lg shadow-lg p-2 flex items-center">
                <div className="flex-1 flex items-center">
                  <Search size={20} className="ml-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events by name, description, or location..."
                    className="w-full px-3 py-2 focus:outline-none"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {searchTerm
              ? `Search Results (${events.length})`
              : "Upcoming Events"}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={20} />
            </button>
            <button
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={20} />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader
                size={48}
                className="text-indigo-600 animate-spin mx-auto mb-4"
              />
              <p className="text-gray-600">Loading amazing events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Calendar size={48} className="text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any events matching your search criteria.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <div key={event.id}>
                <EventCard
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-48 sm:h-auto">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar size={16} className="mr-2 text-indigo-500" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin size={16} className="mr-2 text-indigo-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={hasMore === false || page === totalPages}
            className={`px-4 py-2 rounded-md ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </main>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}

      {showAddModal && (
        <AddEventModal
          onClose={handleCloseAddModal}
          setAddUpdateSuccess={setAddUpdateSuccess}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;