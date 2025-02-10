import React from "react";
import {
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  Box,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import SaveSearchButton from "./SaveSearchButton";

export default function SearchBar({ search, setSearch, loading, colorMode }) {
  return (
    <HStack
      w={{ base: "100%", md: "30%" }}
      display={{ base: "none", md: "block" }}
      position="relative"
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ position: "relative" }}
      >
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search2Icon color="gray.300" />
          </InputLeftElement>
          <Input
            color={colorMode === "dark" ? "white" : "black"}
            bg={colorMode === "dark" ? "#15181a" : ""}
            border={colorMode === "dark" ? "1px" : "1px"}
            borderColor={colorMode === "light" ? "blue.200" : "gray.300"}
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
            <SaveSearchButton />
          </Box>
        )}
      </motion.div>
    </HStack>
  );
}
