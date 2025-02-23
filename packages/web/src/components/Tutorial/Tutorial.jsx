import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const tutorialSteps = [
  {
    title: "Welcome to ZotNFound! 🎉",
    content:
      "Let's take a quick tour to help you get started. We'll show you how to find and report lost items on campus.",
    position: "center",
  },
  {
    title: "Navigation Bar",
    content:
      "The navigation bar contains links to our latest updates, about page / leaderboard, instagram, and many more!",
    position: "top",
    highlight: ".nav-content",
  },
  {
    title: "Interactive Map",
    content:
      "This map shows all lost and found items. Click item clusters (ones with numbers) to expand them and see the item markers. Click any marker to see item details!",
    position: "center",
    highlight: ".leaflet-container",
  },
  {
    title: "Create a Post",
    content:
      "Click the blue + button in the bottom right corner to report a lost item or share something you've found.",
    position: "bottom-left",
    highlight: ".create-post-wrapper",
  },
  {
    title: "Results Panel",
    content:
      "All items are listed here for easy browsing. Click on any item to see more details.",
    position: "right",
    highlight: "[data-testid='results-panel']",
  },
  {
    title: "You're Ready! 🚀",
    content:
      "That's all you need to know to get started. You can always find help in the menu if you need it.",
    position: "center",
  },
];

const Tutorial = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleBack = () => {
    removeHighlight();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    removeHighlight();
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      localStorage.setItem("tutorialComplete", "true");
    }
  };

  const handleSkip = () => {
    removeHighlight();
    onClose();
    localStorage.setItem("tutorialComplete", "true");
  };

  const removeHighlight = () => {
    const previousHighlight = document.querySelector(".tutorial-highlight");
    if (previousHighlight) {
      previousHighlight.classList.remove("tutorial-highlight");
    }
  };

  // Reset step when tutorial is reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    // Remove previous highlight
    removeHighlight();

    // Add highlight to current element
    const { highlight } = tutorialSteps[currentStep];
    console.log("Looking for element:", highlight);
    console.log("Found element:", document.querySelector(highlight));
    if (highlight) {
      const element = document.querySelector(highlight);
      if (element) {
        element.classList.add("tutorial-highlight");
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    // Cleanup function to remove highlight when component unmounts
    return () => removeHighlight();
  }, [currentStep]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      isCentered={tutorialSteps[currentStep].position === "center"}
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg="blackAlpha.200" />
      <ModalContent
        position={
          tutorialSteps[currentStep].position !== "center"
            ? "fixed"
            : "relative"
        }
        top={tutorialSteps[currentStep].position === "top" ? "20%" : "auto"}
        bottom={
          tutorialSteps[currentStep].position === "bottom-left" ? "20%" : "auto"
        }
        right={tutorialSteps[currentStep].position === "right" ? "20%" : "auto"}
        maxW="400px"
        bg={useColorMode().colorMode === "dark" ? "gray.800" : "white"}
        boxShadow="xl"
      >
        <ModalHeader>
          <Flex justify="space-between" align="center">
            <Text>{tutorialSteps[currentStep].title}</Text>
            <Flex
              bg="blue.500"
              color="white"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
            >
              {currentStep + 1} / {tutorialSteps.length}
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Text>{tutorialSteps[currentStep].content}</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleSkip}>
            Skip Tutorial
          </Button>
          <Button
            variant="outline"
            mr={3}
            onClick={handleBack}
            isDisabled={currentStep === 0}
            leftIcon={<ChevronLeftIcon />}
          >
            Back
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleNext}
            rightIcon={
              currentStep < tutorialSteps.length - 1 ? (
                <ChevronRightIcon />
              ) : undefined
            }
          >
            {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Tutorial;
