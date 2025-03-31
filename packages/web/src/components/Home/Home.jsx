import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./Home.css";
import { useLocation } from "react-router-dom";

import { getAuthToken } from "../../utils/Utils";

import {
  Spinner,
  useColorMode,
  useToast,
  Flex,
  useDisclosure,
  Box,
} from "@chakra-ui/react";

import upload from "../../assets/images/download.png";

import LoginModal from "../LoginModal/LoginModal";
import BookmarkModal from "./BookmarkModal";
import Leaderboard from "./NavBar/Leaderboard";
import MobileSearchBar from "./SearchBar/MobileSearchBar";
import Navbar from "./NavBar/Navbar";
import ToolBar from "./ToolBar/ToolBar";
import MapSection from "./MapSection";
import { UserAuth } from "../../context/AuthContext";
import DataContext from "../../context/DataContext";
import Tutorial from "../Tutorial/Tutorial";

export default function Home() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const { user, logOut } = UserAuth();
  const [token, setToken] = useState("");

  const btnRef = useRef();
  const toast = useToast();
  const { colorMode } = useColorMode();

  // BOOKMARK MODAL
  const {
    isOpen: isBookmarkModalOpen,
    onOpen: onBookmarkModalOpen,
    onClose: onBookmarkModalClose,
  } = useDisclosure();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // CREATE MODAL
  // hoisted state
  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
  } = useDisclosure();

  const {
    isOpen: isResultsBarOpen,
    onOpen: onResultsBarOpen,
    onClose: onResultsBarClose,
  } = useDisclosure();

  const {
    isOpen: isLeaderboardOpen,
    onOpen: onLeaderboardOpen,
    onClose: onLeaderboardClose,
  } = useDisclosure();

  const [findFilter, setFindFilter] = useState({
    type: "everything",
    isFound: true,
    islost: true,
    uploadDate: "",
    isYourPosts: false,
    isShowReturned: true,
  });

  function isFilterOff() {
    return (
      findFilter.type === "everything" &&
      findFilter.isFound === true &&
      findFilter.islost === true &&
      findFilter.uploadDate === "" &&
      search === "" &&
      !findFilter.isYourPosts &&
      findFilter.isShowReturned === true
    );
  }

  const [loading, setLoading] = useState(false);

  const [newAddedItem, setNewAddedItem] = useState({
    image: "",
    type: "",
    islost: true,
    name: "",
    description: "",
    itemdate: "",
    isresolved: false,
    ishelped: null,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const centerPosition = [33.6461, -117.8427];
  const [position, setPosition] = useState(centerPosition);
  const [focusLocation, setFocusLocation] = useState();
  const [uploadImg, setUploadImg] = useState("");
  // LOGIN MODAL
  const {
    isOpen: isLoginModalOpen,
    onOpen: onLoginModalOpen,
    onClose: onLoginModalClose,
  } = useDisclosure();

  const [showTutorial, setShowTutorial] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("keywords")) {
      onBookmarkModalOpen();
    }
  }, [location.pathname]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const compareDates = (a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  };

  // Define the callback function to handle a 'List an item' button click
  const handleListItemButtonClick = () => {
    if (user) {
      onOpenCreateModal();
      setNewAddedItem((prev) => ({ ...prev, islost: true }));
      setIsEdit(!isEdit);
    } else {
      onLoginModalOpen();
    }
  };

  const handleCancelItemButtonClick = () => {
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
    setUploadImg("");
    setIsCreate(true);
    setIsEdit(false);
    onClose();
  };

  // Sort the array by date
  data.sort(compareDates);

  //get data
  useEffect(() => {
    const getData = async () => {
      try {
        // const token = await getAuthToken();
        // if (!token) return;
        const config = {
          headers: {
            // Authorization: `Bearer ${token}`,
            "User-Email": user?.email,
          },
        };

        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/`,
          config
        );
        setData(response.data.map((item) => ({ ...item, id: item.id })));
      } catch (err) {
        console.error(
          "API Error:",
          err.response?.status,
          err.response?.data,
          err
        );
      }
      setLoading(true);
    };
    getData();
  }, [user]);

  //LEADERBOARD GET INFO
  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const token = await getAuthToken();
        if (!token) return;
        const config = {
          headers: {
            // Authorization: `Bearer ${token}`,
            "User-Email": user?.email,
          },
        };
        // Get email associated with item id

        const { data: leaderboardData } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/leaderboard/`,
          config
        );

        setLeaderboard(
          leaderboardData.map((item) => ({ ...item, id: item.id }))
        );

        // Check if the current user's email exists in the leaderboard
        const userEmailExists = leaderboardData.some(
          (entry) => entry.email === user?.email
        );
        // If it does not exist, add the user to the leaderboard
        if (!userEmailExists && user) {
          // added user to prevent race condition (user is undefined before auth resolves)
          await axios.post(
            `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/leaderboard/`,
            {
              email: user.email,
              points: 5, // You can modify this as per your requirements
            },
            config
          );
          // Fetch the leaderboard again after insertion
          const { data: updatedLeaderboardData } = await axios.get(
            `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/leaderboard`,
            config
          );
          setLeaderboard(
            updatedLeaderboardData.map((item) => ({ ...item, id: item.id }))
          );
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(true);
      }
    };

    if (user) {
      getLeaderboard();
    }
  }, [user, token]);

  // set token to auth
  useEffect(() => {
    if (user) {
      setToken(user.accessToken);
    }
  }, [user]);

  useEffect(() => {
    // Check if this is the user's first visit
    const tutorialComplete = localStorage.getItem("tutorialComplete");
    if (!tutorialComplete) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialOpen = () => {
    setShowTutorial(true);
  };

  return (
    <DataContext.Provider
      value={{
        data: data,
        setData: setData,
        token: token,
        setLoading: setLoading,
        isLoginModalOpen: isLoginModalOpen,
        onLoginModalClose: onLoginModalClose,
        onLoginModalOpen: onLoginModalOpen,
      }}
    >
      <Box
        w={"100vw"}
        h={"100dvh"}
        background={colorMode === "dark" ? "#1A1E22" : ""}
      >
        <Navbar
          search={search}
          setSearch={setSearch}
          loading={loading}
          user={user}
          onBookmarkModalOpen={onBookmarkModalOpen}
          leaderboard={leaderboard}
          handleLogout={handleLogout}
          setFindFilter={setFindFilter}
          onOpen={onOpen}
          onLoginModalOpen={onLoginModalOpen}
          onLeaderboardOpen={onLeaderboardOpen}
          onTutorialOpen={handleTutorialOpen}
        />

        <MobileSearchBar
          search={search}
          setSearch={setSearch}
          loading={loading}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Flex
            position="relative"
            marginTop={{ base: "1vh", md: "2%" }}
            px={{ base: 0, md: "2%" }}
          >
            <ToolBar
              isEdit={isEdit}
              isOpenCreateModal={isOpenCreateModal}
              onOpen={onOpen}
              setFindFilter={setFindFilter}
              findFilter={findFilter}
              isOpen={isOpen}
              onClose={onClose}
              isResultsBarOpen={isResultsBarOpen}
              onResultsBarOpen={onResultsBarOpen}
              onResultsBarClose={onResultsBarClose}
              search={search}
              setSearch={setSearch}
              loading={loading}
              isFilterOff={isFilterOff}
              setFocusLocation={setFocusLocation}
              setLeaderboard={setLeaderboard}
            />

            <MapSection
              isOpenCreateModal={isOpenCreateModal}
              onOpenCreateModal={onOpenCreateModal}
              onCloseCreateModal={onCloseCreateModal}
              isEdit={isEdit}
              handleListItemButtonClick={handleListItemButtonClick}
              handleCancelItemButtonClick={handleCancelItemButtonClick}
              newAddedItem={newAddedItem}
              setNewAddedItem={setNewAddedItem}
              user={user}
              setIsEdit={setIsEdit}
              search={search}
              findFilter={findFilter}
              setIsCreate={setIsCreate}
              isCreate={isCreate}
              centerPosition={centerPosition}
              position={position}
              setPosition={setPosition}
              focusLocation={focusLocation}
              setFocusLocation={setFocusLocation}
              setUploadImg={setUploadImg}
              uploadImg={uploadImg}
              upload={upload}
              setLeaderboard={setLeaderboard}
            />
          </Flex>
        </motion.div>
        {!loading && (
          <Flex
            width="100%"
            height="83vh"
            bg="gray"
            opacity="0.8"
            justifyContent="center"
            alignItems="center"
            zIndex={1000000000}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="yellow"
              color="blue"
              size="xl"
            />
          </Flex>
        )}
        <LoginModal />
        <BookmarkModal
          isOpen={isBookmarkModalOpen}
          onClose={onBookmarkModalClose}
          setSearch={setSearch}
          colorMode={colorMode}
        />
        <Leaderboard
          onOpen={onLeaderboardOpen}
          isOpen={isLeaderboardOpen}
          onClose={onLeaderboardClose}
          btnRef={btnRef}
          leaderboard={leaderboard}
          user={user}
        />
        <Tutorial
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
        />
      </Box>
    </DataContext.Provider>
  );
}
