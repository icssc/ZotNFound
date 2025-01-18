import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  Textarea,
  useColorMode,
  useSteps,
} from "@chakra-ui/react";
// import logo from "../../assets/images/small_logo.png";
import { storage } from "../../firebase";
import { MdDriveFileRenameOutline, MdOutlineDescription } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import img_placeholder from "../../assets/images/img_placeholder.jpeg";
import TypeSelector from "../TypeSelector/TypeSelector";
import LostFoundSwitch from "./LostFoundSwitch";
import MissingItemInput from "./components/MissingItemInput";
import ItemTypeInput from "./components/ItemTypeInput";
import DateInput from "./components/DateInput";
import ImageInput from "./components/ImageInput";

export default function CreateModal({
  isOpen,
  onOpen,
  onClose,
  newAddedItem,
  setNewAddedItem,
  setIsCreate,
  isCreate,
  isEdit,
  setIsEdit,
  setPosition,
  centerPosition,
  setUploadImg,
  uploadImg,
  upload,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode } = useColorMode();

  const uploadFile = useCallback(async () => {
    if (!newAddedItem.image) return;

    // const apiUrl = process.env.API_URL;
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/upload/image`,
      {
        body: newAddedItem.image,
        method: "POST",
        headers: {
          "Content-Type": newAddedItem.image.type,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await response.json();
    console.log(data);
    const url = data.url;
    for (const [key, value] of response.headers.entries()) {
      console.log(`${key}: ${value}`);
    }
    // const key = response.headers.get('Content-Disposition').split('=')[1].slice(1, -1);
    // console.log(key)
    // save key into database associated with use

    setUploadImg(url);
    setNewAddedItem((prev) => ({ ...prev, image: url }));
    setIsLoading(false);
  }, [newAddedItem.image, setUploadImg, setNewAddedItem, setIsLoading]);

  const [date, setDate] = useState(new Date());

  const steps = [
    { title: "First", description: "Enter Info" },
    { title: "Second", description: "Select Type" },
    { title: "Third", description: "Choose Date" },
    { title: "Fourth", description: "File Upload" },
    { title: "Fifth", description: "Check Info" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Define the JSX for the loading animation while an image is uploading
  const loadingAnimation = (
    <Flex
      width={{ md: "10vw", base: "10vh" }}
      height={{ md: "10vw", base: "10vh" }}
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
  );

  // Define the JSX for the uploaded image
  const uploadedImage = (
    <Image
      width={{ md: "40%", base: "80%" }}
      src={uploadImg ? uploadImg : img_placeholder}
    />
  );

  // Define the callback function to increment the active step count
  const handleStepIncrement = useCallback(() => {
    setActiveStep((prevStep) => prevStep + 1);
  }, [setActiveStep]);

  // Define the callback function to decrement the active step count
  const handleStepDecrement = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
  }, [setActiveStep]);

  // Define the JSX for the 'Back' button in the modal
  const backModalButton = (
    <Button
      variant={"solid"}
      colorScheme="red"
      size="lg"
      onClick={handleStepDecrement}
    >
      Back
    </Button>
  );

  // Define the JSX for the 'Cancel' button in the modal
  const cancelModalButton = (
    <Button
      colorScheme="red"
      size="lg"
      onClick={() => {
        setIsEdit(!isEdit);
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
        onClose();
      }}
    >
      Cancel
    </Button>
  );

  // Define the JSX for the 'Continue (without submitting)' button in the modal
  const continueModalButton = (
    <Button
      isDisabled={(activeStep === 0 && newAddedItem.name === "") ||
        newAddedItem.description === "" ||
        (activeStep === 1 && newAddedItem.type === "") ||
        (activeStep === 2 && newAddedItem.itemdate === "") ||
        (activeStep === 3 && uploadImg === "")}
      variant={"solid"}
      colorScheme="blue"
      size="lg"
      onClick={handleStepIncrement}
    >
      Continue
    </Button>
  );

  // Define the JSX for the 'Continue (and submit)' button in the modal
  const submitModalButton = (
    <Button
      isDisabled={uploadImg === upload ||
        newAddedItem.image === "" ||
        newAddedItem.type === "" ||
        newAddedItem.name === "" ||
        newAddedItem.description === ""}
      variant={"solid"}
      type="submit"
      colorScheme="green"
      size="lg"
      onClick={() => {
        onClose();
        uploadFile(); // submit ONLY when form is filled out
        setActiveStep(0);
        setIsCreate(false);
      }}
    >
      Continue
    </Button>
  );

  // Define the callback function to change the item date
  const handleItemDateChange = useCallback(
    (e) => {
      setDate(e);
      setNewAddedItem((prev) => ({
        ...prev,
        itemdate: e.toISOString().split("T")[0],
      }));
    },
    [setNewAddedItem],
  );

  // Define the callback function to change the item name
  const handleItemNameChange = useCallback(
    (e) =>
      setNewAddedItem((prev) => ({
        ...prev,
        name: e.target.value,
      })),
    [setNewAddedItem],
  );

  // Define the callback function to change the item description
  const handleItemDescriptionChange = useCallback(
    (e) =>
      setNewAddedItem((prev) => ({
        ...prev,
        description: e.target.value,
      })),
    [setNewAddedItem],
  );

  // Define the callback function to change the item image
  const handleItemImageChange = useCallback(
    (e) => {
      // image size limit of 2 MB
      if (e.target.files[0].size <= 10000000) {
        setNewAddedItem((prev) => ({
          ...prev,
          image: e.target.files[0],
        }));
      } else {
        alert("Image exceeds size limit of 10 MB");
      }
    },
    [setNewAddedItem],
  );

  useEffect(() => {
    if (newAddedItem.image && typeof newAddedItem.image !== "string") {
      setIsLoading(true);
      // uploadFile(); plan to upload image later when form is submitted
    }
  }, [newAddedItem.image, uploadFile]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
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
          setActiveStep(0);
          setIsCreate(true);
          setIsEdit(false);
          onClose();
        }}
        size={"4xl"}
        closeOnOverlayClick={false}
        finalFocusRef={{}}
      >
        <ModalOverlay>
          <ModalContent minHeight="50vh">
            <Flex padding={"2%"} flexDir={"column"}>
              {/* stepper */}
              <Stepper
                size="lg"
                index={activeStep}
                flex={1}
                display={{ md: "flex", base: "none" }}
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
              <ModalCloseButton color={"#c43232"} />
              {/* steppper */}
              <Flex
                width="100%"
                justifyContent={"center"}
                mt="5%"
                mb={{ md: "3%", base: "10%" }}
              >
                {/* first step */}
                {activeStep === 0 && (
                  <MissingItemInput
                    newAddedItem={newAddedItem}
                    handleItemNameChange={handleItemNameChange}
                    handleItemDescriptionChange={handleItemDescriptionChange}
                  />
                )}
                {/* second step */}
                {activeStep === 1 && (
                  <ItemTypeInput
                    newAddedItem={newAddedItem}
                    setNewAddedItem={setNewAddedItem}
                  />
                )}
                {/* third step */}
                {activeStep === 2 && (
                  <DateInput
                    isLost={newAddedItem.islost}
                    date={date}
                    handleItemDateChange={handleItemDateChange}
                  />
                )}

                {/* fourth step */}
                {activeStep === 3 && (
                  <ImageInput
                    handleItemDateChange={handleItemDateChange}
                    handleItemImageChange={handleItemImageChange}
                    isLoading={isLoading}
                    loadingAnimation={loadingAnimation}
                    uploadedImage={uploadedImage}
                  />
                )}
                {/* fourth step */}

                {/* fifth step */}
                {activeStep === 4 && (
                  <Flex gap={"5%"} flexDir={{ md: "row", base: "column" }}>
                    <Flex
                      flexDir={"column"}
                      flex={1}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Text as="b" fontSize={25}>
                        Confirm & Submit
                      </Text>
                      <Image
                        sizeBox="100%"
                        src={uploadImg === "" ? upload : uploadImg}
                        width={{ md: "25vw", base: "20vh" }}
                        maxHeight={{ md: "25vw", base: "20vh" }}
                        borderRadius="15%"
                        objectFit={"cover"}
                      />
                    </Flex>

                    <Flex
                      flex={1}
                      backgroundColor={colorMode === "light"
                        ? "#f9f9f9"
                        : "#2c2c2c"}
                      flexDir={"column"}
                      borderRadius={"10%"}
                      padding={"1vw"}
                      maxW={{ md: "70%", base: "80vw" }}
                      mb={3}
                      alignItems={{ base: "center", md: "start" }}
                    >
                      <Text
                        ml="1%"
                        textAlign={"center"}
                        as="b"
                        fontSize={"2xl"}
                        mb={5}
                      >
                        Item Information:
                      </Text>

                      <Flex
                        mb="5%"
                        ml="1%"
                        padding={2}
                        gap={3}
                        flexDir={{ base: "column", md: "row" }}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <MdDriveFileRenameOutline size={"1.3em"} />
                        <Text w={"100%"} ml="2%" fontSize={15}>
                          {newAddedItem.name}
                        </Text>
                      </Flex>

                      <Flex
                        mb="5%"
                        padding={2}
                        gap={3}
                        flexDir={{ base: "column", md: "row" }}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <MdOutlineDescription size={"1.3em"} />
                        <Text ml="2%" fontSize={15} w={"100%"}>
                          {newAddedItem.description}
                        </Text>
                      </Flex>

                      <Flex
                        mb="5%"
                        padding={2}
                        gap={3}
                        flexDir={{ base: "column", md: "row" }}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <FaMagnifyingGlass size={"1.3em"} />
                        <Text ml="2%" fontSize={15} w={"100%"}>
                          {newAddedItem.islost ? "LOST" : "FOUND"}
                          {", "}
                          {newAddedItem.type.toUpperCase()}
                        </Text>
                      </Flex>

                      <Flex
                        mb="5%"
                        padding={2}
                        gap={3}
                        flexDir={{ base: "column", md: "row" }}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <SlCalender size={"1.3em"} />
                        <Text ml="2%" fontSize={15} w={"100%"}>
                          {newAddedItem.itemdate}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                )}
                {/* fifth step */}
              </Flex>

              <Flex justifyContent={"center"} gap="3%">
                {activeStep > 0 ? backModalButton : cancelModalButton}
                {activeStep < 4 ? continueModalButton : submitModalButton}
              </Flex>
            </Flex>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
