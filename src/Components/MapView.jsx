import { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Combobox } from "@headlessui/react";

export default function MapView({isLoaded}) {
  
  const [selected, setSelected] = useState({ lat: 40.7127753, lng: -74.0059728 });
  const center = useMemo(() => (selected ), []);

  const containerStyle = {
    width: "100%",
    height: "550px",
  };

  // const { isLoaded } = useLoadScript({
  //   id: "google-map-script",
  //   googleMapsApiKey: process.env.REACT_APP_API_KEY,
  //   libraries: ["places"],
  // });


  if (!isLoaded) return <div>Loading... </div>;


  return (
    <table className="min-w-full">
      <thead>
        <tr className="border-t border-gray-200">
          <th
            className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
            scope="col"
          >
            <span className="lg:pl-2">Map</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        <div className="places-container">
          {/* <PlacesAutocomplete setSelected={setSelected} /> */}
        </div>
        <GoogleMap zoom={10} center={center} mapContainerStyle={containerStyle}>
          {selected && <MarkerF position={selected} />}
        </GoogleMap>
      </tbody>
    </table>
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
    setSelected({ lat, lng });
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
