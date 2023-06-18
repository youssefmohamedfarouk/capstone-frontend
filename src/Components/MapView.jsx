import { useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  Icon,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Combobox } from "@headlessui/react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function MapView({
  isLoaded,
  events,
  setCurrentEvent,
  setSlideoverOpen,
  currentUsersRSVPS,
  setConfirmationModalOpen,
  currentUserId,
  API,
  setCurrentUsersRSVPS,
  toast,
  toastSettings,
  rsvpSuccess,
  unRSVPSuccess,
}) {
  const [selected, setSelected] = useState({
    lat: 40.7127753,
    lng: -74.0059728,
  });
  const [eventMarkers, setEventMarkers] = useState(events);

  const center = useMemo(() => selected, []);

  const containerStyle = {
    width: "100%",
    height: "600px",
  };

  // const [selectedMarker, setSelectedMarker] = useState(null);

  // const { isLoaded } = useLoadScript({
  //   id: "google-map-script",
  //   googleMapsApiKey: process.env.REACT_APP_API_KEY,
  //   libraries: ["places"],
  // });

  if (!isLoaded) return <div>Loading... </div>;

  const handleOnClick = (event) => {
    setCurrentEvent(event);
    setSlideoverOpen(true);
  };

  return (
    <table className="min-w-full">
      <thead>
        <tr className="border-t border-gray-200">
          <th
            className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
            scope="col"
          >
            <span className=""> Map </span>
          </th>
          <th
            className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
            scope="col"
          >
            {/* Attendees Sort Icon Logic */}
            Events
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        <td className="w-[65%]">
          <GoogleMap
            zoom={10}
            center={center}
            mapContainerStyle={containerStyle}
          >
            {eventMarkers &&
              eventMarkers.map((marker, key) => (
                <MarkerF
                  key={key}
                  position={{
                    lat: Number(marker.latitude),
                    lng: Number(marker.longitude),
                  }}
                  onClick={() => {
                    handleOnClick(marker);
                  }}
                  // options={{
                  //   // Apply different style to the selected marker
                  //   icon: {
                  //     url: "marker-icon.png",
                  //     scaledSize: {
                  //       width: 30,
                  //       height: 30,
                  //     },
                  //     // selectedMarker === marker
                  //     //   ? new window.google.maps.Size(50, 50)
                  //     //   : new window.google.maps.Size(30, 30),
                  //   },
                  // }}
                />
              ))}
          </GoogleMap>
        </td>
        <td className="w-[35%]">
          <div className="places-container flex flex-row">
            {/* <PlacesAutocomplete setSelected={setSelected} /> */}

            <div className="overflow-auto  pl-[10px] pr-[10px] pb-[10px] flex flex-col max-h-[600px]">
              {events.map((event, key) => {
                return (
                  <Card
                    key={key}
                    className="mt-3 w-100 border-solid border-2 hover:shadow-orange-500 hover:bg-gray-100"
                  >
                    <CardBody className=" flex flex-row">
                      <div className="min-w-32 min-h-32 max-w-32 max-h-32 border-solid border-2 shrink-0 rounded-md">
                        <img
                          src={
                            (event.event_photos || [])[0] ||
                            "https://as2.ftcdn.net/v2/jpg/01/20/28/25/1000_F_120282530_gMCruc8XX2mwf5YtODLV2O1TGHzu4CAb.jpg"
                          }
                          alt=""
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex flex-col pl-4 ">
                        <Typography
                          variant="h5"
                          color="blue-gray"
                          className="mb-2"
                        >
                          {event.event_name}
                        </Typography>
                        <Typography>{event.event_date}</Typography>
                        <Typography>{event.event_address}</Typography>
                      </div>
                    </CardBody>
                    <CardFooter className=" flex pt-0">
                      <Button
                        size="sm"
                        variant="text"
                        className="rounded w-[50%] bg-white px-2 py-1 text-sm font-semibold outline outline-orange-500 text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                        onClick={() => {
                          handleOnClick(event);
                        }}
                      >
                        Full view
                      </Button>
                      <button
                        type="button"
                        className={
                          currentUsersRSVPS.some(
                            (entry) => entry.event_id === event.id
                          )
                            ? "rounded w-[50%] ml-2 bg-orange-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 group-hover:outline group-hover:outline-white"
                            : "rounded w-[50%] ml-2 bg-white px-2 py-1 text-sm font-semibold outline outline-orange-500 text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                        }
                        onClick={() => {
                          setCurrentEvent(event);
                          currentUsersRSVPS.some(
                            (entry) => entry.event_id === event.id
                          )
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
                                  rsvpSuccess();
                                });
                        }}
                      >
                        {currentUsersRSVPS.some(
                          (entry) => entry.event_id === event.id
                        )
                          ? `RSVP'D`
                          : `RSVP`}
                      </button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </td>
      </tbody>
    </table>
  );
}

// const PlacesAutocomplete = ({ setSelected }) => {
//   const {
//     ready, //whether is ready to go having load the google script
//     value, // what the users typed into the userbox
//     setValue,
//     suggestions: { status, data }, // status of the result, data: all of the actual suggestions
//     clearSuggestions,
//   } = usePlacesAutocomplete();

//   const handleSelect = async (address) => {
//     setValue(address, false);
//     clearSuggestions();

//     const results = await getGeocode({ address });
//     const { lat, lng } = await getLatLng(results[0]);
//     setSelected({ lat, lng });
//   };

//   return (
//     <Combobox onChange={handleSelect}>
//       <Combobox.Input
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         disabled={!ready}
//         className="combobox-input"
//         placeholder="Search an address"
//       />
//       <Combobox.Options>
//         {status === "OK" &&
//           data.map(({ place_id, description }) => (
//             <Combobox.Option key={place_id} value={description}>
//               {" "}
//               {description}
//             </Combobox.Option>
//           ))}
//       </Combobox.Options>
//     </Combobox>
//   );
// };
