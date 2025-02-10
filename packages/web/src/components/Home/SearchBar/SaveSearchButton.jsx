import { useState } from "react";
import { Box, HStack, Text, Image, useColorMode } from "@chakra-ui/react";
import bookmarkWhite from "../../../assets/logos/bookmark-white.svg";
import bookmarkBlack from "../../../assets/logos/bookmark-black.svg";
import bookmarkEmptyBlack from "../../../assets/logos/bookmark-empty-black.svg";
import bookmarkEmptyWhite from "../../../assets/logos/bookmark-empty-white.svg";

export default function SaveSearchButton() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { colorMode } = useColorMode();

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
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
          w="15px"
        />
        <Text userSelect="none">
          {isBookmarked ? "Search saved!" : "Save this search"}
        </Text>
      </HStack>
    </Box>
  );
}
