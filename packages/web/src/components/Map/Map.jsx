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
import {
  useDisclosure,
  useColorMode,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import InfoModal from "../InfoModal/InfoModal";

import DataContext from "../../context/DataContext";
import { UserAuth } from "../../context/AuthContext";

import axios from "axios";

import { filterItem } from "../../utils/Utils.js";
import MarkerClusterGroup from "react-leaflet-cluster";
import geoData from "../../data/geo_backup.json";

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
  // State: mapView - current view (items or locations)
  const [mapView, setMapView] = useState("items"); // 'items' or 'locations'

  // Allowed boundaries of markers (currently UCI borders)
  const allowedBounds = [
    [33.656487295651, -117.85412222020983],
    [33.65580858123096, -117.82236486775658],
    [33.63290776411016, -117.85403639000239],
    [33.630120665484185, -117.82240778293699],
  ];
  const bounds = L.latLngBounds(allowedBounds);

  const mapBoundsCoordinates = [
    [33.625038, -117.875143],
    [33.668298, -117.808742],
  ];
  const mapBounds = L.latLngBounds(mapBoundsCoordinates);

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
  const allMarkers = useMemo(() => {
    return markersData.filter(filterItemCallback).map((item) => (
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
    ));
  }, [markersData, filterItemCallback, onOpen, setItemData, setFocusLocation]);
  const geoMarkers = useMemo(() => {
    return geoData
      .filter((location) => location.name.match(/\((\w+)\)/))
      .map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={L.divIcon({
            className: "custom-div-icon",
            html: `<div style="
            background-color: ${colorMode === "dark" ? "#2D3748" : "#3182CE"};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
          ">📍</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24],
          })}
        >
          <Popup>
            <span>{location.name}</span>
          </Popup>
        </Marker>
      ));
  }, [colorMode, geoData]);

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

  // Add a toggle button component
  const ViewToggle = () => {
    return (
      <ButtonGroup
        size="sm"
        isAttached
        variant="outline"
        position="absolute"
        top={4}
        right={4}
        zIndex={1000}
        bg={colorMode === "dark" ? "gray.800" : "white"}
        borderRadius="md"
        boxShadow="base"
      >
        <Button
          onClick={() => setMapView("items")}
          colorScheme={mapView === "items" ? "blue" : "gray"}
        >
          Lost & Found
        </Button>
        <Button
          onClick={() => setMapView("locations")}
          colorScheme={mapView === "locations" ? "blue" : "gray"}
        >
          UCI Locations
        </Button>
      </ButtonGroup>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <ViewToggle />
      <MapContainer
        className="map-container"
        center={centerPosition}
        zoom={17}
        minZoom={15}
        zoomControl={false}
        attributionControl={false}
        maxBounds={mapBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={mapUrl}
        />
        {!isEdit && (
          <MapFocusLocation location={focusLocation} search={search} />
        )}
        {!isEdit && mapView === "items" && (
          <MarkerClusterGroup chunkedLoading>{allMarkers}</MarkerClusterGroup>
        )}
        {!isEdit && mapView === "locations" && geoMarkers}

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
        <SetBoundsRectangles />
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
