import { Fragment, useState, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";

import { Combobox } from "@headlessui/react";
import axios from "axios";

export default function EditEventSlideOver({
  createEventSlideOverOpen,
  setCreateEventSlideOverOpen,
  API,
  isLoaded,
  setEvents,
  updateEvents,
  currentEvent,
  editSlideOver,
  setEditSlideOver,
}) {
  const defaultDate = moment(currentEvent.event_date, "MM-DD-YYYY").toDate();
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const [createEvent, setCreateEvent] = useState({
    event_name: "",
    event_description: "",
    event_address: "",
    latitude: 0,
    longitude: 0,
    event_date: "",
  });

  const [address, setAddress] = useState({
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
  });

  const [value, setValue] = useState({
    startDate: selectedDate,
    endDate: null,
  });

  const [details, setEventDetails] = useState([]);

  const handleValueChange = (newValue) => {
    setCreateEvent({ ...createEvent, event_date: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let date = createEvent.event_date.startDate.split("-");
    date = `${date[1]}/${date[2]}/${date[0]}`;

    axios
      .put(`${API}/events/${currentEvent.id}`, {
        ...createEvent,
        event_date: date,
      })
      .then((res) => {
        updateEvents(res.data);
      });
  };

  const onChange = (e) => {
    setCreateEvent({ ...createEvent, [e.target.id]: e.target.value });
  };

  const onAddressSelected = ({ lat, lng, address }) => {
    setCreateEvent({
      ...createEvent,
      latitude: lat,
      longitude: lng,
      event_address: address,
    });
  };

  // const onAddressChange = (e) => {
  //   setAddress({...address, [e.target.id]: e.target.value})
  // }

  return (
    <Transition.Root show={editSlideOver} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setEditSlideOver}>
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2
                          id="slide-over-heading"
                          className="text-lg font-semibold leading-6 text-gray-900"
                        >
                          Edit Event
                        </h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-orange-500"
                            onClick={() => setEditSlideOver(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div className="mt-1">
                      <label
                        htmlFor="event-name"
                        className="block ml-6 text-medium font-medium leading-6 text-gray-900"
                      >
                        Event Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="event_name"
                          id="event_name"
                          className="block w-96 ml-6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          aria-describedby="eventName-description"
                          value={currentEvent.event_name}
                          onChange={onChange}
                        />
                      </div>
                      <p
                        className="mt-2 ml-6 text-sm text-gray-500"
                        id="eventName-description"
                      >
                        What are we going to call this event?
                      </p>
                    </div>

                    <div className=" mt-1 col-span-full">
                      <label
                        htmlFor="about"
                        className="block ml-6 mt-3 text-medium font-medium leading-6 text-gray-900"
                      >
                        Description
                      </label>
                      <div className="mt-2 ml-6 mr-6">
                        <textarea
                          id="event_description"
                          name="event_description"
                          rows={3}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue={""}
                          onChange={onChange}
                          value={currentEvent.event_description}
                        />
                      </div>
                      <p className="mt-2 ml-6 text-sm text-gray-500">
                        Describe your event for users that are viewing.
                      </p>
                    </div>
                    {/* Setup Date */}
                    <div className="mt-2 col-span-full">
                      <label
                        htmlFor="event_date"
                        className="block ml-6 mt-2 text-medium font-medium leading-6 text-gray-900"
                      >
                        Date
                      </label>
                      <div className="ml-5 mr-5 mt-2">
                        <Datepicker
                          value={value}
                          inputId="event_date"
                          onChange={handleValueChange}
                          useRange={false}
                          wrapperClassName="w-full"
                          className="block w-96 ml-6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          tog
                          asSingle={true}
                          minDate={new Date()}
                          displayFormat={"MM/DD/YYYY"}
                          placeholder={currentEvent.event_date}
                          popoverDirection="down"
                        />
                      </div>
                    </div>

                    <div className=" mt-5 mb-9 ml-6 mr-6">
                      <div className="col-span-full">
                        <label
                          htmlFor="street-address"
                          className="block mt-2 text-medium font-medium leading-6 text-gray-900"
                        >
                          Location
                        </label>
                        <div className="mt-2">
                          {/* <input
                              type="text"
                              name="event_address"
                              id="event_address"
                              autoComplete="street-address"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={onChange}
                            /> */}
                          {isLoaded ? (
                            <PlacesAutocomplete
                              setSelected={onAddressSelected}
                              currentEvent={currentEvent}
                              editEvent={editEvent}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12 w-full">
                      <button
                        className=" ml-6 mr-6 bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded"
                        onClick={handleSubmit}
                      >
                        Save Event
                      </button>
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

const PlacesAutocomplete = ({ setSelected, currentEvent, editEvent }) => {
  const {
    ready, //whether is ready to go having load the google script
    value, // what the users typed into the userbox
    setValue,
    suggestions: { status, data }, // status of the result, data: all of the actual suggestions
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng, address });
  };

  return (
    <Combobox onChange={handleSelect}>
      <div className="relative mt-1">
        <Combobox.Input
          value={currentEvent.event_address}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search an address"
        />
        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <Combobox.Option
                key={place_id}
                value={editEvent}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-orange-500 text-white" : "text-gray-900"
                  }`
                }
              >
                {" "}
                {description}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Provide a street address for your event.
      </p>
    </Combobox>
  );
};
