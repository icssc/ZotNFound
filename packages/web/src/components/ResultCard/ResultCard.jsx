import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Text,
  Divider,
  Button,
  Flex,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import InfoModal from "../InfoModal/InfoModal.jsx";
import { formatDate } from "../../utils/DateUtils.js";
import locate from "../../assets/logos/locate.svg";
import locate_dark from "../../assets/logos/locate_dark.svg";

const ResultCard = React.memo(
  ({ props, setData, onResultsBarClose, setLeaderboard }) => {
    const { colorMode } = useColorMode();
    const infoModalDisclosure = useDisclosure();
    const { id } = useParams();

    const formattedDate = useMemo(
      () => formatDate(new Date(props.date)),
      [props.date]
    );

    // Define JSX for 'Lost' button on result card
    const lostButton = (
      <Button
        colorScheme="red"
        ml="20%"
        size="md"
        w="40"
        gap={1}
        onClick={onResultsBarClose}
      >
        <Image src={colorMode === "dark" ? locate_dark : locate} alt="lost" />
        Lost
      </Button>
    );

    // Define JSX for 'Found' button on result card
    const foundButton = (
      <Button
        colorScheme="green"
        ml="20%"
        size="md"
        w="40"
        gap={1}
        onClick={onResultsBarClose}
      >
        <Image src={colorMode === "dark" ? locate_dark : locate} alt="found" />
        Found
      </Button>
    );
    return (
      <>
        <Card
          bg={colorMode === "dark" ? "#2F363C" : "gray.50"}
          border="1px"
          borderColor={colorMode === "dark" ? "#2F363C" : "gray.300"}
          maxW="lg"
          align={"center"}
          mb="10px"
        >
          <CardBody>
            <Flex justifyContent={"center"} alignItems={"center"}>
              {props.isresolved && (
                <Flex
                  backgroundColor={"rgba(255, 123, 0, 0.9)"}
                  position={"absolute"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  marginTop={30}
                  flexDir={"column"}
                  w={450}
                >
                  <Text fontSize={18} as="b" color={"white"}>
                    RETURNED
                  </Text>
                  <Text fontSize={15} color={"white"}>
                    This item has been returned.
                  </Text>
                </Flex>
              )}
              <Image
                maxHeight="250px"
                border="1px"
                borderColor="gray.300"
                rounded={"lg"}
                src={props.image}
                loading="lazy"
                alt="uploaded image"
              />
            </Flex>
            <Stack mt="6">
              <Flex justifyContent={"center"} alignItems={"center"}>
                <Text
                  color={colorMode === "dark" ? "white" : "blue.600"}
                  fontSize="md"
                  fontWeight="bold"
                  mr={5}
                >
                  {props.name}
                </Text>
                <Text
                  color={colorMode === "dark" ? "white" : "blue.600"}
                  fontSize="sm"
                >
                  {formattedDate}
                </Text>
              </Flex>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <Flex justifyContent={"space-between"}>
              <Button
                variant={colorMode === "dark" ? "solid" : "outline"}
                colorScheme={"blue"}
                leftIcon={<InfoIcon />}
                size="md"
                w="60%"
                onClick={infoModalDisclosure.onOpen}
              >
                View
              </Button>
              {props.islost ? lostButton : foundButton}
            </Flex>
          </CardFooter>
        </Card>
        {(infoModalDisclosure.isOpen || id) && (
          <InfoModal
            props={props}
            onClose={infoModalDisclosure.onClose}
            isOpen={
              id && props.id
                ? id === props.id.toString()
                : infoModalDisclosure.isOpen
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
