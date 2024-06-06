import { Flex, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";
export default function FeedbackButtonMobile() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      {isOpen && (
        <Flex
          display={{ base: "flex", md: "none" }}
          position="fixed"
          top="50%"
          zIndex={100}
          left="0"
          gap={3}
          transform="translateY(-50%)"
          backgroundColor="#007BFF"
          color="white"
          border="none"
          borderRightRadius={"lg"}
          borderBottomEndRadius={"lg"}
          textAlign="center"
          fontSize="14px"
          cursor="pointer"
          boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
          p={2}
          css={{
            writingMode: "vertical-rl",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CloseIcon
            onClick={() => {
              setIsOpen(false);
            }}
          />
          <Text
            onClick={() => {
              window.open("https://forms.gle/Uud594N7QE6VbiDY6", "_blank");
            }}
          >
            Give Feedback
          </Text>
        </Flex>
      )}
    </>
  );
}
