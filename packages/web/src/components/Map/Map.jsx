import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Map.css";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Fuse from "fuse.js";

import { othersDragBlack, othersDragWhite, flyImg, iconsMap } from "./MapIcons";
import { useColorMode, useDisclosure, Button } from "@chakra-ui/react";
import InfoModal from "../InfoModal/InfoModal";
import DataContext from "../../context/DataContext";
import { UserAuth } from "../../context/AuthContext";
import axios from "axios";
import imageCompression from "browser-image-compression";
import others_black from "../../assets/logos/others_black.svg";
import others_white from "../../assets/logos/others_white.svg";

import { filterItem } from "../../utils/Utils.js";
import CreateMarkerConfirmModal from "../CreateMarkerConfirmModal/CreateMarkerConfirmModal";

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
  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onClose: onConfirmModalClose,
  } = useDisclosure();
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowDonut(false);
  };

  const fuseOptions = {
    keys: ["name", "description"],
    threshold: 0.3,
    includeScore: true,
  };

  const fuse = new Fuse(data, fuseOptions);
  // const results = fuse.search(search).map((result) => result.item);

  const filterItemCallback = useCallback(
    (item) => filterItem(item, findFilter, user),
    [findFilter, user]
  );

  // Initialize map
  useEffect(() => {
    if (map.current) {
      // Just update the style if map already exists
      map.current.setStyle(
        colorMode === "dark"
          ? "mapbox://styles/mapbox/navigation-night-v1"
          : "mapbox://styles/mapbox/standard",
        { preserve: true } // This preserves the camera position
      );
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        colorMode === "dark"
          ? "mapbox://styles/mapbox/navigation-night-v1"
          : "mapbox://styles/mapbox/standard",
      center: [centerPosition[1], centerPosition[0]], // Mapbox uses [lng, lat]
      zoom: 17,
      pitch: 35,
      bearing: -17.6,
      antialias: true,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Set bounds
    const bounds = [
      [-117.875143, 33.625038], // Southwest coordinates
      [-117.808742, 33.668298], // Northeast coordinates
    ];
    map.current.setMaxBounds(bounds);

    // Wait for map to load before adding sources and layers
    map.current.on("load", () => {
      // Add 3D buildings in dark mode
      if (colorMode === "dark") {
        map.current.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#2D3748",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.6,
          },
        });
      }

      // Initialize markers if we have data
      if (data && data.length > 0) {
        initializeMarkers();
      }
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [colorMode, data]); // Add data as a dependency

  // Function to initialize markers and clustering
  const initializeMarkers = useCallback(() => {
    if (!map.current || !data) return;

    // Remove existing layers and sources
    ["clusters", "cluster-count", "unclustered-point"].forEach((layerId) => {
      if (map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
    });
    if (map.current.getSource("markers")) {
      map.current.removeSource("markers");
    }

    // Only add marker layers if not in edit mode
    if (isEdit) return;

    const filteredData = search
      ? fuse.search(search).map((result) => result.item)
      : data;

    // Create a GeoJSON source for clustering
    const geojson = {
      type: "FeatureCollection",
      features: filteredData
        .filter((item) => filterItem(item, findFilter, user))
        .map((item) => ({
          type: "Feature",
          properties: {
            id: item.id,
            name: item.name,
            description: item.description,
            type: item.type,
            islost: item.islost,
            isresolved: item.isresolved,
            icon: `${item.type}-${item.islost}`,
          },
          geometry: {
            type: "Point",
            coordinates: [item.location[1], item.location[0]],
          },
        })),
    };

    // Load custom icons before adding layers
    const loadIcons = async () => {
      const promises = Object.entries(iconsMap)
        .map(([type, status]) =>
          Object.entries(status).map(([isLost, icon]) => {
            const iconId = `${type}-${isLost}`;
            if (!map.current.hasImage(iconId)) {
              return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                  if (!map.current.hasImage(iconId)) {
                    map.current.addImage(iconId, img);
                  }
                  resolve();
                };
                img.onerror = (error) => {
                  reject(
                    new Error(`Failed to load image: ${icon.options.iconUrl}`)
                  );
                };
                img.src = icon.options.iconUrl;
              });
            }
            return Promise.resolve();
          })
        )
        .flat();

      // Load resolved icon
      if (!map.current.hasImage("resolved")) {
        promises.push(
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              if (!map.current.hasImage("resolved")) {
                map.current.addImage("resolved", img);
              }
              resolve();
            };
            img.onerror = (error) => {
              reject(new Error(`Failed to load resolved icon`));
            };
            img.src = iconsMap.resolved.true.options.iconUrl;
          })
        );
      }

      try {
        await Promise.all(promises);
      } catch (error) {
        console.error("Error loading icons:", error);
      }
    };

    // Add sources and layers after icons are loaded
    loadIcons()
      .then(() => {
        // Add clustering source
        map.current.addSource("markers", {
          type: "geojson",
          data: geojson,
          cluster: true,
          clusterMaxZoom: 40,
          clusterRadius: 50,
        });

        // Add cluster circles
        map.current.addLayer({
          id: "clusters",
          type: "circle",
          source: "markers",
          filter: ["has", "point_count"],
          paint: {
            "circle-color":
              colorMode === "dark"
                ? "rgba(45, 55, 72, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20, // radius for small clusters
              5, // threshold for medium clusters
              30, // radius for medium clusters
              20, // threshold for large clusters
              40, // radius for large clusters
            ],
            "circle-stroke-width": 3,
            "circle-stroke-color": [
              "step",
              ["get", "point_count"],
              colorMode === "dark" ? "#63B3ED" : "#3182CE", // Blue for small clusters (1-4)
              5,
              colorMode === "dark" ? "#68D391" : "#38A169", // Green for medium clusters (5-19)
              20,
              colorMode === "dark" ? "#FC8181" : "#E53E3E", // Red for large clusters (20+)
            ],
          },
        });

        // Add cluster count labels
        map.current.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "markers",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 14,
          },
          paint: {
            "text-color": [
              "step",
              ["get", "point_count"],
              colorMode === "dark" ? "#63B3ED" : "#3182CE", // Blue for small clusters (1-4)
              5,
              colorMode === "dark" ? "#68D391" : "#38A169", // Green for medium clusters (5-19)
              20,
              colorMode === "dark" ? "#FC8181" : "#E53E3E", // Red for large clusters (20+)
            ],
          },
        });

        // Add individual point markers
        map.current.addLayer({
          id: "unclustered-point",
          type: "symbol",
          source: "markers",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": ["get", "icon"],
            "icon-size": 0.5,
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "icon-pitch-alignment": "viewport",
            "icon-rotation-alignment": "viewport",
          },
        });

        // Add click handlers
        map.current.on("click", "clusters", (e) => {
          const features = map.current.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          const clusterId = features[0].properties.cluster_id;
          map.current
            .getSource("markers")
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;
              map.current.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
              });
            });
        });

        map.current.on("click", "unclustered-point", (e) => {
          const properties = e.features[0].properties;
          const item = filteredData.find((item) => item.id === properties.id);
          if (item) {
            onOpen();
            setItemData(item);
            setFocusLocation(item.location);
          }
        });

        // Change cursor on hover
        map.current.on("mouseenter", "clusters", () => {
          map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "clusters", () => {
          map.current.getCanvas().style.cursor = "";
        });
        map.current.on("mouseenter", "unclustered-point", () => {
          map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "unclustered-point", () => {
          map.current.getCanvas().style.cursor = "";
        });
      })
      .catch((error) => console.error("Error loading icons:", error));
  }, [
    data,
    search,
    findFilter,
    user,
    colorMode,
    onOpen,
    setItemData,
    setFocusLocation,
    isEdit,
  ]);

  // Clean up marker layers when entering edit mode, re-add when leaving
  useEffect(() => {
    if (!map.current) return;
    if (isEdit) {
      ["clusters", "cluster-count", "unclustered-point"].forEach((layerId) => {
        if (map.current.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
      });
      if (map.current.getSource("markers")) {
        map.current.removeSource("markers");
      }
    } else {
      initializeMarkers();
    }
  }, [isEdit, initializeMarkers]);

  // Handle markers updates
  useEffect(() => {
    if (!map.current || !data) return;

    // Always wait for style to load before initializing markers
    map.current.once("style.load", () => {
      initializeMarkers();
    });
  }, [data, search, findFilter, user, colorMode, initializeMarkers]);

  useEffect(() => {
    if (isEdit && map.current && centerPosition) {
      map.current.flyTo({
        center: [centerPosition[1], centerPosition[0]], // [lng, lat]
        zoom: 17,
        essential: true,
      });
    }
  }, [isEdit]);

  // Update map style when color mode changes
  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(
      colorMode === "dark"
        ? "mapbox://styles/mapbox/navigation-night-v1"
        : "mapbox://styles/mapbox/standard"
    );
  }, [colorMode]);

  // Handle focus location changes
  useEffect(() => {
    if (!focusLocation || !map.current) return;

    const handleFocus = async () => {
      try {
        const currentCenter = map.current.getCenter();

        // Remove existing highlight layers if any
        if (map.current.getLayer("highlight-circle")) {
          map.current.removeLayer("highlight-circle");
        }
        if (map.current.getSource("highlight-point")) {
          map.current.removeSource("highlight-point");
        }

        // Add highlight point source
        map.current.addSource("highlight-point", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [focusLocation[1], focusLocation[0]],
            },
          },
        });

        // Add highlight circle layer
        map.current.addLayer({
          id: "highlight-circle",
          type: "circle",
          source: "highlight-point",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              20,
              22,
              40,
            ],
            "circle-color": colorMode === "dark" ? "#3182CE" : "#2B6CB0",
            "circle-opacity": 0.3,
            "circle-stroke-width": 3,
            "circle-stroke-color": colorMode === "dark" ? "#63B3ED" : "#4299E1",
            "circle-stroke-opacity": 0.8,
          },
        });

        // Animate the highlight
        let start;
        function animate(timestamp) {
          if (!start) start = timestamp;
          const progress = (timestamp - start) / 1500; // 1.5 second animation

          if (map.current.getLayer("highlight-circle")) {
            map.current.setPaintProperty(
              "highlight-circle",
              "circle-opacity",
              0.3 * Math.abs(Math.sin(progress * Math.PI))
            );
            map.current.setPaintProperty(
              "highlight-circle",
              "circle-stroke-opacity",
              0.8 * Math.abs(Math.sin(progress * Math.PI))
            );
          }

          if (progress < 4) {
            // Run animation for 4 cycles
            requestAnimationFrame(animate);
          }
        }

        // Start the animation
        requestAnimationFrame(animate);

        // Fly to location
        map.current.flyTo({
          center: [focusLocation[1], focusLocation[0]],
          zoom: 19,
          duration: 2000,
          essential: true,
        });

        await handleMarkerSelect();

        // Clean up highlight after delay
        setTimeout(() => {
          if (map.current.getLayer("highlight-circle")) {
            map.current.removeLayer("highlight-circle");
          }
          if (map.current.getSource("highlight-point")) {
            map.current.removeSource("highlight-point");
          }
          setFocusLocation(undefined);
        }, 2000);
      } catch (error) {
        console.error("Error flying to location:", error);
      }
    };

    if (map.current.loaded()) {
      handleFocus();
    } else {
      map.current.once("load", handleFocus);
    }
  }, [focusLocation, colorMode]);

  // Handle edit mode marker
  useEffect(() => {
    if (!map.current || !isEdit) return;

    if (!marker.current) {
      // Ensure we have valid coordinates
      const validPosition = {
        lat: position.lat || centerPosition[0],
        lng: position.lng || centerPosition[1],
      };

      const el = document.createElement("div");
      el.className = "edit-marker";

      const img = document.createElement("img");
      img.src = colorMode === "dark" ? others_white : others_black;
      img.style.width = "100%";
      img.style.height = "100%";
      el.appendChild(img);

      el.style.width = "40px";
      el.style.height = "53px";
      el.style.cursor = "move";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";

      marker.current = new mapboxgl.Marker({
        element: el,
        draggable: true,
      })
        .setLngLat([validPosition.lng, validPosition.lat])
        .addTo(map.current);

      marker.current.on("dragend", () => {
        const lngLat = marker.current.getLngLat();
        setPosition({ lat: lngLat.lat, lng: lngLat.lng });
      });
    }

    // Handler to move marker on map click
    const handleMapClick = (e) => {
      if (marker.current) {
        marker.current.setLngLat(e.lngLat);
        setPosition({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      }
    };

    map.current.on("click", handleMapClick);

    return () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (map.current) {
        map.current.off("click", handleMapClick);
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

  // Add this button component
  const ConfirmButton = () => (
    <Button
      position="absolute"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      colorScheme="blue"
      size="lg"
      onClick={onConfirmModalOpen}
      zIndex={1000}
      boxShadow="lg"
      _hover={{
        transform: "translateX(-50%) scale(1.05)",
      }}
      transition="all 0.2s"
    >
      Confirm Location
    </Button>
  );

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      {isEdit && <ConfirmButton />}
      <CreateMarkerConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={onConfirmModalClose}
        onConfirm={() => {
          onConfirmModalClose();
          toggleDraggable();
        }}
        position={position}
      />
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
