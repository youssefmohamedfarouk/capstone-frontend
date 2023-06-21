import {
  Bars4Icon as Bars4,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function ListingView({
  API,
  currentUser,
  events,
  setEvents,
  listingEvents,
  setListingEvents,
  classNames,
  rsvpdUsers,
  totalRSVPS,
  setSlideoverOpen,
  currentEvent,
  setCurrentEvent,
  currentUsersRSVPS,
  setCurrentUsersRSVPS,
  confirmationModalOpen,
  setConfirmationModalOpen,
  toast,
  toastSettings,
  rsvpSuccess,
  unRSVPSuccess,
  setChatTargetID,
}) {
  const currentUserId = currentUser.id;
  const [attendeesSortOrder, setAttendeesSortOrder] = useState(0);
  const [eventDateSortOrder, setEventDateSortOrder] = useState(0);

  console.log("TOTAL - - - ", totalRSVPS);
  useEffect(() => {
    if (attendeesSortOrder === 2) {
      setListingEvents([
        ...listingEvents.sort((a, b) => {
          const aTotalRSVPS = totalRSVPS.find(
            (event) => event.event_id === a.id
          ).total_rsvps;
          const bTotalRSVPS = totalRSVPS.find(
            (event) => event.event_id === b.id
          ).total_rsvps;

          console.log(aTotalRSVPS, bTotalRSVPS);

          return aTotalRSVPS - bTotalRSVPS;
        }),
      ]);
    } else if (attendeesSortOrder === 1) {
      setListingEvents([
        ...listingEvents.sort((a, b) => {
          const aTotalRSVPS = totalRSVPS.find(
            (event) => event.event_id === a.id
          ).total_rsvps;
          const bTotalRSVPS = totalRSVPS.find(
            (event) => event.event_id === b.id
          ).total_rsvps;

          return bTotalRSVPS - aTotalRSVPS;
        }),
      ]);
    } else {
      setListingEvents([...events]);
    }

    if (eventDateSortOrder === 2) {
      setListingEvents([
        ...listingEvents.sort(
          (a, b) => new Date(b.event_date) - new Date(a.event_date)
        ),
      ]);
    } else if (eventDateSortOrder === 1) {
      setListingEvents([
        ...listingEvents.sort(
          (a, b) => new Date(a.event_date) - new Date(b.event_date)
        ),
      ]);
    } else {
      setListingEvents([...events]);
    }
  }, [attendeesSortOrder, eventDateSortOrder]);

  return (
    <table className="min-w-full">
      <thead>
        <tr className="border-t border-gray-200">
          <th
            className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
            scope="col"
          >
            <span className="lg:pl-2">Upcoming Events</span>
          </th>
          <th
            className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
            scope="col"
            onClick={() => {
              setAttendeesSortOrder((attendeesSortOrder + 1) % 3);
              setEventDateSortOrder(0);

              // if (attendeesSortOrder === 2) {
              //   setListingEvents([
              //     ...listingEvents.sort((a, b) =>
              //       totalRSVPS.find((event) => event.event_id === a.id)
              //         .total_rsvps >
              //       totalRSVPS.find((event) => event.event_id === b.id)
              //         .total_rsvps
              //         ? 1
              //         : -1
              //     ),
              //   ]);
              // } else if (attendeesSortOrder === 1) {
              //   setListingEvents([
              //     ...listingEvents.sort((a, b) =>
              //       totalRSVPS.find((event) => event.event_id === a.id)
              //         .total_rsvps >
              //       totalRSVPS.find((event) => event.event_id === b.id)
              //         .total_rsvps
              //         ? -1
              //         : 1
              //     ),
              //   ]);
              // } else {
              //   setListingEvents([...events]);
              // }
            }}
          >
            {/* Attendees Sort Icon Logic */}
            Attendees
            {attendeesSortOrder === 0 ? (
              <Bars4
                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 inline pl-1"
                aria-hidden="true"
              />
            ) : attendeesSortOrder === 1 ? (
              <BarsArrowDownIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 inline pl-1"
                aria-hidden="true"
              />
            ) : (
              <BarsArrowUpIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 inline pl-1"
                aria-hidden="true"
              />
            )}
          </th>
          <th
            className="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell whitespace-nowrap"
            scope="col"
            onClick={() => {
              setEventDateSortOrder((eventDateSortOrder + 1) % 3);
              setAttendeesSortOrder(0);
              // if (eventDateSortOrder === 2) {
              //   setListingEvents([
              //     ...listingEvents.sort(
              //       (a, b) => new Date(b.event_date) - new Date(a.event_date)
              //     ),
              //   ]);
              // } else if (eventDateSortOrder === 1) {
              //   setListingEvents([
              //     ...listingEvents.sort(
              //       (a, b) => new Date(a.event_date) - new Date(b.event_date)
              //     ),
              //   ]);
              // } else {
              //   setListingEvents([...events]);
              // }
            }}
          >
            Event Date
            {eventDateSortOrder === 0 ? (
              <Bars4
                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 inline-flex pl-1"
                aria-hidden="true"
              />
            ) : eventDateSortOrder === 1 ? (
              <BarsArrowDownIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 inline-flex pl-1"
                aria-hidden="true"
              />
            ) : (
              <BarsArrowUpIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 inline-flex pl-1"
                aria-hidden="true"
              />
            )}
          </th>
          <th
            className="border-b border-gray-200 bg-gray-50 py-3 pr-6 text-right text-sm font-semibold text-gray-900"
            scope="col"
          />
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {listingEvents?.map((event, key) => (
          <tr
            key={event.id}
            className="hover:bg-orange-500 group cursor-pointer"
          >
            <td
              className="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900 group-hover:text-white cursor-pointer"
              onClick={() => {
                setCurrentEvent(event);
                setSlideoverOpen(true);
              }}
            >
              <div className="flex items-center space-x-3 lg:pl-2">
                <div
                  className={classNames(
                    event.bgColorClass,
                    "bg-pink-600 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  )}
                  aria-hidden="true"
                />
                <div className="truncate group-hover:text-white">
                  <span className="group-hover:text-white">
                    {event.event_name}{" "}
                    <span className="font-normal text-gray-500 group-hover:text-white">
                      at {event.event_address}
                    </span>
                  </span>
                </div>
              </div>
            </td>
            <td
              className="px-6 py-3 text-sm font-medium text-gray-500 group-hover:text-white"
              onClick={() => {
                setCurrentEvent(event);
                setSlideoverOpen(true);
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex flex-shrink-0 -space-x-1">
                  {rsvpdUsers
                    ?.filter((member) => member.event_id === event.id)
                    ?.slice(0, 4)
                    .map((member, key) => (
                      <img
                        key={member.username + key}
                        className="h-6 w-6 max-w-none rounded-full ring-2 ring-white"
                        src={member.profile_pic}
                        alt={member.username}
                      />
                    ))}
                </div>
                {totalRSVPS?.filter(
                  (listing) => listing.event_id === event.id
                )[0]?.total_rsvps > 4 ? (
                  <span className="flex-shrink-0 text-xs font-medium leading-5">
                    +
                    {totalRSVPS?.filter(
                      (listing) => listing.event_id === event.id
                    )[0]?.total_rsvps - 4}
                  </span>
                ) : null}
              </div>
            </td>
            <td
              className="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell group-hover:text-white"
              onClick={() => {
                setCurrentEvent(event);
                setSlideoverOpen(true);
              }}
            >
              {event.event_date}
            </td>
            <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium">
              <button
                type="button"
                className={
                  currentUsersRSVPS.some((entry) => entry.event_id === event.id)
                    ? "rounded bg-orange-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 group-hover:outline group-hover:outline-white"
                    : "rounded bg-white px-2 py-1 text-sm font-semibold outline outline-orange-500 text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                }
                onClick={() => {
                  setCurrentEvent(event);
                  currentUsersRSVPS.some((entry) => entry.event_id === event.id)
                    ? setConfirmationModalOpen(true)
                    : axios
                        .post(`${API}/usersevents/`, {
                          user_id: currentUserId,
                          event_id: event.id,
                          rsvp: true,
                        })
                        .then((res) => {
                          const tempUsersRSVPS = [...currentUsersRSVPS];
                          tempUsersRSVPS.push({ ...res.data });
                          setCurrentUsersRSVPS(tempUsersRSVPS);
                          currentUsersRSVPS.some(
                            (entry) => entry.event_id === event.id
                          )
                            ? unRSVPSuccess()
                            : rsvpSuccess();
                        });
                }}
              >
                {currentUsersRSVPS.some((entry) => entry.event_id === event.id)
                  ? `RSVP'D`
                  : `RSVP`}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
