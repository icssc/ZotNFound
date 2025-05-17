import { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Flex,
  Tag,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import upload from "../../assets/images/download.png";

import { formatDate } from "../../utils/DateUtils";
import { UserAuth } from "../../context/AuthContext";
import DataContext from "../../context/DataContext";
import ImageContainer from "../ImageContainer/ImageContainer";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import { LinkIcon, CheckIcon, EmailIcon, EditIcon } from "@chakra-ui/icons";
import { getItemEmail, deleteItem } from "../../utils/ApiUtils";
import DeleteConfirmationPopover from "./DeleteConfirmationPopover";
import EditModal from "../EditModal/EditModal";
// import axios from "axios";

export default function InfoModal({
  setData,
  isEdit,
  setIsEdit,
  isOpen,
  onClose,
  props,
  setLeaderboard,
}) {
  const { colorMode } = useColorMode();
  const [showEmail, setShowEmail] = useState(false);
  const [itemEmail, setItemEmail] = useState("");
  const [isShared, setIsShared] = useState(false);

  const [currentItem, setCurrentItem] = useState(props);
  const { onLoginModalOpen, token, setLoading } = useContext(DataContext);
  const { user } = UserAuth();
  const navigate = useNavigate();
  const feedbackModalDisclosure = useDisclosure();
  const currentEmail = user?.email;

  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();

  const [isCreate, setIsCreate] = useState(true);
  const centerPosition = [33.6461, -117.8427];
  const [position, setPosition] = useState(centerPosition);
  const [focusLocation, setFocusLocation] = useState();
  const [uploadImg, setUploadImg] = useState("");
  const [date, setDate] = useState(new Date());

  async function handleResolve() {
    feedbackModalDisclosure.onOpen();
  }

  async function handleEditItem() {
    onOpenEditModal();
    setLoading(false);
    setUploadImg([props.image]);
    setDate(new Date(props.itemdate));
    setPosition([props.latitude, props.longitude]);
    setIsEdit(true);
    console.log("PROPS: " + JSON.stringify(props, null, 2));
  }

  async function handleDelete() {
    onClose();
    setLoading(false);
    if (!currentEmail) {
      return;
    }
    deleteItem(props, token); // delete item from database
    setData((prevItems) => {
      if (prevItems && prevItems.length > 0) {
        return prevItems.filter((item) => item.id !== props.id);
      }
      return prevItems;
    });
    setLoading(true);
  }

  // Closes the Modal component and navigates back to the home page
  const handleClose = useCallback(() => {
    onClose();
    navigate("/");
  }, [onClose, navigate]);

  // Reveals the email of the user who posted the item
  const handleShowEmail = useCallback(() => {
    if (user) {
      // Retrieves the email of the item poster
      getItemEmail(props, token).then((itemsData) => {
        setItemEmail(itemsData.data.email);
      });
      setShowEmail(true);
    } else {
      onLoginModalOpen();
    }
  }, [user, props, token, onLoginModalOpen]);

  // Copies the url of the item to the clipboard
  const handleShare = useCallback(() => {
    setIsShared(true);
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://zotnfound.com";
    navigator.clipboard.writeText(`${baseUrl}/${props.id}`);
  }, [props.id]);

  // The "Owner" tag for an item - only visible to the user who posted the item
  const ownerTag = (
    <Flex>
      <Tag colorScheme="blue" variant="solid">
        Owner
      </Tag>
    </Flex>
  );

  // The "Lost" tag for an item - visible to all users
  const lostTag = (
    <Flex>
      <Tag colorScheme="red" variant="solid">
        Lost
      </Tag>
    </Flex>
  );

  // The "Found" tag for an item - visible to all users
  const foundTag = (
    <Flex>
      <Tag colorScheme="green" variant="solid">
        Found
      </Tag>
    </Flex>
  );

  // The date that the item was lost - visible to all users
  const lostDateText = <Text color={"gray.500"}>Lost on {props.itemdate}</Text>;

  // The date that the item was found - visible to all users
  const foundDateText = (
    <Text color={"gray.500"}> Found on {props.itemdate}</Text>
  );

  /*
  The "View Contact" button for an item - visible to all users with an @uci.edu email.
  Doesn't reveal the email of the user who posted the item, only indicates that the user can view the email
  */
  const viewContactButton = (
    <Button
      colorScheme="blue"
      size={"lg"}
      gap={2}
      isDisabled={props.isresolved && true}
      onClick={handleShowEmail}>
      <EmailIcon /> View Contact
    </Button>
  );

  //Shows the email of the user who posted the item - visible to all users with an @uci.edu email AND if the user has clicked the "View Contact" button
  const showContactButton = (
    <Button size="lg" variant="outline" colorScheme="blue">
      {itemEmail}
    </Button>
  );

  const formattedDate = formatDate(new Date(props.date));
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: "full", md: "5xl" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            size="lg"
            border={"4px green solid"}
            background={colorMode === "light" ? "white" : "black"}
          />

          <Flex
            justifyContent={{ base: "center", md: "space-around" }}
            alignItems={"center"}
            paddingX={"2%"}
            paddingY={"5%"}
            width={"100%"}
            flexDir={{ base: "column", md: "row" }}
            overflowX={"hidden"}>
            <ImageContainer image={props.image} isresolved={props.isresolved} />
            <Flex
              flexDir={"column"}
              w={{ base: "90%", md: "40%" }}
              gap={5}
              mt={{ md: 0, base: 5 }}>
              {/* HEADING */}
              <Flex flexDir={"column"} gap={2}>
                <Heading
                  // mt="20px"
                  fontSize="4xl"
                  fontFamily={"body"}
                  fontWeight={"bold"}>
                  {props.name}
                </Heading>

                <Flex gap={2}>
                  {currentEmail === props.email
                    ? ownerTag
                    : props.islost
                      ? lostTag
                      : foundTag}
                  <Text color={"gray.500"}>Posted: {formattedDate}</Text>
                </Flex>
              </Flex>

              <hr />

              {/* DESCRIPTION */}
              <Flex flexDir={"column"}>
                <Text as={"b"} fontSize={"xl"}>
                  Description:
                </Text>
                {props.islost ? lostDateText : foundDateText}
                <Text
                  fontSize={"md"}
                  mt={3}
                  overflowY={"auto"}
                  maxHeight={"200"}>
                  {props.description}
                </Text>
              </Flex>
              <hr />

              <Flex
                // Could add an elipses dropdown for the buttons since it's getting kinda stuffed rn
                gap={currentEmail === props.email ? 2 : 5}
                justifyContent={"center"}
                alignItems={"center"}>
                {currentEmail !== props.email &&
                  (!showEmail ? viewContactButton : showContactButton)}
                {currentEmail === props.email && (
                  <>
                    <Button
                      colorScheme="green"
                      size={"lg"}
                      gap={2}
                      onClick={handleResolve}
                      isDisabled={props.isresolved ? true : false}>
                      <CheckIcon />
                      Resolve
                    </Button>
                    <DeleteConfirmationPopover
                      onDelete={handleDelete}
                      onClose={onClose}
                    />
                    <Button
                      colorScheme="orange"
                      isDisabled={props.isresolved ? true : false}
                      size={"lg"}
                      variant={"solid"}
                      gap={2}
                      onClick={handleEditItem}>
                      <EditIcon />
                      Edit
                    </Button>
                  </>
                )}
                <Button
                  colorScheme="blue"
                  size={"lg"}
                  variant={"outline"}
                  gap={2}
                  onClick={handleShare}>
                  <LinkIcon /> {!isShared ? "Share" : "Copied"}
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
      <FeedbackModal
        infoOnClose={onClose}
        isOpen={feedbackModalDisclosure.isOpen}
        onClose={feedbackModalDisclosure.onClose}
        props={props}
        setData={setData}
        email={user?.email}
        setLeaderboard={setLeaderboard}
      />

      <EditModal
        isOpenEditModal={isOpenEditModal}
        onOpenEditModal={onOpenEditModal}
        onCloseEditModal={onCloseEditModal}
        onCloseInfoModal={onClose}
        setIsCreate={setIsCreate}
        isCreate={isCreate}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setPosition={setPosition}
        centerPosition={centerPosition}
        date={date}
        setDate={setDate}
        newAddedItem={currentItem}
        setNewAddedItem={setCurrentItem}
        setUploadImg={setUploadImg}
        uploadImg={uploadImg}
        upload={upload}
      />
    </>
  );
}
