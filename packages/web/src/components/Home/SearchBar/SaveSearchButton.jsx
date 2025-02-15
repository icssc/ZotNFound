import { useContext, useState } from "react";
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

import axios from "axios";

export default function SaveSearchButton({keyword}) {
  const [isBookmarked] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { user } = UserAuth();
  const { onLoginModalOpen } = useContext(DataContext);

  const handleBookmarkClick = () => {
    let success = true;
    if (!user) {
      onLoginModalOpen();
    }
    axios.post(
      `${
        import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL
      }/searches`,
      {
        email: user.email,
        keyword: keyword,
      },
    )
    .catch((err) => {
      success = false; 
      console.log(err);
    });

    toast({
      title: success ? "Search saved!" : "Error!",
      description:
        success ? 
        "Your search term was saved and your email was subscribed to notifications for this search." : 
        "Sorry, an error occurred while saving your search term. Please try again.",
      status: success ? "info" : "error",
      duration: 3000,
      isClosable: true,
    });
  }

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
          w="15px"
        />
        <Text userSelect="none">
          {isBookmarked ? "Search saved!" : "Save this search"}
        </Text>
      </HStack>
    </Box>
  );
}
