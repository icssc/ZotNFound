import React from "react";
import {
  Button,
  Flex,
  Image,
  Text,
  useColorMode,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import {
  MoonIcon,
  SunIcon,
  QuestionIcon,
  QuestionOutlineIcon,
} from "@chakra-ui/icons";
import { motion } from "framer-motion";
import ZotNFoundLogoText from "./ZotNFoundLogoText";
import SearchBar from "../SearchBar/SearchBar";
import ProfilePicDropdown from "./ProfilePicDropdown";
import bookmarkWhite from "../../../assets/logos/bookmark-white.svg";
import cookie from "../../../assets/images/cookie.svg";
import { MdAssignment } from "react-icons/md";

const Navbar = ({
  search,
  setSearch,
  loading,
  user,
  onBookmarkModalOpen,
  leaderboard,
  handleLogout,
  setFindFilter,
  onOpen,
  onLoginModalOpen,
  onLeaderboardOpen,
  onTutorialOpen,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      shadow="md"
      alignItems="center"
      background={colorMode === "dark" ? "#2F363C" : ""}
      p={4}
    >
      <div
        className="nav-content"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LOGO + TEXT */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ZotNFoundLogoText />
        </motion.div>

        {/* SEARCH BAR */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          loading={loading}
          colorMode={colorMode}
        />

        <Flex alignItems="center" gap={4}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              gap={{ base: 3, md: 5 }}
            >
              {/* COLOR MODE */}
              <Button onClick={toggleColorMode} aria-label="Toggle Color Mode">
                {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
              </Button>

              {/* Bookmark Icon */}
              {user && <Button
                bg="green.500"
                onClick={onBookmarkModalOpen}
                aria-label="Bookmarks"
              >
                <Image
                  src={colorMode === "light" ? bookmarkWhite : bookmarkWhite}
                  h="15px"
                  w="15px"
                  alt="bookmark"
                />
              </Button>}

              {/* FEEDBACK */}
              <Button
                display={{ base: "none", md: "block" }}
                leftIcon={<MdAssignment />}
                colorScheme="blue"
                onClick={() => {
                  window.open("https://forms.gle/Uud594N7QE6VbiDY6", "_blank");
                }}
              >
                Feedback
              </Button>

              {/* USER SECTION */}
              {user ? (
                <>
                  {/* Points Display */}
                  <Flex
                    className="points-display"
                    alignItems="center"
                    aria-label="Leaderboard"
                    gap={{ base: 1, md: 1.5 }}
                    justifyContent="center"
                    background="#74a2fa"
                    padding={{ base: "5px", md: 1.5 }}
                    borderRadius="xl"
                    _hover={{ background: "#365fad" }}
                    _active={{ background: "#365fad" }}
                    cursor="pointer"
                    onClick={onLeaderboardOpen}
                  >
                    <Image
                      src={cookie}
                      h={{ base: "15px", md: "20px" }}
                      w={{ base: "15px", md: "25px" }}
                      alt="cookie"
                    />
                    <Text
                      as="b"
                      fontSize={{ base: "sm", md: "lg" }}
                      color="white"
                    >
                      {leaderboard.find((u) => u.email === user.email)
                        ?.points ?? 0}
                    </Text>
                  </Flex>

                  <ProfilePicDropdown
                    user={user}
                    handleLogout={handleLogout}
                    setFindFilter={setFindFilter}
                    onOpen={onOpen}
                    colorMode={colorMode}
                  />
                </>
              ) : (
                <Button
                  h={{ base: "6vh", md: "7vh" }}
                  w={{ base: "30vw", md: "8vw" }}
                  borderRadius={20}
                  fontSize="xl"
                  variant="outline"
                  colorScheme="black"
                  onClick={onLoginModalOpen}
                >
                  Sign in
                </Button>
              )}
            </Flex>
          </motion.div>

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<QuestionOutlineIcon />}
              variant="outline"
              ml={2}
              display={{ base: "none", md: "block" }}
            />
            <MenuList>
              <MenuItem icon={<QuestionIcon />} onClick={onTutorialOpen}>
                Show Tutorial
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </div>
    </Flex>
  );
};

export default Navbar;
