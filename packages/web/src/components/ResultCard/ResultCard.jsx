import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Image,
  Text,
  Badge,
  Button,
  useColorMode,
  useDisclosure,
  VStack,
  HStack,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { InfoIcon, TimeIcon, CalendarIcon } from "@chakra-ui/icons";
import { FaMapMarkerAlt } from "react-icons/fa";
import InfoModal from "../InfoModal/InfoModal.jsx";
import { formatDate } from "../../utils/DateUtils.js";

const ResultCard = React.memo(
  ({ props, setData, onResultsBarClose, setLeaderboard }) => {
    const { colorMode } = useColorMode();
    const infoModalDisclosure = useDisclosure();
    const { id } = useParams();

    const formattedDate = useMemo(
      () => formatDate(new Date(props.date)),
      [props.date]
    );

    const bgColor = colorMode === "dark" ? "gray.700" : "white";
    const textColor = colorMode === "dark" ? "white" : "gray.800";
    const accentColor = props.islost ? "red.400" : "green.400";

    return (
      <>
        <Box
          bg={bgColor}
          borderWidth="1px"
          borderColor={accentColor}
          borderRadius="xl"
          overflow="hidden"
          boxShadow="lg"
          transition="all 0.3s"
          _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
          mb={4}
          position="relative"
          width="100%"
        >
          <Flex direction={{ base: "column", sm: "row" }}>
            <Box position="relative" width={{ base: "100%", sm: "40%" }}>
              <Image
                src={props.image}
                alt={props.name}
                objectFit="cover"
                width="100%"
                height={{ base: "200px", sm: "100%" }}
              />
              <Badge
                position="absolute"
                top="10px"
                left="10px"
                colorScheme={props.islost ? "red" : "green"}
                fontSize="0.8em"
                px={2}
                py={1}
                borderRadius="full"
              >
                {props.islost ? "Lost" : "Found"}
              </Badge>
            </Box>
            <VStack
              align="stretch"
              p={4}
              spacing={3}
              width={{ base: "100%", sm: "60%" }}
            >
              <Text
                fontWeight="bold"
                fontSize={{ base: "lg", md: "xl" }}
                color={textColor}
                noOfLines={2}
              >
                {props.name}
              </Text>
              <HStack spacing={4}>
                <Tooltip label="Date item was reported" placement="top">
                  <Flex align="center">
                    <Icon as={CalendarIcon} color={accentColor} mr={1} />
                    <Text fontSize="sm" color="gray.500">
                      {formattedDate}
                    </Text>
                  </Flex>
                </Tooltip>
                <Tooltip label="Time item was lost/found" placement="top">
                  <Flex align="center">
                    <Icon as={TimeIcon} color={accentColor} mr={1} />
                    <Text fontSize="sm" color="gray.500">
                      {props.itemdate}
                    </Text>
                  </Flex>
                </Tooltip>
              </HStack>
              <Text fontSize="sm" color={textColor} noOfLines={2}>
                {props.description}
              </Text>
              <HStack spacing={2} mt={2}>
                <Button
                  leftIcon={<InfoIcon />}
                  size="sm"
                  colorScheme={props.islost ? "red" : "green"}
                  variant="solid"
                  onClick={infoModalDisclosure.onOpen}
                  flex={1}
                >
                  View Details
                </Button>
                <Button
                  leftIcon={<FaMapMarkerAlt />}
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={onResultsBarClose}
                  flex={1}
                >
                  Locate
                </Button>
              </HStack>
            </VStack>
          </Flex>
          {props.isresolved && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bg="orange.500"
              color="white"
              textAlign="center"
              py={1}
              fontSize="sm"
              fontWeight="bold"
            >
              RETURNED
            </Box>
          )}
        </Box>
        {(infoModalDisclosure.isOpen || id) && (
          <InfoModal
            props={props}
            onClose={infoModalDisclosure.onClose}
            isOpen={
              id === props.id.toString() ? true : infoModalDisclosure.isOpen
            }
            setData={setData}
            setLeaderboard={setLeaderboard}
          />
        )}
      </>
    );
  }
);

export default ResultCard;