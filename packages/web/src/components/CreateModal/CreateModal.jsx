import * as React from "react";
import { useState, useEffect, useCallback, useContext } from "react";
import {
  Image,
  Button,
  Flex,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  FormControl,
  Text,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Stack,
  VStack,
  useSteps,
  Box,
  ModalCloseButton,
  Textarea,
  Spinner,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
// import logo from "../../assets/images/small_logo.png";
import { storage } from "../../firebase";
import {
  MdDriveFileRenameOutline,
  MdOutlineDescription,
  MdEmail,
} from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import img_placeholder from "../../assets/images/img_placeholder.jpeg";
import TypeSelector from "../TypeSelector/TypeSelector";
import LostFoundSwitch from "./LostFoundSwitch";
// import { Stack } from "react-bootstrap";

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
  user,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [preferredContact, setPreferredContact] = useState("email");
  const [phoneNumber, setPhoneNumber] = useState("");

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
      }
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
    { title: "Fifth", description: "Contact Info" },
    { title: "Sixth", description: "Check Info" },
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
      zIndex={1000000000}>
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
      onClick={handleStepDecrement}>
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
      }}>
      Cancel
    </Button>
  );

  // Define the JSX for the 'Continue (without submitting)' button in the modal
  const continueModalButton = (
    <Button
      isDisabled={
        (activeStep === 0 && newAddedItem.name === "") ||
        newAddedItem.description === "" ||
        (activeStep === 1 && newAddedItem.type === "") ||
        (activeStep === 2 && newAddedItem.itemdate === "") ||
        (activeStep === 3 && uploadImg === "") ||
        (activeStep === 4 &&
          preferredContact === "phone" &&
          phoneNumber.length < 10)
      }
      variant={"solid"}
      colorScheme="blue"
      size="lg"
      onClick={handleStepIncrement}>
      Continue
    </Button>
  );

  // Define the JSX for the 'Continue (and submit)' button in the modal
  const submitModalButton = (
    <Button
      isDisabled={
        uploadImg === upload ||
        newAddedItem.image === "" ||
        newAddedItem.type === "" ||
        newAddedItem.name === "" ||
        newAddedItem.description === "" ||
        phoneNumber === ""
      }
      variant={"solid"}
      type="submit"
      colorScheme="green"
      size="lg"
      onClick={() => {
        onClose();
        setActiveStep(0);
        setIsCreate(false);
      }}>
      Submit
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
    [setNewAddedItem]
  );

  // Define the callback function to change the item name
  const handleItemNameChange = useCallback(
    (e) =>
      setNewAddedItem((prev) => ({
        ...prev,
        name: e.target.value,
      })),
    [setNewAddedItem]
  );

  // Define the callback function to change the item description
  const handleItemDescriptionChange = useCallback(
    (e) =>
      setNewAddedItem((prev) => ({
        ...prev,
        description: e.target.value,
      })),
    [setNewAddedItem]
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
    [setNewAddedItem]
  );

  const phoneNumberBox = (
    // get this to accept numbers only
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <PhoneIcon color="gray.300" />
      </InputLeftElement>
      <Input
        type="tel"
        placeholder="Phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        maxLength={10} // US phone numbers are 10 digits
      />
    </InputGroup>
  );

  const displayEmail = (
    // get this to display the email in a bordered box
    <>
      <MdEmail color="gray.300" />
      {/* {console.log(user)} */}
      <Text ml="2%" fontSize={15} w={"100%"}>
        {user?.email}
      </Text>
    </>
  );

  const displayPhoneNumber = (
    <>
      <PhoneIcon color="gray.300" />
      <Text ml="2%" fontSize={15} w={"100%"}>
        {phoneNumber}
      </Text>
    </>
  );

  const emailIcon = <MdEmail size={"1.3em"} />;
  useEffect(() => {
    if (newAddedItem.image && typeof newAddedItem.image !== "string") {
      setIsLoading(true);
      uploadFile();
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
          setPhoneNumber("");
          setPreferredContact("email");
          onClose();
        }}
        size={"4xl"}
        closeOnOverlayClick={false}
        finalFocusRef={{}}>
        <ModalOverlay>
          <ModalContent minHeight="50vh">
            <Flex padding={"2%"} flexDir={"column"}>
              {/* stepper */}
              <Stepper
                size="lg"
                index={activeStep}
                flex={1}
                display={{ md: "flex", base: "none" }}>
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
                mb={{ md: "3%", base: "10%" }}>
                {/* first step */}
                {activeStep === 0 && (
                  <Flex width={{ md: "50%", base: "90%" }}>
                    <FormControl>
                      <FormLabel fontSize="2xl">🔑 Item Name:</FormLabel>

                      <Input
                        variant="outline"
                        placeholder="Ex: Airpods Pro, ..."
                        size="lg"
                        mb={5}
                        border="2px solid gray"
                        value={newAddedItem.name}
                        onChange={handleItemNameChange}
                      />
                      <FormLabel fontSize="2xl">
                        📝Description of Item:
                      </FormLabel>

                      <Textarea
                        variant="outline"
                        placeholder="Ex: Lost in ICS 31 Lec, ..."
                        size="lg"
                        border="2px solid gray"
                        value={newAddedItem.description}
                        onChange={handleItemDescriptionChange}
                        rows="5"
                      />
                    </FormControl>
                  </Flex>
                )}
                {/* first step */}

                {/* second step */}
                {activeStep === 1 && (
                  <Flex
                    flexDir={"column"}
                    w="100%"
                    justifyContent={"center"}
                    alignItems={"center"}>
                    <FormControl>
                      <FormLabel
                        ml={5}
                        fontSize="2xl"
                        mb={8}
                        textAlign={"center"}>
                        ❓ Select Item Type:
                      </FormLabel>
                    </FormControl>

                    <TypeSelector
                      setNewAddedItem={setNewAddedItem}
                      newAddedItem={newAddedItem}
                    />
                    <FormControl>
                      <Flex flexDir={"column"}>
                        <FormLabel
                          htmlFor="lost-item"
                          ml={5}
                          fontSize="2xl"
                          my={8}
                          textAlign={"center"}>
                          🤔 Lost or Found Item?
                        </FormLabel>

                        <Flex
                          alignItems={"center"}
                          textAlign={"center"}
                          justify={"center"}
                          mb={"5%"}>
                          <LostFoundSwitch
                            setNewAddedItem={setNewAddedItem}
                            newAddedItem={newAddedItem}
                          />
                        </Flex>
                      </Flex>
                    </FormControl>
                  </Flex>
                )}

                {/* second step */}

                {/* third step */}
                {activeStep === 2 && (
                  <FormControl>
                    <FormLabel
                      px="10%"
                      fontSize="xl"
                      textAlign={"center"}
                      mb={"5%"}>
                      {newAddedItem.islost ? "📅 Lost Date:" : "📅 Found Date:"}
                    </FormLabel>

                    <Flex
                      w="100%"
                      alignItems={"center"}
                      justifyContent={"center"}
                      px={{ md: "10%", base: "3%" }}>
                      <Calendar
                        className={"react-calendar"}
                        calendarType="US"
                        onChange={handleItemDateChange}
                        value={date}
                      />
                    </Flex>
                  </FormControl>
                )}
                {/* third step */}

                {/* fourth step */}
                {activeStep === 3 && (
                  <FormControl>
                    <Flex
                      gap={5}
                      alignItems="center"
                      flexDirection="column"
                      justifyContent="center">
                      <Flex justifyContent="center" alignItems="center" gap={3}>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          width="38%"
                          sx={{
                            "::file-selector-button": {
                              height: 10,
                              padding: 0,
                              mr: 4,
                              background: "none",
                              border: "none",
                              fontWeight: "bold",
                            },
                          }}
                          onChange={handleItemImageChange}
                        />

                        {/* <Button onClick={uploadFile}>Confirm</Button> */}
                      </Flex>

                      {isLoading ? loadingAnimation : uploadedImage}
                    </Flex>
                  </FormControl>
                )}
                {/* fourth step */}

                {/* NEW fifth step */}
                {activeStep === 4 && (
                  <Flex>
                    <FormControl>
                      <FormLabel
                        ml={5}
                        fontSize="2xl"
                        mb={8}
                        textAlign={"center"}>
                        📞 Preferred Contact ✉
                      </FormLabel>
                      <Flex
                        justifyContent={"center"}
                        alignItems={"center"}
                        mb={5}
                        gap={3}>
                        <RadioGroup
                          onChange={setPreferredContact} // make a function to set the value -- if email, then display email | if phone, then ask for phone number and set it
                          value={preferredContact}>
                          <VStack direction="row" spacing={5}>
                            <Radio value="email">Email</Radio>
                            <Radio value="phone">Phone</Radio>
                            {preferredContact === "phone"
                              ? phoneNumberBox
                              : displayEmail}
                          </VStack>
                        </RadioGroup>
                      </Flex>
                    </FormControl>
                    {console.log(preferredContact)}
                  </Flex>
                )}
                {/* sixth step */}
                {activeStep === 5 && (
                  <Flex gap={"5%"} flexDir={{ md: "row", base: "column" }}>
                    <Flex
                      flexDir={"column"}
                      flex={1}
                      justifyContent={"center"}
                      alignItems={"center"}>
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
                      backgroundColor={"#f9f9f9"}
                      flexDir={"column"}
                      borderRadius={"10%"}
                      padding={"1vw"}
                      maxW={{ md: "70%", base: "80vw" }}
                      mb={3}
                      alignItems={{ base: "center", md: "start" }}>
                      <Text
                        ml="1%"
                        textAlign={"center"}
                        as="b"
                        fontSize={"2xl"}
                        mb={5}>
                        Item Information:
                      </Text>

                      <Flex
                        mb="5%"
                        ml="1%"
                        padding={2}
                        gap={3}
                        flexDir={{ base: "column", md: "row" }}
                        justifyContent={"center"}
                        alignItems={"center"}>
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
                        alignItems={"center"}>
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
                        alignItems={"center"}>
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
                        alignItems={"center"}>
                        <SlCalender size={"1.3em"} />
                        <Text ml="2%" fontSize={15} w={"100%"}>
                          {newAddedItem.itemdate}
                        </Text>
                      </Flex>

                      <Flex
                        mb="5%"
                        padding={2}
                        gap={3}
                        flexDir={{ base: "column", md: "row" }}
                        justifyContent={"center"}
                        alignItems={"center"}>
                        {preferredContact === "phone"
                          ? displayPhoneNumber
                          : displayEmail}
                      </Flex>
                    </Flex>
                  </Flex>
                )}
                {/* sixth step */}
              </Flex>

              <Flex justifyContent={"center"} gap="3%">
                {activeStep > 0 ? backModalButton : cancelModalButton}
                {activeStep < 5 ? continueModalButton : submitModalButton}
              </Flex>
            </Flex>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
