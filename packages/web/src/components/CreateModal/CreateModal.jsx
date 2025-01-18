import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
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
  useColorMode,
  useSteps,
} from "@chakra-ui/react";
import "./Calendar.css";
import img_placeholder from "../../assets/images/img_placeholder.jpeg";
import MissingItemInput from "./components/MissingItemInput";
import ItemTypeInput from "./components/ItemTypeInput";
import DateInput from "./components/DateInput";
import ImageInput from "./components/ImageInput";
import CheckInfo from "./components/CheckInfo";
import imageCompression from 'browser-image-compression';
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

  const uploadFile = useCallback(async () => {
    if (!newAddedItem.image) return;
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 2560,
      useWebWorker: true,
      fileType: "image/jpeg",
    }
    const compressedFile = await imageCompression(newAddedItem.image, options);
    // const apiUrl = process.env.API_URL;
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/upload/image`,
      {
        body: compressedFile,
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg",
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
      setIsLoading(true);
      if (e.target.files[0].size <= 10000000) {
        setNewAddedItem((prev) => ({
          ...prev,
          image: e.target.files[0],
        }));
        console.log(uploadImg);
        console.log(URL.createObjectURL(e.target.files[0]));
        setUploadImg(URL.createObjectURL(e.target.files[0]));
        console.log(uploadImg);
        setIsLoading(false);
      } else {
        alert("Image exceeds size limit of 10 MB");
      }
    },
    [setNewAddedItem],
  );

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

                {/* fifth step */}
                {activeStep === 4 && (
                  <CheckInfo
                    newAddedItem={newAddedItem}
                    upload={upload}
                    uploadImg={uploadImg}
                  />
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
