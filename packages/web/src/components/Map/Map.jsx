import {
  useState,
  useRef,
  useMemo,
  useContext,
  useEffect,
  useCallback,
} from "react";
// import { useMapEvents } from "react-leaflet/hooks";
// import mapuser from "../../assets/logos/mapuser.svg";
import "./Map.css";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Fuse from "fuse.js";

import { othersDrag, flyImg, iconsMap } from "./MapIcons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Rectangle,
  Circle,
  useMapEvents,
} from "react-leaflet";
import { useDisclosure, useColorMode, useColorModeValue, useToast } from "@chakra-ui/react";
import InfoModal from "../InfoModal/InfoModal";

import DataContext from "../../context/DataContext";
import { UserAuth } from "../../context/AuthContext";

import axios from "axios";

import { filterItem } from "../../utils/Utils.js";

// Add this new import for the geocoding service
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Input, Button, Box, IconButton, Spinner, VStack, Text } from "@chakra-ui/react"; // Import Chakra UI components
import { SearchIcon } from "@chakra-ui/icons";
import debounce from 'lodash/debounce';

/**
 * Map is uses react-leaflet's API to communicate user actions to map entities and information
 *
 * @component
 *
 *
 * @prop {number[]} focusLocation - coordinates to move map view to and zoom in on
 * @prop {string} search - search bar query
 * @prop {boolean} isEdit - if in Edit mode (i.e. user is trying to create a marker)
 * ! (currently reversed) @prop {boolean} isCreate - if in Create mode
 * @prop {LatLng || number[]} position - LatLng object for the latitude and longitude coordinates of newAddedItem marker position (default: number array of center coordinates)
 * @prop {object} newAddedItem - updates as user adds new item information on {@link CreateModal}
 * @prop {number} centerPosition - center of map coordinates
 * @prop {object} findFilter - search filters
 *
 *
 *
 * @returns {JSX.Element} Leaflet Map component
 */

