import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Text,
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import ResultsBar from "../../ResultsBar/ResultsBar";

const MobileResultsDrawer = ({
  isOpen,
  onClose,
  search,
  setSearch,
  loading,
  isFilterOff,
  onOpen,
  findFilter,
  setFocusLocation,
  setLeaderboard,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
      <DrawerOverlay />
      <DrawerContent bg={colorMode === "dark" ? "#1A1E22" : "white"}>
        <DrawerCloseButton size="lg" />
        <DrawerHeader>
          {isFilterOff() ? (
            <Text fontSize="2xl">All Posts</Text>
          ) : (
            <Flex alignItems="center" gap={1}>
              <Text fontSize="2xl" color="green">
                Filter: ON
              </Text>
              <SettingsIcon color="green" />
            </Flex>
          )}
        </DrawerHeader>
        <DrawerBody
          overflow="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: colorMode === "dark" ? "#525960" : "#c1c1c1",
              borderRadius: "24px",
            },
          }}
        >
          <Flex width="100%" flexDir="column" minH="100%">
            <Flex>
              <InputGroup
                mb="1%"
                width="90%"
                mx="auto"
                size={{ base: "md", md: "lg" }}
              >
                <InputLeftAddon children="🔎" />
                <Input
                  type="teal"
                  value={search}
                  placeholder="Search Items ..."
                  isDisabled={!loading}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>

              <Button
                colorScheme="green"
                size="md"
                fontSize="xl"
                mr={3}
                onClick={onOpen}
              >
                <SettingsIcon />
              </Button>
            </Flex>

            <ResultsBar
              search={search}
              findFilter={findFilter}
              setFocusLocation={setFocusLocation}
              onResultsBarClose={onClose}
              setLeaderboard={setLeaderboard}
            />
          </Flex>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};

export default MobileResultsDrawer;
