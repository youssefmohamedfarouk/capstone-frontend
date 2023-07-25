import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3CenterLeftIcon,
  Bars4Icon,
  ClockIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronRightIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import { useStytch } from "@stytch/react";
import { useNavigate } from "react-router-dom";

import ListingView from "./ListingView";
import MapView from "./MapView";
import CreateEventSlideOver from "./CreateEventSlideOver";
import Chat from "./Chat";
import axios from "axios";
import { useEffect } from "react";

// import {
//   ChevronRightIcon,
//   Bars4Icon as Bars4,
//   BarsArrowDownIcon,
//   BarsArrowUpIcon,
//   EllipsisVerticalIcon,
//   MagnifyingGlassIcon,
// } from "@heroicons/react/20/solid";

import LogoSVG from "../socialCircleLogo.svg";
import EventSlideover from "./EventSlideover";
import IconCarousel from "./IconCarousel";
import Sidebar from "./Sidebar";
import ConfirmationModal from "./ConfirmationModal";
import ProfileSlideover from "./ProfileSlideover";
import EditEventSlideOver from "./EditEventSlideOver";
import SidebarMobile from "./SidebarMobile";

const teams = [
  { name: "Rock Climbing", href: "/#", bgColorClass: "bg-indigo-500" },
  { name: "Comic Book Club", href: "/#", bgColorClass: "bg-green-500" },
  { name: "Pursuit Brunch", href: "/#", bgColorClass: "bg-yellow-500" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard({
  currentUser,
  setCurrentUser,
  API,
  session,
  isLoaded,
  toast,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewType, setViewType] = useState(0);
  const [createEventSlideOverOpen, setCreateEventSlideOverOpen] =
    useState(false);
  const [editEventSlideOverOpen, setEditEventSlideOverOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [listingEvents, setListingEvents] = useState([]);
  const [rsvpdUsers, setRSVPDUsers] = useState([]);
  const [totalRSVPS, setTotalRSVPS] = useState([]);
  const [slideoverOpen, setSlideoverOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUsersRSVPS, setCurrentUsersRSVPS] = useState([]);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatTargetID, setChatTargetID] = useState("");
  const [chatTarget, setChatTarget] = useState({
    stytch_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    about_me: "",
    interests: [],
    intra_extraversion: 50,
    phone_number: "0000000000",
    profile_pic: "",
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [editEvent, setEditEvent] = useState({});

  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/dashboard", icon: HomeIcon, current: true },
    { name: "My Events", href: "#", icon: Bars4Icon, current: false },
    { name: "Recently Viewed", href: "#", icon: ClockIcon, current: false },
  ]);

  const pinnedEvents = events.filter((event) => event.pinned);

  const stytchClient = useStytch();
  const navigate = useNavigate();

  const currentUserId = currentUser.id;
  // JSON.parse(localStorage.getItem("currentUserId")) || currentUser.id;
  const currentUserName = currentUser.first_name + " " + currentUser.last_name;
  // JSON.parse(localStorage.getItem("currentUserName")) ||

  const currentUserUsername = currentUser.username;
  // JSON.parse(
  //   localStorage.getItem("currentUserUsername")
  // );

  const toastSettings = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const rsvpSuccess = () =>
    toast.success("Successfully RSVP'D! 🥳", toastSettings);
  const unRSVPSuccess = () => {
    toast.success("Successfully cancelled RSVP", toastSettings);
  };

  useEffect(() => {
    axios.get(`${API}/events`).then((res) => {
      setEvents(res.data);
      setListingEvents(res.data);
    });
    axios.get(`${API}/usersevents/firstfour`).then((res) => {
      setRSVPDUsers(res.data);
    });
    axios.get(`${API}/usersevents/totalrsvps`).then((res) => {
      setTotalRSVPS(res.data);
    });
    axios.get(`${API}/usersevents/${currentUser.id}`).then((res) => {
      setCurrentUsersRSVPS(res.data);
    });
  }, [currentUser]);

  useEffect(() => {
    if (chatTargetID) {
      axios.get(`${API}/users/${chatTargetID}`).then((res) => {
        setChatTarget(res.data);
        // console.log(chatTarget);
        console.log(res.data);
      });
    }
  }, [chatTargetID]);

  useEffect(() => {
    if (!session || !session.session_id) {
      navigate("/login");
    }
  }, [session]);

  useEffect(() => {
    if (searchTerm) {
      setListingEvents(
        events.filter((event) => {
          return (
            event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.event_address.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    } else {
      setListingEvents(events);
    }
  }, [searchTerm]);

  const logout = () => {
    stytchClient.session.revoke().then(() => navigate("/login"));
  };

  const updateEvents = (newEvent) => {
    setCurrentEvent(newEvent);
    setEvents([...events, newEvent]);
    setListingEvents([...listingEvents, newEvent]);
  };

  const editEventMethod = (updatedEvent) => {
    setCurrentEvent(updatedEvent);
    const eventIndex = events.findIndex(
      (event) => event.id === updatedEvent.id
    );
    events[eventIndex] = updatedEvent;
    setEvents([...events]);
    const listingEventIndex = listingEvents.findIndex(
      (event) => event.id === updatedEvent.id
    );
    listingEvents[listingEventIndex] = updatedEvent;
    setListingEvents([...listingEvents]);
  };

  console.log(currentUser);

  return (
    <div>
      <ConfirmationModal
        API={API}
        currentUser={currentUser}
        currentEvent={currentEvent}
        confirmationModalOpen={confirmationModalOpen}
        setConfirmationModalOpen={setConfirmationModalOpen}
        setCurrentUsersRSVPS={setCurrentUsersRSVPS}
        currentUsersRSVPS={currentUsersRSVPS}
        unRSVPSuccess={unRSVPSuccess}
      />
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full static">
        <SidebarMobile
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
          setNavigation={setNavigation}
          setViewType={setViewType}
          LogoSVG={LogoSVG}
          XMarkIcon={XMarkIcon}
        />

        {/* Static sidebar for desktop */}
        <Sidebar
          currentUser={currentUser}
          currentUserName={currentUserName}
          currentUserUsername={currentUserUsername}
          setProfileOpen={setProfileOpen}
          setSearchTerm={setSearchTerm}
          setChatTargetID={setChatTargetID}
          navigation={navigation}
          setNavigation={setNavigation}
        />

        {/* Main column */}
        <div className="flex flex-col lg:pl-64">
          {/* Search header */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex flex-1">
                <form className="flex w-full md:ml-0" action="/#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                      <MagnifyingGlassIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search-field"
                      name="search-field"
                      className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </form>
              </div>
              <div className="flex items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://cdn.mos.cms.futurecdn.net/kXUihcLa33aC96RgbUpX6a-1920-80.png"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={classNames(
                                active
                                  ? "bg-orange-500 text-white"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                              onClick={() => setProfileOpen(true)}
                            >
                              View profile
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={classNames(
                                active
                                  ? "bg-orange-500 text-white"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Settings
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/#"
                              className={classNames(
                                active
                                  ? "bg-orange-500 text-white"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Notifications
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/#"
                              className={classNames(
                                active
                                  ? "bg-orange-500 text-white"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Get desktop app
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              className={classNames(
                                active
                                  ? "bg-orange-500 text-white"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              About
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              className={classNames(
                                active
                                  ? "bg-orange-500 text-white"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                              onClick={logout}
                            >
                              Logout
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main className="flex-1">
            {/* Page title & actions */}
            <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
                  Home
                </h1>
              </div>
              <div className="mt-4 flex sm:ml-4 sm:mt-0 mr-1">
                <button
                  type="button"
                  className="sm:order-0 order-1 ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-0"
                >
                  Share
                </button>
                <button
                  type="button"
                  className="order-0 inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 sm:order-1 sm:ml-3"
                  onClick={() =>
                    setCreateEventSlideOverOpen(!createEventSlideOverOpen)
                  }
                >
                  Create
                </button>
              </div>
            </div>

            <CreateEventSlideOver
              API={API}
              createEventSlideOverOpen={createEventSlideOverOpen}
              setCreateEventSlideOverOpen={setCreateEventSlideOverOpen}
              isLoaded={isLoaded}
              updateEvents={updateEvents}
            />

            <div className="mt-4 px-4 sm:px-6 lg:px-2">
              {/* <h2 className="text-sm font-medium text-gray-900">
                RSVP'd Events
              </h2> */}
              <IconCarousel className="self-center" />
              <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
                {pinnedEvents.map((event) => (
                  <li
                    key={event.id}
                    className="relative col-span-1 flex rounded-md shadow-sm"
                  >
                    <div
                      className={classNames(
                        event.bgColorClass,
                        "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                      )}
                    >
                      {event.initials}
                    </div>
                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                      <div className="flex-1 truncate px-4 py-2 text-sm">
                        <a
                          href="/#"
                          className="font-medium text-gray-900 hover:text-gray-600"
                        >
                          {event.title}
                        </a>
                        <p className="text-gray-500">
                          {event.totalMembers} Attendees
                        </p>
                      </div>
                      <Menu as="div" className="flex-shrink-0 pr-2">
                        <Menu.Button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                          <span className="sr-only">Open options</span>
                          <EllipsisVerticalIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-10 top-3 z-10 mx-3 mt-1 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/#"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    View
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/#"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Removed from pinned
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/#"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Share
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Events listings (only on smallest breakpoint) */}
            <div className="mt-10 sm:hidden">
              <div className="px-4 sm:px-6">
                <h2 className="text-sm font-medium text-gray-900">Events</h2>
              </div>

              <ul className="mt-3 divide-y divide-gray-100 border-t border-gray-200">
                {listingEvents.map((event) => (
                  <li key={event.id}>
                    <a
                      href="/#"
                      className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6"
                    >
                      <span className="flex items-center space-x-3 truncate">
                        <span
                          className={classNames(
                            event.bgColorClass,
                            "h-2.5 w-2.5 flex-shrink-0 rounded-full"
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate text-sm font-medium leading-6">
                          {event.title}{" "}
                          <span className="truncate font-normal text-gray-500">
                            in {event.friend}
                          </span>
                        </span>
                      </span>
                      <ChevronRightIcon
                        className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <EventSlideover
              currentUser={currentUser}
              API={API}
              slideoverOpen={slideoverOpen}
              setSlideoverOpen={setSlideoverOpen}
              currentEvent={currentEvent}
              currentUsersRSVPS={currentUsersRSVPS}
              setCurrentUsersRSVPS={setCurrentUsersRSVPS}
              confirmationModalOpen={confirmationModalOpen}
              setConfirmationModalOpen={setConfirmationModalOpen}
              setChatVisible={setChatVisible}
              setChatTargetID={setChatTargetID}
              setProfileOpen={setProfileOpen}
              editEventSlideOverOpen={editEventSlideOverOpen}
              setEditEventSlideOverOpen={setEditEventSlideOverOpen}
              editEvent={editEvent}
              rsvpSuccess={rsvpSuccess}
            />

            <ProfileSlideover
              API={API}
              profileOpen={profileOpen}
              setProfileOpen={setProfileOpen}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              chatTargetID={chatTargetID}
              setChatTargetID={setChatTargetID}
              chatTarget={chatTarget}
              setChatTarget={setChatTarget}
              setChatOpen={setChatOpen}
              setViewType={setViewType}
            />

            <EditEventSlideOver
              API={API}
              editEventSlideOverOpen={editEventSlideOverOpen}
              setEditEventSlideOverOpen={setEditEventSlideOverOpen}
              isLoaded={isLoaded}
              currentEvent={currentEvent}
              updateEvents={updateEvents}
              changeEvent={editEventMethod}
              editEvent={editEvent}
              setEditEvent={setEditEvent}
            />

            {/* events table (small breakpoint and up) */}
            <div className="mt-4 hidden sm:block">
              <div className="inline-block min-w-full border-b border-gray-200 align-middle">
                {/* Button to switch from event listings to map view*/}
                <div className="text-right pb-2 pr-2">
                  <button
                    type="button"
                    className="rounded bg-orange-500 mr-4 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setViewType((viewType + 1) % 2)}
                  >
                    {!viewType ? "View Map" : "View Listings"}
                  </button>
                </div>

                {viewType === 0 ? (
                  <ListingView
                    API={API}
                    currentUser={currentUser}
                    events={events}
                    setEvents={setEvents}
                    listingEvents={listingEvents}
                    setListingEvents={setListingEvents}
                    classNames={classNames}
                    rsvpdUsers={rsvpdUsers}
                    totalRSVPS={totalRSVPS}
                    setSlideoverOpen={setSlideoverOpen}
                    currentEvent={currentEvent}
                    setCurrentEvent={setCurrentEvent}
                    currentUsersRSVPS={currentUsersRSVPS}
                    setCurrentUsersRSVPS={setCurrentUsersRSVPS}
                    confirmationModalOpen={confirmationModalOpen}
                    setConfirmationModalOpen={setConfirmationModalOpen}
                    toast={toast}
                    toastSettings={toastSettings}
                    rsvpSuccess={rsvpSuccess}
                    unRSVPSuccess={unRSVPSuccess}
                    setChatVisible={setChatVisible}
                    setChatTargetID={setChatTargetID}
                    navigation={navigation}
                  />
                ) : viewType === 1 ? (
                  <MapView
                    isLoaded={isLoaded}
                    events={events}
                    setCurrentEvent={setCurrentEvent}
                    slideoverOpen={slideoverOpen}
                    setSlideoverOpen={setSlideoverOpen}
                    currentUsersRSVPS={currentUsersRSVPS}
                    setConfirmationModalOpen={setConfirmationModalOpen}
                    currentUserId={currentUserId}
                    API={API}
                    setCurrentUsersRSVPS={setCurrentUsersRSVPS}
                    toast={toast}
                    toastSettings={toastSettings}
                    rsvpSuccess={rsvpSuccess}
                    unRSVPSuccess={unRSVPSuccess}
                    currentEvent={currentEvent}
                  />
                ) : (
                  <Chat
                    // className="absolute bottom-0 right-0 h-1/2 w-1/3"
                    currentUser={currentUser}
                    chatVisible={chatVisible}
                    setChatVisible={setChatVisible}
                    chatTarget={chatTarget}
                    API={API}
                    chatOpen={chatOpen}
                    setChatOpen={setChatOpen}
                  />
                )}
              </div>
            </div>
            <div id="talkjs-container" className="w-full h-full">
              <i></i>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
