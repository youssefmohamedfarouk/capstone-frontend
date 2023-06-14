import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import LogoSVG from "../socialCircleLogo.svg";
import { useStytch } from "@stytch/react";

import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import {
  Bars3CenterLeftIcon,
  Bars4Icon,
  ClockIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function Sidebar({ currentUser, session }) {
  const navigation = [
    { name: "Home", href: "/dashboard", icon: HomeIcon, current: true },
    { name: "My Events", href: "#", icon: Bars4Icon, current: false },
    { name: "Recently Viewed", href: "#", icon: ClockIcon, current: false },
  ];
  const teams = [
    { name: "Rock Climbing", href: "#", bgColorClass: "bg-indigo-500" },
    { name: "Comic Book Club", href: "#", bgColorClass: "bg-green-500" },
    { name: "Pursuit Brunch", href: "#", bgColorClass: "bg-yellow-500" },
  ];

  const stytchClient = useStytch();

  const logout = () => {
    stytchClient.session.revoke();
    navigate("/login");
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const navigate = useNavigate();

  const viewProfile = () => {
    const userID = session ? session.user_id : currentUser.stytch_id;
    navigate(`/profile/${userID}`);
  };

  return (
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
                    src={
                      currentUser.profile_pic ||
                      "https://cdn.mos.cms.futurecdn.net/kXUihcLa33aC96RgbUpX6a-1920-80.png"
                    }
                    alt=""
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-gray-900">
                      {currentUser.first_name + " " + currentUser.last_name}
                    </span>
                    <span className="truncate text-sm text-gray-500">
                      @{currentUser.username}
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
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-orange-500 text-white" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                      onClick={viewProfile}
                    >
                      View profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-orange-500 text-white" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-orange-500 text-white" : "text-gray-700",
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
                        active ? "bg-orange-500 text-white" : "text-gray-700",
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
                        active ? "bg-orange-500 text-white" : "text-gray-700",
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
            />
          </div>
        </div>
        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
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
  );
}

export default Sidebar;
