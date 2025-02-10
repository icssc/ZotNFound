import React from "react";
import {
  Flex,
  ButtonGroup,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { SettingsIcon, StarIcon } from "@chakra-ui/icons";
import DateRangeFilter from "../DateRangeFilter";
import MobileResultsDrawer from "./MobileResultsDrawer.jsx";
import Filter from "../../Filter/Filter.jsx";

const FilterBar = ({
  isEdit,
  isOpenCreateModal,
  colorMode,
  onOpen,
  setFindFilter,
  findFilter,
  isOpen,
  onClose,
  isResultsBarOpen,
  onResultsBarOpen,
  onResultsBarClose,
  search,
  setSearch,
  loading,
  isFilterOff,
  setFocusLocation,
  setLeaderboard,
}) => {
  return (
    <Flex
      width={{ base: "100vw", md: "75vw" }}
      padding={{ base: 3, md: 5 }}
      position="absolute"
      zIndex={1000}
      flexDirection="row"
      justifyContent="space-between"
    >
      {isEdit && !isOpenCreateModal ? (
        <Flex>
          <Alert
            status="warning"
            textAlign="center"
            alignItems="center"
            justifyContent="center"
            height="80px"
            border="3px red solid"
            borderRadius="20px"
            boxShadow="xl"
          >
            <AlertIcon />
            <AlertTitle>Click on the Map to place your item 📍</AlertTitle>
          </Alert>
        </Flex>
      ) : (
        <Flex gap="4">
          <ButtonGroup
            variant="outline"
            colorScheme="#74a2fa"
            color={colorMode === "light" ? "#5f85cf" : "white"}
            spacing={3}
          >
            <Button
              backgroundColor={colorMode === "light" ? "white" : "#2F363C"}
              onClick={onOpen}
              size="lg"
              gap={1}
              fontSize={{ base: "xl", md: "2xl" }}
              borderRadius={"lg"}
              borderWidth={2}
              leftIcon={<SettingsIcon />}
            >
              Filter
            </Button>
            <DateRangeFilter />
          </ButtonGroup>

          <Filter
            setFindFilter={setFindFilter}
            findFilter={findFilter}
            onOpen={onOpen}
            isOpen={isOpen}
            onClose={onClose}
          />

          <Button
            display={{ md: "none" }}
            background={"#74a2fa"}
            color={"white"}
            onClick={onResultsBarOpen}
            fontSize="2xl"
            boxShadow={
              colorMode === "light"
                ? "7px 7px 14px #666666"
                : "7px 7px 14px #1A1E22"
            }
            size="lg"
            gap={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <StarIcon />
          </Button>

          <MobileResultsDrawer
            isOpen={isResultsBarOpen}
            onClose={onResultsBarClose}
            search={search}
            setSearch={setSearch}
            loading={loading}
            isFilterOff={isFilterOff}
            onOpen={onOpen}
            findFilter={findFilter}
            setFocusLocation={setFocusLocation}
            setLeaderboard={setLeaderboard}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default FilterBar;
