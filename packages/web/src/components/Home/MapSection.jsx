import React from "react";
import { Flex, Box, useColorMode } from "@chakra-ui/react";
import Map from "../Map/Map";
import ListItemButton from "./ListItemButton";
import FeedbackButtonMobile from "./NavBar/FeedbackButtonMobile";
import ResultsBar from "../ResultsBar/ResultsBar";
import CreateModal from "../CreateModal/CreateModal";

const MapSection = ({
  isOpenCreateModal,
  onOpenCreateModal,
  onCloseCreateModal,
  isEdit,
  handleListItemButtonClick,
  handleCancelItemButtonClick,
  newAddedItem,
  setNewAddedItem,
  user,
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
  uploadImg,
  upload,
  setLeaderboard,
}) => {
  const { colorMode } = useColorMode();
  return (
    <>
      <Flex
        position="absolute"
        background={colorMode === "dark" ? "#1A1E22" : ""}
      >
        <ListItemButton
          switchState={!isEdit}
          addCallback={handleListItemButtonClick}
          cancelCallback={handleCancelItemButtonClick}
          position="absolute"
          right={10}
          bottom={10}
        />
        <Flex
          zIndex={1000}
          variant="solid"
          position="absolute"
          left={10}
          bottom={10}
        />
        <FeedbackButtonMobile />

        <Map
          newAddedItem={newAddedItem}
          setNewAddedItem={setNewAddedItem}
          isEdit={isEdit}
          email={user?.email}
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

      <Flex
        position="absolute"
        top={0}
        right={5}
        display={{ base: "none", md: "flex" }}
        background={colorMode === "dark" ? "#1A1E22" : ""}
      >
        <ResultsBar
          search={search}
          findFilter={findFilter}
          setFocusLocation={setFocusLocation}
          setLeaderboard={setLeaderboard}
        />
      </Flex>

      <Box
        display={{ base: "block", md: "none" }}
        position="fixed"
        bottom="2.5%"
        width="100vw"
      >
        <CreateModal
          isOpen={isOpenCreateModal}
          onOpen={onOpenCreateModal}
          onClose={onCloseCreateModal}
          setIsCreate={setIsCreate}
          isCreate={isCreate}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setPosition={setPosition}
          centerPosition={centerPosition}
          newAddedItem={newAddedItem}
          setNewAddedItem={setNewAddedItem}
          setUploadImg={setUploadImg}
          uploadImg={uploadImg}
          upload={upload}
        />
      </Box>
    </>
  );
};

export default MapSection;
