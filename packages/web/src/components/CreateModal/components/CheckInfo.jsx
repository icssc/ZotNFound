import React from "react";
import { Flex, Image, Text, useColorMode } from "@chakra-ui/react";
import { MdDriveFileRenameOutline, MdOutlineDescription } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";

const CheckInfo = ({ uploadImg, upload, newAddedItem }) => {
    const { colorMode } = useColorMode();

    return (
        <Flex gap={"5%"} flexDir={{ md: "row", base: "column" }}>
            <Flex
                flexDir={"column"}
                flex={1}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Text as="b" fontSize={25}>
                    Confirm & Submit
                </Text>
                <Image
                    sizeBox="100%"
                    src={uploadImg === "" ? upload : uploadImg}
                    width={{ md: "25vw", base: "20vh" }}
                    maxHeight={{ md: "25vw", base: "20vh" }}
                    borderRadius="15%"
                    objectFit={"cover"}
                    alt="uploaded image"
                />
            </Flex>

            <Flex
                flex={1}
                backgroundColor={colorMode === "light" ? "#f9f9f9" : "#2c2c2c"}
                flexDir={"column"}
                borderRadius={"10%"}
                padding={"1vw"}
                maxW={{ md: "70%", base: "80vw" }}
                mb={3}
                alignItems={{ base: "center", md: "start" }}
            >
                <Text
                    ml="1%"
                    textAlign={"center"}
                    as="b"
                    fontSize={"2xl"}
                    mb={5}
                >
                    Item Information:
                </Text>

                <Flex
                    mb="5%"
                    ml="1%"
                    padding={2}
                    gap={3}
                    flexDir={{ base: "column", md: "row" }}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <MdDriveFileRenameOutline size={"1.3em"} />
                    <Text w={"100%"} ml="2%" fontSize={15}>
                        {newAddedItem.name}
                    </Text>
                </Flex>

                <Flex
                    mb="5%"
                    padding={2}
                    gap={3}
                    flexDir={{ base: "column", md: "row" }}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <MdOutlineDescription size={"1.3em"} />
                    <Text ml="2%" fontSize={15} w={"100%"}>
                        {newAddedItem.description}
                    </Text>
                </Flex>

                <Flex
                    mb="5%"
                    padding={2}
                    gap={3}
                    flexDir={{ base: "column", md: "row" }}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <FaMagnifyingGlass size={"1.3em"} />
                    <Text ml="2%" fontSize={15} w={"100%"}>
                        {newAddedItem.islost ? "LOST" : "FOUND"}
                        {", "}
                        {newAddedItem.type.toUpperCase()}
                    </Text>
                </Flex>

                <Flex
                    mb="5%"
                    padding={2}
                    gap={3}
                    flexDir={{ base: "column", md: "row" }}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <SlCalender size={"1.3em"} />
                    <Text ml="2%" fontSize={15} w={"100%"}>
                        {newAddedItem.itemdate}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CheckInfo;
