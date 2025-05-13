import React from "react";
import { Flex, Box, useColorMode, Button } from "@chakra-ui/react";
import Map from "../Map/Map";
import ListItemButton from "./ListItemButton";
import FeedbackButtonMobile from "./NavBar/FeedbackButtonMobile";
import ResultsBar from "../ResultsBar/ResultsBar";
import CreateModal from "../CreateModal/CreateModal";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

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

  const handleCancel = () => {
    setIsEdit(false);
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
  };

  return (
    <>
      <Flex
        position="absolute"
        background={colorMode === "dark" ? "#1A1E22" : ""}
      >
        <Button
          className="create-post-wrapper"
          position="absolute"
          bottom={4}
          right={4}
          colorScheme={isEdit ? "red" : "blue"}
          height={75}
          width={75}
          backgroundColor={isEdit ? "#E53E3E" : "#74a2fa"}
          color="white"
          borderRadius="50%"
          padding={0}
          _hover={{
            background: isEdit ? "#C53030" : "#365fad",
          }}
          fontSize="30px"
          onClick={isEdit ? handleCancel : handleListItemButtonClick}
          zIndex={1000}
        >
          {isEdit ? <CloseIcon boxSize={8} /> : <AddIcon boxSize={8} />}
        </Button>
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
