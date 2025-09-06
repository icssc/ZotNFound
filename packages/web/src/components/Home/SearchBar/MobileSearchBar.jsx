import React from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MobileSearchBar = ({ search, setSearch, loading }) => {
  const { colorMode } = useColorMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Flex
        w="100%"
        display={{ base: "flex", md: "none" }}
        justifyContent="center"
        alignItems="center"
      >
        <Flex width="95%">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <Input
              color={colorMode === "dark" ? "white" : "black"}
              bg={colorMode === "dark" ? "#15181a" : ""}
              border={colorMode === "dark" ? "1px" : "1px"}
              borderColor={colorMode === "light" ? "blue" : "gray.300"}
              type="teal"
              value={search}
              placeholder="Search Items ..."
              isDisabled={!loading}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          {search.trim() !== "" && (
            <Box
              position="absolute"
              top="100%"
              left={0}
              width="100%"
              mt="2"
              borderRadius="md"
              bg={colorMode === "dark" ? "#45435b" : "#ac9dd1"}
              color={colorMode === "dark" ? "white" : "black"}
              zIndex="9999"
              boxShadow="md"
            >
              <SaveSearchButton keyword={search} />
            </Box>
          )}
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default MobileSearchBar;
