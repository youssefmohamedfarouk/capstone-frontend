import {
  Bars4Icon as Bars4,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/20/solid";

export default function ListingView({
  events,
  classNames,
  attendeesSortOrder,
  setAttendeesSortOrder,
  eventDateSortOrder,
  setEventDateSortOrder,
}) {
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
            className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
            scope="col"
            onClick={() => {
              setAttendeesSortOrder((attendeesSortOrder + 1) % 3);
              setEventDateSortOrder(0);
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
        {events.map((event) => (
          <tr key={event.id}>
            <td className="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
              <div className="flex items-center space-x-3 lg:pl-2">
                <div
                  className={classNames(
                    event.bgColorClass,
                    "h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  )}
                  aria-hidden="true"
                />
                <a href="#" className="truncate hover:text-gray-600">
                  <span>
                    {event.title}{" "}
                    <span className="font-normal text-gray-500">
                      in {event.team}
                    </span>
                  </span>
                </a>
              </div>
            </td>
            <td className="px-6 py-3 text-sm font-medium text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="flex flex-shrink-0 -space-x-1">
                  {event.members.map((member) => (
                    <img
                      key={member.handle}
                      className="h-6 w-6 max-w-none rounded-full ring-2 ring-white"
                      src={member.imageUrl}
                      alt={member.name}
                    />
                  ))}
                </div>
                {event.totalMembers > event.members.length ? (
                  <span className="flex-shrink-0 text-xs font-medium leading-5">
                    +{event.totalMembers - event.members.length}
                  </span>
                ) : null}
              </div>
            </td>
            <td className="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">
              {event.lastUpdated}
            </td>
            <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium">
              <a href="#" className="text-indigo-600 hover:text-indigo-900">
                Edit
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