export default function Map({
  isEdit,
  newAddedItem,
  setNewAddedItem,
  setIsEdit,
  search,
  findFilter,
  setIsCreate,
  isCreate,
  centerPosition,
  position,
  setPosition,
  focusLocation,
  setFocusLocation,
  setUploadImg,
  setLeaderboard,
}) {
  // Contexts
  const { user } = UserAuth();
  const { colorMode } = useColorMode();
  const { data, setLoading, token, setData } = useContext(DataContext);

  // State: isOpen - if InfoModal is open
  const { isOpen, onOpen, onClose } = useDisclosure();
  // State: itemData - currently selected item
  // ! (doesn't erase when clicked off of previously selected item)
  const [itemData, setItemData] = useState({});
  // State: showDonut - if red ring around selected marker shows
  const [showDonut, setShowDonut] = useState(false);

  // Allowed boundaries of markers (currently UCI borders)
  const allowedBounds = [
    [33.656487295651, -117.85412222020983],
    [33.65580858123096, -117.82236486775658],
    [33.63290776411016, -117.85403639000239],
    [33.630120665484185, -117.82240778293699],
  ];
  const bounds = L.latLngBounds(allowedBounds);

  // const mapBoundsCoordinates = [
  //   [33.625038, -117.875143],
  //   [33.668298, -117.808742],
  // ];
  // const mapBounds = L.latLngBounds(mapBoundsCoordinates);

  const handleMarkerSelect = async () => {
    setShowDonut(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setShowDonut(false);
  };

  useEffect(() => {
    const handleFocus = async () => {
      await handleMarkerSelect();
      setFocusLocation(undefined);
    };

    if (focusLocation) {
      handleFocus();
    }
  }, [focusLocation, setFocusLocation]);

  const fuseOptions = {
    keys: ["name", "description"],
    threshold: 0.3,
    includeScore: true,
  };

  const fuse = new Fuse(data, fuseOptions);
  const results = fuse.search(search).map((result) => result.item);

  const filterItemCallback = useCallback(
    (item) => filterItem(item, findFilter, user),
    [findFilter, user]
  );

  const markersData = results.length > 0 ? results : data;
  const allMarkers = markersData.filter(filterItemCallback).map((item) => {
    return (
      <Marker
        key={item.key}
        position={item.location}
        eventHandlers={{
          click: () => {
            onOpen();
            setItemData(item);
            setFocusLocation(item.location);
          },
        }}
        icon={
          item.isresolved
            ? iconsMap["resolved"][item.islost]
            : (iconsMap[item.type] || iconsMap["others"])[item.islost]
        }
      ></Marker>
    );
  });

  // moves map when focusLocation state changes
  function MapFocusLocation({ location }) {
    const map = useMap();
    if (location) {
      map.flyTo(location, 18);
    }

    return location ? (
      <Marker position={location} icon={flyImg}></Marker> // ? there is no fly image??
    ) : null;
  }

  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [setPosition]
  );
  async function handleSubmit() {
    const date = new Date();

    if (!token) {
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items`,
        {
          image: newAddedItem.image,
          type: newAddedItem.type,
          islost: newAddedItem.islost,
          name: newAddedItem.name,
          description: newAddedItem.description,
          email: user.email,
          location: [position.lat, position.lng],
          itemdate: newAddedItem.itemdate,
          date: date.toISOString(),
          isresolved: newAddedItem.isresolved,
          ishelped: newAddedItem.ishelped,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // verify auth
          },
        }
      )
      .then((item) => {
        const newItem = {
          image: newAddedItem.image,
          type: newAddedItem.type,
          islost: newAddedItem.islost,
          name: newAddedItem.name,
          description: newAddedItem.description,
          email: user.email,
          location: [position.lat, position.lng],
          date: date.toISOString(),
          itemdate: newAddedItem.itemdate,
          id: item.data.id,
          isresolved: newAddedItem.isresolved,
          ishelped: newAddedItem.ishelped,
        };
        setData((prev) => [...prev, newItem]);
        setPosition(centerPosition);
        setFocusLocation(newItem.location);
        setNewAddedItem({
          image: "",
          type: "",
          islost: true,
          name: "",
          description: "",
          itemdate: "",
          isresolved: false,
          ishelped: null,
        });
        setIsCreate(!isCreate);
        setUploadImg("");

        // Update the leaderboard
        const pointsToAdd = newAddedItem.islost ? 1 : 3;

        axios.put(
          `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/leaderboard`,
          {
            email: user.email,
            pointsToAdd: pointsToAdd,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // verify auth
            },
          }
        );

        setLeaderboard((prev) =>
          prev.map((u) =>
            u.email === user.email
              ? { ...u, points: (u.points || 0) + pointsToAdd }
              : u
          )
        );
      })
      .catch((err) => console.log(err));

    setLoading(true);
  }

  const toggleDraggable = () => {
    if (!bounds.contains(position)) {
      alert("ITEM OUT OF BOUNDS (UCI ONLY)");
      return;
    } else {
      setLoading(false);
      handleSubmit();
      setIsEdit(!isEdit);
    }
  };
  const transparentColor = { color: "#ffffff00", fillColor: "None" };

  function SetBoundsRectangles() {
    const map = useMap();

    const outerHandlers = useMemo(
      () => ({
        click() {
          map.fitBounds(bounds);
        },
      }),
      [map]
    );

    return (
      <>
        <Rectangle
          bounds={bounds}
          eventHandlers={outerHandlers}
          pathOptions={transparentColor}
        />
      </>
    );
  }

  const mapUrl =
    colorMode === "dark"
      ? import.meta.env.VITE_REACT_APP_MAPBOX_DARK_URL
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const NewItemMarker = () => {
    useMapEvents({
      click(event) {
        setPosition(event.latlng);
      },
    });

    return position.lat !== centerPosition[0] &&
      position.lng !== centerPosition[1] ? (
      <Marker
        className="marker"
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
        icon={othersDrag}
      >
        <Popup minWidth={90} closeButton={false}>
          <span className="popup" onClick={() => toggleDraggable()}>
            Click to Confirm Location 🤔
          </span>
        </Popup>
      </Marker>
    ) : null;
  };

  const [locationSearch, setLocationSearch] = useState("");
  const provider = useMemo(() => new OpenStreetMapProvider(), []);

  const handleLocationSearch = useCallback(async () => {
    if (locationSearch.trim() === "") return;

    try {
      const results = await provider.search({ query: locationSearch });
      if (results.length > 0) {
        const { x, y } = results[0];
        setFocusLocation([y, x]);
      }
    } catch (error) {
      console.error("Error searching for location:", error);
    }
  }, [locationSearch, provider, setFocusLocation]);

  return (
    <div>
      <MapContainer
        className="map-container"
        center={centerPosition}
        zoom={17}
        minZoom={8}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={mapUrl}
        />
        {!isEdit && (
          <MapFocusLocation location={focusLocation} search={search} />
        )}
        {!isEdit}
        {!isEdit && allMarkers}

        {isEdit && <NewItemMarker />}
        {showDonut && focusLocation && (
          <>
            <Circle
              center={focusLocation}
              radius={20}
              color="red"
              weight={3}
              fillColor="yellow"
            />
          </>
        )}
        <MapControls
          locationSearch={locationSearch}
          setLocationSearch={setLocationSearch}
          handleLocationSearch={handleLocationSearch}
          focusLocation={focusLocation}
          setFocusLocation={setFocusLocation}
        />
      </MapContainer>

      {isOpen && (
        <InfoModal
          props={itemData}
          onOpen={onOpen}
          onClose={onClose}
          isOpen={isOpen}
          setData={setData}
          setLeaderboard={setLeaderboard}
        />
      )}
    </div>
  );
}

function MapControls({ locationSearch, setLocationSearch, handleLocationSearch, focusLocation, setFocusLocation }) {
  const map = useMap();
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "white");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (focusLocation) {
      map.flyTo(focusLocation, 18);
    }
  }, [focusLocation, map]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useMapEvents({
    click: () => {
      setShowSuggestions(false);
    },
  });

  const fetchSuggestions = async (value) => {
    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}&limit=5`
        );
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Debounce the fetchSuggestions function
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocationSearch(value);
    debouncedFetchSuggestions(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = async () => {
    setIsLoading(true);
    setShowSuggestions(false);
    try {
      await handleLocationSearch();
    } catch (error) {
      console.error("Error searching for location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocationSearch(suggestion.display_name);
    setShowSuggestions(false);
    setFocusLocation([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
  };

  return (
    <Box
      position="absolute"
      bottom={4}
      left={4}
      zIndex={1000}
      ref={suggestionsRef}
      width="250px"
    >
      {showSuggestions && suggestions.length > 0 && (
        <VStack
          mb={2}
          align="stretch"
          spacing={1}
          bg={bg}
          borderRadius="md"
          boxShadow="lg"
          maxHeight="200px"
          overflowY="auto"
        >
          {suggestions.map((suggestion) => (
            <Box
              key={suggestion.place_id}
              p={2}
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
              cursor="pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Text fontSize="sm" isTruncated>{suggestion.display_name}</Text>
            </Box>
          ))}
        </VStack>
      )}
      <Box
        bg={bg}
        color={color}
        p={2}
        borderRadius="full"
        boxShadow="lg"
        display="flex"
        alignItems="center"
      >
        <Input
          value={locationSearch}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search location"
          size="sm"
          variant="unstyled"
          pl={3}
          pr={1}
          _placeholder={{ color: placeholderColor }}
          width="calc(100% - 40px)"
        />
        {isLoading ? (
          <Spinner size="sm" color="blue.500" mr={2} />
        ) : (
          <IconButton
            icon={<SearchIcon />}
            onClick={performSearch}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            borderRadius="full"
            aria-label="Search location"
            minWidth="40px"
          />
        )}
      </Box>
    </Box>
  );
}