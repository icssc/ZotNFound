import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Box,
  Button,
  IconButton,
  HStack,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { LuSearch } from "react-icons/lu"

import { UserAuth } from "../../context/AuthContext";

const BookmarkModal = ({ isOpen, onClose, setSearch, colorMode }) => {

  const { keywords, removeKeyword } = UserAuth();
  const toast = useToast();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Saved Searches</ModalHeader>
        <ModalBody>
          <Box 
            maxH="30vh"
            overflowY="auto"
            scrollBehavior="smooth"
            sx={{
            paddingRight: "1vw",
            "&::-webkit-scrollbar": {
              width: "0.75vw",
            },
            "&::-webkit-scrollbar-track": {
              background: "gray.800",
              borderRadius: "10v",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.500",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "gray.400",
            }
          }}> 
            <VStack spacing={3} align="stretch">
              {keywords.length == 0 && <Text>No saved searches. Use the search bar to save search keywords and get alerts!</Text>}
              {keywords.map((searchTerm) => (
                <HStack
                  key={searchTerm}
                  justify="space-between"
                  borderRadius="md"
                  bg={colorMode === "dark" ? "#2F363C" : "gray.50"}
                  p="1vw"
                >
                  <Text>{searchTerm}</Text>
                  <HStack mr="auto">
                    <Button
                      size="sm"
                      paddingX={4}
                      leftIcon={<BellIcon />}
                      bg={colorMode === "dark" ? "gray.600" : "gray.100"}
                      colorScheme="gray"
                      variant="solid"
                      onClick={async () => {
                        const response = await removeKeyword(searchTerm);
                        if (!response) {
                          toast({
                            title: "Error!",
                            description: "Sorry, an error occurred while turning off your alerts. Please try again.",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                          });
                        }
                      }}
                    >
                      Remove Alerts
                    </Button>
                    <IconButton 
                      size="sm" 
                      aria-label="Search items" 
                      onClick={() => {
                        onClose();
                        setSearch(searchTerm);
                      }}
                      bg={colorMode === "dark" ? "gray.600" : "gray.100"}
                      colorScheme="gray"
                    >
                      <LuSearch />
                    </IconButton>
                  </HStack>
                </HStack>
              ))}
            </VStack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookmarkModal;
