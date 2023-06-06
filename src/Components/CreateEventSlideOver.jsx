import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Combobox } from "@headlessui/react";
import axios from "axios";

const PlacesAutocomplete = ({ setSelected }) => {
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
      <Combobox.Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search an address"
      />
      <Combobox.Options>
        {status === "OK" &&
          data.map(({ place_id, description }) => (
            <Combobox.Option key={place_id} value={description}>
              {" "}
              {description}
            </Combobox.Option>
          ))}
      </Combobox.Options>
    </Combobox>
  );
};

export default function CreateEventSlideOver({
  createEventSlideOverOpen,
  setCreateEventSlideOverOpen,
  API,
  isLoaded,
}) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API}/events`, { ...createEvent }).then((res) => {});
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
    <Transition.Root show={createEventSlideOverOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={setCreateEventSlideOverOpen}
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2
                          id="slide-over-heading"
                          className="text-lg font-semibold leading-6 text-gray-900"
                        >
                          Create Event
                        </h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-orange-500"
                            onClick={() => setCreateEventSlideOverOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div>
                      <label
                        htmlFor="eventName"
                        className="block ml-6 mt-2 text-medium font-medium leading-6 text-gray-900"
                      >
                        Event Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="eventName"
                          id="event_name"
                          className="block w-96 ml-6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          aria-describedby="eventName-description"
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

                    <div className="col-span-full">
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
                        />
                      </div>
                      <p className="mt-2 ml-6 text-sm text-gray-500">
                        Describe your event for users that are viewing.
                      </p>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                      <h2 className="block ml-6 mt-3 text-medium font-medium leading-6 text-gray-900">
                        Location
                      </h2>
                      <p className="mt-2 ml-6 text-sm text-gray-500">
                        Use a permanent address where you can receive mail.
                      </p>

                      <div className="mt-5 ml-7 mr-7 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="street-address"
                            className="block text-sm font-small leading-6 text-gray-900"
                          >
                            Street address
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
                              />
                            ) : null}
                          </div>
                        </div>

                        {/* <div className="sm:col-span-2 sm:col-start-1">
                          <label
                            htmlFor="city"
                            className="block text-sm font-small leading-6 text-gray-900"
                          >
                            City
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="city"
                              id="city"
                              autoComplete="address-level2"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={onAddressChange}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="region"
                            className="block text-sm font-small leading-6 text-gray-900"
                          >
                            State / Province
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="state"
                              id="state"
                              autoComplete="address-level1"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={onAddressChange}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="postal-code"
                            className="block text-sm font-small leading-6 text-gray-900"
                          >
                            ZIP Code
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="zip"
                              id="zip"
                              autoComplete="postal-code"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={onAddressChange}
                            />
                          </div>
                        </div> */}
                        {/* <div className="sm:col-span-3">
                          <label
                            htmlFor="country"
                            className="block text-sm font-small leading-6 text-gray-900"
                          >
                            Country
                          </label>
                          <div className="mt-2">
                            <select
                              id="country"
                              name="country"
                              autoComplete="country-name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                              <option>United States</option>
                              <option>Canada</option>
                              <option>Mexico</option>
                            </select>
                          </div>
                        </div> */}
                      </div>
                    </div>
                    <button
                      className=" ml-6 mr-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleSubmit}
                    >
                      Create
                    </button>
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
