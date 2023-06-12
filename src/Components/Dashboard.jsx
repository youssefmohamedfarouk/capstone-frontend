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

const teams = [
  { name: "Rock Climbing", href: "/#", bgColorClass: "bg-indigo-500" },
  { name: "Comic Book Club", href: "/#", bgColorClass: "bg-green-500" },
  { name: "Pursuit Brunch", href: "/#", bgColorClass: "bg-yellow-500" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard({ currentUser, API, session, isLoaded }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isListingView, setIsListingView] = useState(true);
  const [attendeesSortOrder, setAttendeesSortOrder] = useState(0);
  const [eventDateSortOrder, setEventDateSortOrder] = useState(0);
  const [createEventSlideOverOpen, setCreateEventSlideOverOpen] =
    useState(false);
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
      console.log(currentUser);
      console.log(res.data);
      setCurrentUsersRSVPS(res.data);
    });
  }, [currentUser]);

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
    stytchClient.session.revoke();
    navigate("/login");
  };

  const updateEvents = (newEvent) => {
    console.log("asdf", newEvent);

    setEvents([...events, newEvent]);
    setListingEvents([...listingEvents, newEvent]);
    console.log("YOOOOOO", events);
  };

  return (
    <>
      <ConfirmationModal
        API={API}
        currentUser={currentUser}
        currentEvent={currentEvent}
        confirmationModalOpen={confirmationModalOpen}
        setConfirmationModalOpen={setConfirmationModalOpen}
        setCurrentUsersRSVPS={setCurrentUsersRSVPS}
        currentUsersRSVPS={currentUsersRSVPS}
      />
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src={LogoSVG}
                      alt="Your Company"
                    />
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="px-2">
                      <div className="space-y-1">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-orange-500 text-white"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                              "group flex items-center rounded-md px-2 py-2 text-base font-medium leading-5"
                            )}
                            aria-current={item.current ? "page" : undefined}
                            onClick={() => {
                              const indexOfCurrent = navigation.findIndex(
                                (item) => item.current
                              );
                              navigation[indexOfCurrent].current = false;
                              item.current = true;
                              setNavigation(...[navigation]);
                            }}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-white"
                                  : "text-gray-400 group-hover:text-gray-500",
                                "mr-3 h-6 w-6 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      </div>
                      <div className="mt-8">
                        <h3
                          className="px-3 text-sm font-medium text-gray-500"
                          id="mobile-teams-headline"
                        >
                          Event Groups
                        </h3>
                        <div
                          className="mt-1 space-y-1"
                          role="group"
                          aria-labelledby="mobile-teams-headline"
                        >
                          {teams.map((team) => (
                            <a
                              key={team.name}
                              href={team.href}
                              className="group flex items-center rounded-md px-3 py-2 text-base font-medium leading-5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                              <span
                                className={classNames(
                                  team.bgColorClass,
                                  "mr-4 h-2.5 w-2.5 rounded-full"
                                )}
                                aria-hidden="true"
                              />
                              <span className="truncate">{team.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-100 lg:pb-4 lg:pt-5">
          <div className="flex flex-shrink-0 items-center px-6">
            <img className="h-8 w-auto" src={LogoSVG} alt="Social CIRCLE" />
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">
            {/* User account dropdown */}
            <Menu as="div" className="relative inline-block px-3 text-left">
              <div>
                <Menu.Button className="group w-full rounded-md bg-gray-100 px-3.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                  <span className="flex w-full items-center justify-between">
                    <span className="flex min-w-0 items-center justify-between space-x-3">
                      <img
                        className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                        src={currentUser.profile_pic}
                        alt=""
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium text-gray-900">
                          {currentUserName}
                        </span>
                        <span className="truncate text-sm text-gray-500">
                          @{currentUserUsername}
                        </span>
                      </span>
                    </span>
                    <ChevronUpDownIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </span>
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
                <Menu.Items className="absolute left-0 right-0 z-10 mx-3 mt-1 origin-top divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                          href="#"
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
                          href="#"
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
                          // href="javascript:;"
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
            {/* Sidebar Search */}
            <div className="mt-5 px-3">
              <label htmlFor="search" className="sr-only">
                Search Events
              </label>
              <div className="relative mt-1 rounded-md shadow-sm focus-within:text-orange-500 focus-within:caret-orange-500">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                  aria-hidden="true"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border-0 py-1.5 pl-9 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-black focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                  placeholder="Search Events"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* Navigation */}
            <nav className="mt-6 px-3">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <div
                    key={item.name}
                    // href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-orange-500 text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                    onClick={() => {
                      const indexOfCurrent = navigation.findIndex(
                        (item) => item.current
                      );
                      console.log(indexOfCurrent);
                      navigation[indexOfCurrent].current = false;
                      item.current = true;
                    }}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                {/* Secondary navigation */}
                <h3
                  className="px-3 text-sm font-medium text-gray-500"
                  id="desktop-teams-headline"
                >
                  Event Groups
                </h3>
                <div
                  className="mt-1 space-y-1"
                  role="group"
                  aria-labelledby="desktop-teams-headline"
                >
                  {teams.map((team) => (
                    <a
                      key={team.name}
                      href={team.href}
                      className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <span
                        className={classNames(
                          team.bgColorClass,
                          "mr-4 h-2.5 w-2.5 rounded-full"
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{team.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
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
                              href="/#"
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
                              href="/#"
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
              <div className="mt-4 flex sm:ml-4 sm:mt-0">
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
            <div className="mt-6 px-4 sm:px-6 lg:px-8">
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
                            in {event.team}
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
            />

            <ProfileSlideover
              profileOpen={profileOpen}
              setProfileOpen={setProfileOpen}
              currentUser={currentUser}
            />

            {/* events table (small breakpoint and up) */}
            <div className="mt-8 hidden sm:block">
              <div className="inline-block min-w-full border-b border-gray-200 align-middle">
                {/* Button to switch from event listings to map view*/}
                <div className="text-right pb-2 pr-2">
                  <button
                    type="button"
                    className="rounded bg-orange-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setIsListingView(!isListingView)}
                  >
                    {isListingView ? "View Map" : "View Listings"}
                  </button>
                </div>

                {isListingView ? (
                  <ListingView
                    API={API}
                    currentUser={currentUser}
                    events={events}
                    setEvents={setEvents}
                    listingEvents={listingEvents}
                    setListingEvents={setListingEvents}
                    classNames={classNames}
                    attendeesSortOrder={attendeesSortOrder}
                    setAttendeesSortOrder={setAttendeesSortOrder}
                    eventDateSortOrder={eventDateSortOrder}
                    setEventDateSortOrder={setEventDateSortOrder}
                    rsvpdUsers={rsvpdUsers}
                    totalRSVPS={totalRSVPS}
                    setSlideoverOpen={setSlideoverOpen}
                    currentEvent={currentEvent}
                    setCurrentEvent={setCurrentEvent}
                    currentUsersRSVPS={currentUsersRSVPS}
                    setCurrentUsersRSVPS={setCurrentUsersRSVPS}
                    confirmationModalOpen={confirmationModalOpen}
                    setConfirmationModalOpen={setConfirmationModalOpen}
                  />
                ) : (
                  <MapView isLoaded={isLoaded} events={events} />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
