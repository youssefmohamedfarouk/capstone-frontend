import {
  Bars4Icon as Bars4,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";

export default function ListingView({
  events,
  setEvents,
  classNames,
  attendeesSortOrder,
  setAttendeesSortOrder,
  eventDateSortOrder,
  setEventDateSortOrder,
  rsvpdUsers,
  totalRSVPS,
  setSlideoverOpen,
  currentEvent,
  setCurrentEvent,
}) {
  console.log(totalRSVPS);
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
              if (attendeesSortOrder === 1) {
                setEvents([
                  ...events.sort((a, b) =>
                    totalRSVPS.filter((event) => event.event_id === a.id)[0]
                      .total_rsvps >
                    totalRSVPS.filter((event) => event.event_id === b.id)[0]
                      .total_rsvps
                      ? -1
                      : 1
                  ),
                ]);
              } else if (eventDateSortOrder === 2) {
                setEvents([
                  ...events.sort((a, b) =>
                    totalRSVPS.filter((event) => event.event_id === a.id)[0]
                      .total_rsvps >
                    totalRSVPS.filter((event) => event.event_id === b.id)[0]
                      .total_rsvps
                      ? 1
                      : -1
                  ),
                ]);
              }
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
              if (eventDateSortOrder === 1) {
                setEvents([
                  ...events.sort(
                    (a, b) => new Date(b.event_date) - new Date(a.event_date)
                  ),
                ]);
              } else if (eventDateSortOrder === 2) {
                setEvents([
                  ...events.sort(
                    (a, b) => new Date(a.event_date) - new Date(b.event_date)
                  ),
                ]);
              }
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
        {events?.map((event) => (
          <tr key={event.id}>
            <td className="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
              <div className="flex items-center space-x-3 lg:pl-2">
                <div
                  className={classNames(
                    event.bgColorClass,
                    "bg-pink-600 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  )}
                  aria-hidden="true"
                />
                <div
                  className="truncate hover:text-gray-600"
                  onClick={() => {
                    console.log(event);
                    setCurrentEvent(event);
                    setSlideoverOpen(true);
                  }}
                >
                  <span>
                    {event.event_name}{" "}
                    <span className="font-normal text-gray-500">
                      at {event.event_address}
                    </span>
                  </span>
                </div>
              </div>
            </td>
            <td className="px-6 py-3 text-sm font-medium text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="flex flex-shrink-0 -space-x-1">
                  {rsvpdUsers
                    ?.filter((member) => member.event_id === event.id)
                    ?.slice(0, 4)
                    .map((member) => (
                      <img
                        key={member.username + event.id}
                        className="h-6 w-6 max-w-none rounded-full ring-2 ring-white"
                        src={member.profile_pic}
                        alt={member.username}
                      />
                    ))}
                </div>
                {console.log(totalRSVPS)}
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
            <td className="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">
              {event.event_date}
            </td>
            <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium">
              <button
                type="button"
                className="rounded bg-orange-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                RSVP
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
