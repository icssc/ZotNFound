import { useContext } from "react";
import {
  Box,
  HStack,
  Text,
  Image,
  useColorMode,
  useToast,
} from "@chakra-ui/react";

import bookmarkWhite from "../../../assets/logos/bookmark-white.svg";
import bookmarkBlack from "../../../assets/logos/bookmark-black.svg";
import bookmarkEmptyBlack from "../../../assets/logos/bookmark-empty-black.svg";
import bookmarkEmptyWhite from "../../../assets/logos/bookmark-empty-white.svg";

import { UserAuth } from "../../../context/AuthContext";
import DataContext from "../../../context/DataContext";

export default function SaveSearchButton({ keyword }) {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { user, addKeyword, keywords } = UserAuth();
  const { onLoginModalOpen } = useContext(DataContext);
  const isBookmarked = keywords.includes(keyword);

  const handleBookmarkClick = async () => {
    if (!user) {
      onLoginModalOpen();
      return;
    }
  
    const response = await addKeyword(keyword);
    const { success, wasAdded } = response;
  
    if (!success) {
      toast({
        title: "Error!",
        description:
          "Sorry, an error occurred while saving your search term. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    toast({
      title: wasAdded ? "Subscribed!" : "Already subscribed!",
      description: wasAdded
        ? "Your email was subscribed to notifications for this search."
        : "You are already subscribed to notifications for this search.",
      status: wasAdded ? "success" : "info",
      duration: 3000,
      isClosable: true,
    });
  };
  
  

  return (
    <Box
      p={3}
      cursor="pointer"
      display="flex"
      alignItems="center"
      fontWeight="medium"
      _hover={{
        bg: colorMode === "dark" ? "#413c4d" : "#9183b4",
        borderRadius: "md",
      }}
      onClick={handleBookmarkClick}
    >
      <HStack spacing={2}>
        <Image
          src={
            isBookmarked
              ? colorMode === "dark"
                ? bookmarkWhite
                : bookmarkBlack
              : colorMode === "dark"
              ? bookmarkEmptyWhite
              : bookmarkEmptyBlack
          }
          h="15px"
          alt="bookmark"
          w="15px"
        />
        <Text userSelect="none">
          {isBookmarked ? "Search saved!" : "Save this search"}
        </Text>
      </HStack>
    </Box>
  );
}
