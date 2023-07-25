import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Datepicker from "react-tailwindcss-datepicker";

import { Combobox } from "@headlessui/react";
import axios from "axios";

export default function CreateEventSlideOver({
  createEventSlideOverOpen,
  setCreateEventSlideOverOpen,
  API,
  isLoaded,
  updateEvents,
  events,
  setEvents,
  listingEvents,
  setListingEvents,
}) {
  const [createEvent, setCreateEvent] = useState({
    event_name: "",
    event_description: "",
    event_address: "",
    latitude: 0,
    longitude: 0,
    event_date: "",
    event_photos: "",
  });

  const [interest, setInterest] = useState([]);

  const [address, setAddress] = useState({
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
  });

  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [eventPhoto, setEventPhoto] = useState("");
  // const { id } = useParams();
  // const navigate = useNavigate();

  const handleValueChange = (newValue) => {
    setCreateEvent({ ...createEvent, event_date: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let date = createEvent.event_date.startDate.split("-");
    let month = date[1][0] === "0" ? date[1][1] : date[1];
    let day = date[2];
    let year = date[0];

    console.log(month);

    date = `${month}/${day}/${year}`;

    axios
      .post(`${API}/events`, {
        ...createEvent,
        event_date: date,
        category: selectedOptions,
      })
      .then((res) => {
        console.log(res.data);
        if (eventPhoto) {
          const formData = new FormData();
          formData.append("event_photo", eventPhoto);

          axios
            .post(`${API}/events/${res.data.id}/photo`, formData)
            .then((res) => {
              updateEvents(res.data);
              setCreateEvent({
                event_name: "",
                event_description: "",
                event_address: "",
                latitude: 0,
                longitude: 0,
                event_date: "",
                event_photos: [],
              });
              setCreateEventSlideOverOpen(false);
            });
        } else {
          updateEvents(res.data);
          setCreateEvent({
            event_name: "",
            event_description: "",
            event_address: "",
            latitude: 0,
            longitude: 0,
            event_date: "",
            event_photos: [],
          });
          setCreateEventSlideOverOpen(false);
        }
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setEventPhoto(file);
    // Generate image preview
    const reader = new FileReader(); // Create a new instance of the FileReader object
    reader.onload = () => {
      // When the file is loaded, execute this function
      // setEventPhoto(reader.result);
      // Update the 'profileUser' state by merging the existing data with the new 'profile_pic' property, which contains the data URL of the selected image
    };
    reader.readAsDataURL(file);
    // Read the contents of the selected file and convert it to a data URL format
  };

  // const handleUploadedImage = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("event_photos", selectedFile);

  //   // Upload the image file to the server
  //   axios
  //     .post(`${API}/events/${id}/upload`, formData)
  //     .then((response) => {
  //       // Handle successful upload
  //       const fileUrl = response.data.staticUrl;
  //       setCurrentUser(response.data);
  //       setProfileUser({
  //         ...profileUser,
  //         profile_pic: response.data.profile_pic,
  //       });
  //     })
  //     .catch((error) => {
  //       // Handle upload error
  //       console.error("Error uploading file:", error);
  //     });
  // };

  // const onAddressChange = (e) => {
  //   setAddress({...address, [e.target.id]: e.target.value})
  // }

  // this logic allows the user to only select up to 3 checkboxes
  const maxSelected = 3;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleCheckboxChange = (e, option) => {
    const checkbox = e.target;

    if (checkbox.checked) {
      if (selectedOptions.length >= maxSelected) {
        checkbox.checked = false;
        return;
      }
      setSelectedOptions([...selectedOptions, option]);
    } else {
      const updatedOptions = selectedOptions.filter(
        (selectedOption) => selectedOption !== option
      );
      setSelectedOptions(updatedOptions);
    }
  };

  const interests = [];
  if (selectedOptions.includes("Anime")) {
    interests.push("Anime");
  }
  if (selectedOptions.includes("Gaming")) {
    interests.push("Gaming");
  }
  if (selectedOptions.includes("Personal")) {
    interests.push("Personal");
  }
  if (selectedOptions.includes("Outdoors")) {
    interests.push("Outdoors");
  }
  if (selectedOptions.includes("Food")) {
    interests.push("Food");
  }
  if (selectedOptions.includes("Music")) {
    interests.push("Music");
  }
  if (selectedOptions.includes("Limited Time")) {
    interests.push("Limited Time");
  }
  // Add more interests as needed

  const isCheckboxSelected = (option) => selectedOptions.includes(option);

  const isCheckboxDisabled = (option) => {
    if (
      selectedOptions.length >= maxSelected &&
      !selectedOptions.includes(option)
    ) {
      return true;
    }
    return false;
  };

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
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16 ">
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
                    <div className="bg-orange-500 px-4 py-7 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2
                          id="slide-over-heading"
                          className="text-lg font-semibold leading-6 text-white"
                        >
                          Create Event
                        </h2>
                        <div className="bg-orange-500 child:bg-orange-500 ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 hover:outline hover:outline-white focus:ring-2 focus:ring-white"
                            onClick={() => setCreateEventSlideOverOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon
                              className="text-white h-6 w-6"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div className="mt-4">
                      <label
                        htmlFor="event-name"
                        className="block ml-6 text-medium font-medium leading-6 text-gray-900"
                      >
                        Event Name
                      </label>
                      <div className="mt-2">
                        <input
                          value={createEvent.event_name}
                          type="text"
                          name="event_name"
                          id="event_name"
                          className="block w-96 ml-6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
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
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                          defaultValue={""}
                          onChange={onChange}
                        />
                      </div>
                      <p className="mt-2 ml-6 text-sm text-gray-500">
                        Describe your event for users that are viewing.
                      </p>
                    </div>
                    {/* IMport file  */}
                    <div className="flex flex-col mt-5 flex-wrap items-start ml-2">
                      <div className="w-full sm:w-1/3 px-4 mb-6 sm:mb-0">
                        <span className="block mt-3 text-medium font-medium leading-6 text-gray-900">
                          Photo
                        </span>
                        <span className="text-xs">Event Photo</span>
                      </div>
                      <div className="w-full ml-16 sm:w-2/3 px-4">
                        <div className="flex flex-wrap sm:flex-nowrap max-w-xl">
                          <div className="w-full py-8 px-4 text-center border-dashed border border-gray-400 hover:border-white focus:border-green-500 rounded-lg">
                            <div className="relative group h-14 w-14 mx-auto mb-4">
                              <div className="flex items-center justify-center h-14 w-14 bg-blue-500 rounded-full group-hover:bg-gray-800">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6.71 5.71002L9 3.41002V13C9 13.2652 9.10536 13.5196 9.29289 13.7071C9.48043 13.8947 9.73478 14 10 14C10.2652 14 10.5196 13.8947 10.7071 13.7071C10.8946 13.5196 11 13.2652 11 13V3.41002L13.29 5.71002C13.383 5.80375 13.4936 5.87814 13.6154 5.92891C13.7373 5.97968 13.868 6.00582 14 6.00582C14.132 6.00582 14.2627 5.97968 14.3846 5.92891C14.5064 5.87814 14.617 5.80375 14.71 5.71002C14.8037 5.61706 14.8781 5.50645 14.9289 5.3846C14.9797 5.26274 15.0058 5.13203 15.0058 5.00002C15.0058 4.86801 14.9797 4.7373 14.9289 4.61544C14.8781 4.49358 14.8037 4.38298 14.71 4.29002L10.71 0.290018C10.6149 0.198978 10.5028 0.127613 10.38 0.0800184C10.1365 -0.0199996 9.86346 -0.0199996 9.62 0.0800184C9.49725 0.127613 9.3851 0.198978 9.29 0.290018L5.29 4.29002C5.19676 4.38326 5.1228 4.49395 5.07234 4.61577C5.02188 4.73759 4.99591 4.86816 4.99591 5.00002C4.99591 5.13188 5.02188 5.26245 5.07234 5.38427C5.1228 5.50609 5.19676 5.61678 5.29 5.71002C5.38324 5.80326 5.49393 5.87722 5.61575 5.92768C5.73757 5.97814 5.86814 6.00411 6 6.00411C6.13186 6.00411 6.26243 5.97814 6.38425 5.92768C6.50607 5.87722 6.61676 5.80326 6.71 5.71002ZM19 10C18.7348 10 18.4804 10.1054 18.2929 10.2929C18.1054 10.4804 18 10.7348 18 11V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8947 17.2652 18 17 18H3C2.73478 18 2.48043 17.8947 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V11C2 10.7348 1.89464 10.4804 1.70711 10.2929C1.51957 10.1054 1.26522 10 1 10C0.734784 10 0.48043 10.1054 0.292893 10.2929C0.105357 10.4804 0 10.7348 0 11V17C0 17.7957 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7957 20 17V11C20 10.7348 19.8946 10.4804 19.7071 10.2929C19.5196 10.1054 19.2652 10 19 10Z"
                                    fill="#E8EDFF"
                                  ></path>
                                </svg>
                              </div>
                              <input
                                className="absolute top-0 left-0 h-14 w-14 opacity-0 hover:bg-gray-800"
                                id="profile_pic"
                                type="file"
                                name="profile_pic"
                                onChange={handleFileChange}
                              />
                            </div>
                            <p className="font-semibold leading-normal mb-1">
                              <span>Click to upload a file</span>
                              <span className="text-gray-400">
                                {" "}
                                or drag and drop
                              </span>
                            </p>
                            <span className="text-xs text-gray-400 font-semibold">
                              PNG, JPG, GIF or up to 10MB
                            </span>
                            <br />
                            {/* <button
                              className="bg-blue-500 hover:bg-gray-800 font-bold py-2 px-4 rounded mt-4"
                              onClick={handleUploadedImage}
                            >
                              Save
                            </button> */}
                          </div>
                        </div>
                      </div>
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
                          value={createEvent.event_date}
                          inputId="event_date"
                          onChange={handleValueChange}
                          useRange={false}
                          wrapperClassName="w-full"
                          className="bg-white block w-96 ml-6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                          asSingle={true}
                          minDate={
                            new Date(
                              new Date().setDate(new Date().getDate() - 1)
                            )
                          }
                          displayFormat={"MM/DD/YYYY"}
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
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                              onChange={onChange}
                            /> */}
                          {isLoaded ? (
                            <PlacesAutocomplete
                              setSelected={onAddressSelected}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div class=" mt-5 mb-9 ml-6 mr-6">
                      <label
                        htmlFor="street-address"
                        className="block mt-2 text-medium font-medium leading-6 text-gray-900"
                      >
                        Interests
                      </label>
                      <br />
                      <div
                        class={`flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 ${
                          isCheckboxDisabled("Anime") ? "opacity-50" : ""
                        }`}
                      >
                        <input
                          id="bordered-checkbox-1"
                          type="checkbox"
                          value="anime"
                          name="bordered-checkbox"
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) => handleCheckboxChange(e, "anime")}
                          disabled={isCheckboxDisabled("anime")}
                          checked={selectedOptions.includes("anime")}
                        />
                        <label
                          for="bordered-checkbox-1"
                          class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Anime
                        </label>
                      </div>
                      <br />
                      <div
                        class={`flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 ${
                          isCheckboxDisabled("Gaming") ? "opacity-50" : ""
                        }`}
                      >
                        <input
                          id="bordered-checkbox-1"
                          type="checkbox"
                          value="gaming"
                          name="bordered-checkbox"
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) => handleCheckboxChange(e, "gaming")}
                          disabled={isCheckboxDisabled("gaming")}
                          checked={selectedOptions.includes("gaming")}
                        />
                        <label
                          for="bordered-checkbox-2"
                          class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Gaming
                        </label>
                      </div>
                      <br />
                      <div
                        class={`flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 ${
                          isCheckboxDisabled("Personal") ? "opacity-50" : ""
                        }`}
                      >
                        <input
                          id="bordered-checkbox-1"
                          type="checkbox"
                          value="personal"
                          name="bordered-checkbox"
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) => handleCheckboxChange(e, "personal")}
                          disabled={isCheckboxDisabled("personal")}
                          checked={selectedOptions.includes("personal")}
                        />
                        <label
                          for="bordered-checkbox-3"
                          class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Personal
                        </label>
                      </div>
                      <br />
                      <div
                        class={`flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 ${
                          isCheckboxDisabled("Outdoors") ? "opacity-50" : ""
                        }`}
                      >
                        <input
                          id="bordered-checkbox-1"
                          type="checkbox"
                          value="outdoors"
                          name="bordered-checkbox"
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) => handleCheckboxChange(e, "outdoors")}
                          disabled={isCheckboxDisabled("outdoors")}
                          checked={selectedOptions.includes("outdoors")}
                        />
                        <label
                          for="bordered-checkbox-4"
                          class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Outdoors
                        </label>
                      </div>
                      <br />
                      <div
                        class={`flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 ${
                          isCheckboxDisabled("Food") ? "opacity-50" : ""
                        }`}
                      >
                        <input
                          id="bordered-checkbox-1"
                          type="checkbox"
                          value="food"
                          name="bordered-checkbox"
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) => handleCheckboxChange(e, "food")}
                          disabled={isCheckboxDisabled("food")}
                          checked={selectedOptions.includes("food")}
                        />
                        <label
                          for="bordered-checkbox-5"
                          class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Food
                        </label>
                      </div>
                      <br />
                      <div
                        class={`flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 ${
                          isCheckboxDisabled("Music") ? "opacity-50" : ""
                        }`}
                      >
                        <input
                          id="bordered-checkbox-1"
                          type="checkbox"
                          value="music"
                          name="bordered-checkbox"
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) => handleCheckboxChange(e, "music")}
                          disabled={isCheckboxDisabled("music")}
                          checked={selectedOptions.includes("music")}
                        />
                        <label
                          for="bordered-checkbox-6"
                          class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Music
                        </label>
                      </div>
                      <br />
                      <div
                        class={`flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 ${
                          isCheckboxDisabled("Limited Time") ? "opacity-50" : ""
                        }`}
                        style={{
                          backgroundImage:
                            "linear-gradient(191deg, #2fea4f, #d4ccbf, #348aee, #ee112d, #ee8811)",
                          backgroundSize: "1000% 1000%",
                          animation: "limited-time 38s ease infinite",
                        }}
                      >
                        <input
                          id="bordered-checkbox-1"
                          type="checkbox"
                          value="limited-time"
                          name="bordered-checkbox"
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) =>
                            handleCheckboxChange(e, "limitedtime")
                          }
                          disabled={isCheckboxDisabled("limitedtime")}
                          checked={selectedOptions.includes("limitedtime")}
                        />
                        <label
                          for="bordered-checkbox-7"
                          class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Limited Time
                        </label>
                      </div>
                    </div>

                    <br />
                    <br />
                    <div className="border-b border-gray-900/10 pb-12 w-full">
                      <button
                        className=" ml-6 mr-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                        onClick={handleSubmit}
                      >
                        Create
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
      <div className="relative mt-1">
        <Combobox.Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
          placeholder="Search an address"
        />
        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <Combobox.Option
                key={place_id}
                value={description}
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
