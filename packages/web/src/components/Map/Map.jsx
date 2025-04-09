import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import { useMapEvents } from "react-leaflet/hooks";
// import mapuser from "../../assets/logos/mapuser.svg";
import "./Map.css";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Fuse from "fuse.js";

import { othersDragBlack, othersDragWhite, flyImg, iconsMap } from "./MapIcons";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useColorMode, useDisclosure } from "@chakra-ui/react";
import InfoModal from "../InfoModal/InfoModal";

import DataContext from "../../context/DataContext";
import { UserAuth } from "../../context/AuthContext";

import axios from "axios";
import imageCompression from "browser-image-compression";

import { filterItem } from "../../utils/Utils.js";
import MarkerClusterGroup from "react-leaflet-cluster";
import { createClusterCustomIcon } from "./MapIcons";

// Set your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_ACCESS_TOKEN;

// Add this function after the imports and before the Map component
const getMarkerIcon = (item) => {
  // Get the icon URL from the iconsMap
  let iconObject;
  if (item.isresolved) {
    iconObject = iconsMap["resolved"][item.islost];
  } else {
    iconObject = (iconsMap[item.type] || iconsMap["others"])[item.islost];
  }

  // Extract the URL from the Leaflet icon object
  return iconObject.options.iconUrl;
};

/**
 * Map is uses react-leaflet's API to communicate user actions to map entities and information
 *
 * @component
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
 * @returns {JSX.Element} Mapbox Map component
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
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const markers = useRef([]);

  const { user } = UserAuth();
  const { colorMode } = useColorMode();
  const { data, setLoading, token, setData } = useContext(DataContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
        key={item.id}
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

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        colorMode === "dark"
          ? "mapbox://styles/mapbox/navigation-night-v1"
          : "mapbox://styles/mapbox/standard",
      center: [centerPosition[1], centerPosition[0]], // Mapbox uses [lng, lat]
      zoom: 17,
      pitch: 45, // Add 3D perspective
      bearing: -17.6,
      antialias: true,
    });

    // Add 3D buildings
    map.current.on("style.load", () => {
      map.current.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": colorMode === "dark" ? "#242424" : "#aaa",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.6,
        },
      });
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Set bounds
    const bounds = [
      [-117.875143, 33.625038], // Southwest coordinates
      [-117.808742, 33.668298], // Northeast coordinates
    ];
    map.current.setMaxBounds(bounds);
  }, [colorMode, centerPosition]);

  // Update map style when color mode changes
  useEffect(() => {
    if (!map.current) return;

    map.current.setStyle(
      colorMode === "dark"
        ? "mapbox://styles/mapbox/navigation-night-v1"
        : "mapbox://styles/mapbox/standard"
    );
  }, [colorMode]);

  // Handle markers
  useEffect(() => {
    if (!map.current || !data) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    const filteredData = search
      ? fuse.search(search).map((result) => result.item)
      : data;

    filteredData
      .filter((item) => filterItem(item, findFilter, user))
      .forEach((item) => {
        const el = document.createElement("div");
        el.className = "marker";
        // Set marker icon based on item type
        el.style.backgroundImage = `url(${getMarkerIcon(item)})`;
        el.style.width = "50px";
        el.style.height = "50px";
        el.style.backgroundSize = "cover";

        const marker = new mapboxgl.Marker(el)
          .setLngLat([item.location[1], item.location[0]])
          .addTo(map.current);

        marker.getElement().addEventListener("click", () => {
          onOpen();
          setItemData(item);
          setFocusLocation(item.location);
        });

        markers.current.push(marker);
      });
  }, [data, search, findFilter, user]);

  // Handle edit mode marker
  useEffect(() => {
    if (!map.current || !isEdit) return;

    if (!marker.current) {
      // Ensure we have valid coordinates
      const validPosition = {
        lng: position.lng || centerPosition[1], // fallback to center longitude
        lat: position.lat || centerPosition[0], // fallback to center latitude
      };

      const el = document.createElement("div");
      el.className = "edit-marker";
      el.style.backgroundImage = `url(${
        colorMode === "dark"
          ? othersDragWhite.options.iconUrl
          : othersDragBlack.options.iconUrl
      })`;
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.backgroundSize = "cover";
      el.style.cursor = "move";

      marker.current = new mapboxgl.Marker({
        element: el,
        draggable: true,
      })
        .setLngLat([validPosition.lng, validPosition.lat])
        .addTo(map.current);

      // Add popup
      const popup = new mapboxgl.Popup({
        closeButton: false,
        offset: 25,
      }).setHTML('<span class="popup">Click to Confirm Location 🤔</span>');

      marker.current.setPopup(popup);

      marker.current.on("dragend", () => {
        const lngLat = marker.current.getLngLat();
        setPosition({ lat: lngLat.lat, lng: lngLat.lng });
      });

      // Add click handler for the popup
      el.addEventListener("click", () => {
        if (!marker.current) return;
        const lngLat = marker.current.getLngLat();
        setPosition({ lat: lngLat.lat, lng: lngLat.lng });
        toggleDraggable();
      });
    }

    return () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
    };
  }, [isEdit, position, colorMode]);

  async function handleSubmit() {
    const date = new Date();
    if (!token) {
      return;
    }
    let imageUrl = "";

    if (newAddedItem.image) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg",
        initialQuality: 0.8,
        preserveExif: false, // optional, use preserve Exif metadata for JPEG image e.g., Camera model, Focal length, etc (default: false)
      };
      try {
        const compressedFile = await imageCompression(
          newAddedItem.image,
          options
        );
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/upload/image`,
          compressedFile,
          {
            headers: {
              "Content-Type": "image/jpeg",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to upload file");
        }
        imageUrl = response.data.url;
      } catch (err) {
        // if url failed than image upload failed
        console.error("Error uploading image:", err);
        return;
      }
    }

    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items`,
        {
          image: imageUrl,
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
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((item) => {
        const newItem = {
          image: imageUrl,
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
        // Reset state for new item form
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
    if (position.lat == null || position.lng == null) {
      alert(
        "Latitude and longitude cannot be null. Please pick a valid location."
      );
      setPosition({ lat: centerPosition[0], lng: centerPosition[1] }); // Reset position to center
      return;
    }

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
    const map = useMap();
    useEffect(() => {
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }, [map]);

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
        icon={colorMode == "dark" ? othersDragWhite : othersDragBlack}
        ref={markerRef}
      >
        <Popup minWidth={90} closeButton={false} position={position}>
          <span className="popup" onClick={() => toggleDraggable()}>
            Click to Confirm Location 🤔
          </span>
        </Popup>
      </Marker>
    ) : null;
  };

  const createCluster = useMemo(() => {
    // console.log("Current colorMode:", colorMode); // Debug log
    return {
      chunkedLoading: true,
      iconCreateFunction: (cluster) => {
        return createClusterCustomIcon(cluster, colorMode);
      },
    };
  }, [colorMode]); // Make sure colorMode is in dependency array

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
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
