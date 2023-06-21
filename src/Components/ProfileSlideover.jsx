import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

import commentsBadge from "../badges/comment-badge.png";
import eventsBadge from "../badges/event-badge.png";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileSlideover({
  API,
  profileOpen,
  setProfileOpen,
  currentUser,
  setCurrentUser,
  chatTargetID,
  setChatTargetID,
  chatTarget,
  setChatTarget,
  setChatOpen,
}) {
  const navigate = useNavigate();

  return (
    <Transition.Root show={profileOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setProfileOpen(false);
          setTimeout(() => {
            setChatTargetID("");
            setChatTarget({
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
          }, 1000);
        }}
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-7 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Profile
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-orange-500"
                            onClick={() => {
                              setProfileOpen(false);
                            }}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div className="divide-y divide-gray-200">
                      <div className="pb-6">
                        <div className="h-24 bg-orange-500 sm:h-20 lg:h-22" />
                        <div className="-mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-16">
                          <div>
                            <div className="-m-1 flex">
                              <div className="inline-flex overflow-hidden rounded-lg border-4 border-orange-500 bg-white">
                                <img
                                  className="h-24 w-24 flex-shrink-0 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
                                  src={
                                    chatTargetID
                                      ? chatTarget.profile_pic
                                      : currentUser.profile_pic
                                  }
                                  alt="Profile Picture"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 sm:ml-6 sm:flex-1">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                  {chatTargetID
                                    ? chatTarget.first_name +
                                      " " +
                                      chatTarget.last_name
                                    : currentUser.first_name +
                                      " " +
                                      currentUser.last_name}
                                </h3>
                                <span className="ml-2.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400">
                                  <span className="sr-only">Online</span>
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                @
                                {chatTargetID
                                  ? chatTarget.username
                                  : currentUser.username}
                              </p>
                            </div>
                            <div className="mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0">
                              {/* <button
                                type="button"
                                className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1"
                              >
                                Message
                              </button> */}
                              {chatTargetID ? (
                                <button
                                  type="button"
                                  className="inline-flex w-full flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                  onClick={() => {
                                    if (
                                      currentUser?.friends?.some(
                                        (friend) => friend.id === chatTargetID
                                      )
                                    ) {
                                      const indxOfFriend =
                                        currentUser?.friends.indexOf(
                                          (frnd) => frnd.id === chatTargetID
                                        );
                                      console.log(indxOfFriend);
                                      currentUser?.friends.splice(
                                        indxOfFriend,
                                        1
                                      );
                                      setCurrentUser({ ...currentUser });
                                      axios
                                        .put(
                                          `${API}/users/${currentUser.id}`,
                                          currentUser
                                        )
                                        .then((res) => console.log(res));
                                    } else {
                                      currentUser.friends.push({
                                        id: chatTargetID,
                                        name:
                                          chatTarget.first_name +
                                          " " +
                                          chatTarget.last_name,
                                        username: chatTarget.username,
                                        profile_pic: chatTarget.profile_pic,
                                      });
                                      setCurrentUser({ ...currentUser });
                                      axios
                                        .put(
                                          `${API}/users/${currentUser.id}`,
                                          currentUser
                                        )
                                        .then((res) => console.log(res));
                                    }
                                  }}
                                >
                                  {currentUser?.friends?.some(
                                    (friend) => friend.id === chatTargetID
                                  )
                                    ? "Remove Friend"
                                    : "Add Friend"}
                                </button>
                              ) : null}

                              <button
                                type="button"
                                className="inline-flex w-full flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                onClick={() => {
                                  if (!chatTargetID) {
                                    navigate(
                                      `/profile/${currentUser.stytch_id}/edit`
                                    );
                                  } else {
                                    setChatOpen(true);
                                  }
                                }}
                              >
                                {chatTargetID ? "Message" : "Edit"}
                              </button>

                              {!chatTargetID ? (
                                <div className="ml-3 inline-flex sm:ml-0">
                                  <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                  >
                                    <Menu.Button className="inline-flex items-center rounded-md bg-white p-2 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                      <span className="sr-only">
                                        Open options menu
                                      </span>
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
                                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hover:bg-orange-500 cursor-pointer">
                                        <div className="py-1">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <div
                                                className={classNames(
                                                  active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700",
                                                  "block px-4 py-2 text-sm hover:bg-orange-500 hover:text-white"
                                                )}
                                              >
                                                Logout
                                              </div>
                                            )}
                                          </Menu.Item>
                                        </div>
                                      </Menu.Items>
                                    </Transition>
                                  </Menu>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-5 sm:px-0 sm:py-0">
                        <dl className="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200">
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Badges
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">
                              <img
                                src={commentsBadge}
                                alt="Comment Badge"
                                className="object-scale-down h-10 w-10 inline"
                              />

                              <img
                                src={eventsBadge}
                                alt="Event Attendance Badge"
                                className="object-scale-down h-10 w-10 inline pb-1"
                              />
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Bio
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">
                              <p>
                                {chatTargetID
                                  ? chatTarget.about_me
                                  : currentUser.about_me}
                              </p>
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Location
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">
                              New York, NY, USA
                            </dd>
                          </div>
                          {/* <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Website
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">
                              ashleyporter.com
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Birthday
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">
                              <time dateTime="1982-06-23">June 23, 1982</time>
                            </dd>
                          </div> */}
                        </dl>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
