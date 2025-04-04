import React, { useState } from "react";
import { AddIcon, CheckIcon, ArrowBackIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Text,
  Image,
  Button,
  Divider,
} from "@chakra-ui/react";
import goldmedal from "../../../assets/images/gold-medal.png";

export default function Leaderboard({
  isOpen,
  onOpen,
  onClose,
  btnRef,
  leaderboard,
  user,
}) {
  const [showCookieInfo, setShowCookieInfo] = useState(false);
  let point =
    user && leaderboard
      ? leaderboard.find((u) => u.email === user.email)
      : null;

  if (point) {
    point = point.points;
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="top"
        onClose={() => {
          onClose();
          setShowCookieInfo(false);
        }}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent height={"60vh"}>
          <DrawerCloseButton />

          <DrawerBody>
            <Flex justify={"center"} mb={4}>
              <Text as={"b"} fontSize={"3xl"}>
                Ranking 🏆
              </Text>
            </Flex>
            {user && (
              <Flex justifyContent={"center"} alignItems={"center"} mb={5}>
                <Text
                  as={"b"}
                  fontSize={"xl"}
                  color={"white"}
                  background={"brown"}
                  p={3}
                  borderRadius={"xl"}
                  boxShadow={"lg"}
                >
                  You have {point} cookies 🍪
                </Text>
              </Flex>
            )}

            {leaderboard && showCookieInfo == false ? (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                flexDir={"column"}
                gap={5}
              >
                <Flex
                  w={{ base: "100%", md: "500px" }}
                  padding={5}
                  px={{ base: 3, md: 5 }}
                  background={
                    "linear-gradient(135deg, #5c5be5 0%, #4545dd 100%)"
                  }
                  color={"white"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  borderRadius={"xl"}
                  boxShadow={"0px 8px 20px rgba(92, 91, 229, 0.3)"}
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="transform 0.2s ease"
                >
                  <Flex alignItems={"center"} gap={{ base: 2, md: 5 }}>
                    <Text as={"b"} fontSize={"4xl"}>
                      1
                    </Text>
                    <Text as={"b"} fontSize={{ base: "sm", md: "lg" }}>
                      {leaderboard[0]?.email}
                    </Text>
                  </Flex>

                  <Flex alignItems={"center"}>
                    <Text as={"b"} fontSize={{ base: "3xl", md: "4xl" }}>
                      {leaderboard[0]?.points}
                    </Text>
                    <Image
                      className="gold-medal"
                      src={goldmedal}
                      alt="gold medal"
                      w={"5vh"}
                      h={"5vh"}
                    />
                  </Flex>
                </Flex>
                <Flex
                  w={{ base: "100%", md: "500px" }}
                  p={{ base: 3, md: 5 }}
                  background={
                    "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)"
                  }
                  color={"black"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  borderRadius={"xl"}
                  boxShadow={"0px 8px 15px rgba(0, 0, 0, 0.1)"}
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="transform 0.2s ease"
                >
                  <Flex alignItems={"center"} gap={{ base: 2, md: 5 }}>
                    <Text as={"b"} fontSize={"4xl"}>
                      2
                    </Text>
                    <Text as={"b"} fontSize={{ base: "sm", md: "lg" }}>
                      {leaderboard[1]?.email}
                    </Text>
                  </Flex>

                  <Flex>
                    <Text as={"b"} fontSize={{ base: "3xl", md: "4xl" }}>
                      {leaderboard[1]?.points} 🍪
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  w={{ base: "100%", md: "500px" }}
                  p={{ base: 3, md: 5 }}
                  background={
                    "linear-gradient(135deg,rgb(252, 234, 132) 0%,rgb(244, 214, 121) 100%)"
                  }
                  color={"black"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  borderRadius={"xl"}
                  boxShadow={"0px 8px 15px rgba(255, 193, 7, 0.2)"}
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="transform 0.2s ease"
                >
                  <Flex alignItems={"center"} gap={{ base: 2, md: 5 }}>
                    <Text as={"b"} fontSize={"4xl"}>
                      3
                    </Text>
                    <Text as={"b"} fontSize={{ base: "sm", md: "lg" }}>
                      {leaderboard[2]?.email}
                    </Text>
                  </Flex>

                  <Flex>
                    <Text as={"b"} fontSize={{ base: "3xl", md: "4xl" }}>
                      {leaderboard[2]?.points} 🍪
                    </Text>
                  </Flex>
                </Flex>
                <Button
                  ref={btnRef}
                  colorScheme="blue"
                  my={5}
                  size="lg"
                  rightIcon={<AddIcon />}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  transition="all 0.2s ease"
                  onClick={() => setShowCookieInfo(true)}
                >
                  Learn How It Works 🍪
                </Button>
              </Flex>
            ) : (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                flexDir={"column"}
                gap={6}
                py={4}
              >
                <Text
                  as={"b"}
                  fontSize={"4xl"}
                  textDecoration={"underline"}
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  bgClip="text"
                >
                  How to Earn Cookies
                </Text>
                <Text as={"b"} fontSize={"xl"} textAlign="center" maxW="600px">
                  Cookies are a way to track contributions and engagement with
                  ZotNFound!
                </Text>

                <Flex
                  justifyContent={"center"}
                  gap={10}
                  alignItems={"stretch"}
                  flexDir={{ base: "column", md: "row" }}
                  w="full"
                  maxW="1200px"
                  px={4}
                >
                  {/* Cookies for posting an Item */}
                  <Flex
                    flex="1"
                    bg={"white"}
                    boxShadow={"0px 8px 20px rgba(0, 0, 0, 0.1)"}
                    borderRadius={"xl"}
                    p={6}
                    gap={3}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDir={"column"}
                    _hover={{ transform: "translateY(-4px)" }}
                    transition="transform 0.2s ease"
                  >
                    <Flex
                      w={"60px"}
                      h={"60px"}
                      background={
                        "linear-gradient(135deg, #74a2fa 0%, #4545dd 100%)"
                      }
                      borderRadius={"50%"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      color={"white"}
                    >
                      <AddIcon boxSize={6} />
                    </Flex>
                    <Text as={"b"} fontSize={"xl"} color={"black"}>
                      Post a lost item
                    </Text>
                    <Text
                      fontSize={"lg"}
                      color={"black"}
                      p={2}
                      bg="gray.100"
                      borderRadius="full"
                    >
                      +1🍪
                    </Text>
                  </Flex>

                  {/* Cookies for finding an Item */}
                  <Flex
                    flex="1"
                    bg={"white"}
                    boxShadow={"0px 8px 20px rgba(0, 0, 0, 0.1)"}
                    borderRadius={"xl"}
                    p={6}
                    gap={3}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDir={"column"}
                    _hover={{ transform: "translateY(-4px)" }}
                    transition="transform 0.2s ease"
                  >
                    <Flex
                      w={"125px"}
                      h={"50px"}
                      bg="navy"
                      color="white"
                      borderRadius={"full"}
                      justifyContent="space-between"
                    >
                      <Flex
                        width={"40%"}
                        bg={"white"}
                        border={"2px black solid"}
                        borderRadius={"full"}
                      ></Flex>
                      <Flex justifyContent={"center"} py={5} w={"60%"}>
                        <Text fontSize="1xl">FOUND👐</Text>
                      </Flex>
                    </Flex>
                    <Text as={"b"} fontSize={"xl"} color={"black"}>
                      Find an Item
                    </Text>
                    <Text
                      fontSize={"lg"}
                      color={"black"}
                      p={2}
                      bg="gray.100"
                      borderRadius="full"
                    >
                      +3🍪
                    </Text>
                  </Flex>

                  {/* Cookies for resolving a found Item */}
                  <Flex
                    flex="1"
                    bg={"white"}
                    boxShadow={"0px 8px 20px rgba(0, 0, 0, 0.1)"}
                    borderRadius={"xl"}
                    p={6}
                    gap={3}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDir={"column"}
                    _hover={{ transform: "translateY(-4px)" }}
                    transition="transform 0.2s ease"
                  >
                    <Flex
                      bg={"#86efac"}
                      w={125}
                      h={50}
                      gap={2}
                      borderRadius={"15"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      color={"black"}
                      fontSize={"2xl"}
                    >
                      <CheckIcon /> Resolve
                    </Flex>
                    <Text as={"b"} fontSize={"xl"} color={"black"}>
                      Resolving a <span style={{ color: "blue" }}>FOUND</span>{" "}
                      Item
                    </Text>
                    <Text
                      fontSize={"lg"}
                      color={"black"}
                      p={2}
                      bg="gray.100"
                      borderRadius="full"
                    >
                      +5🍪
                    </Text>
                  </Flex>

                  {/* Cookies for resolving a lost Item */}
                  <Flex
                    flex="1"
                    bg={"white"}
                    boxShadow={"0px 8px 20px rgba(0, 0, 0, 0.1)"}
                    borderRadius={"xl"}
                    p={6}
                    gap={3}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDir={"column"}
                    _hover={{ transform: "translateY(-4px)" }}
                    transition="transform 0.2s ease"
                  >
                    <Flex
                      bg={"#86efac"}
                      w={125}
                      h={50}
                      gap={2}
                      borderRadius={"15"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      color={"black"}
                      fontSize={"2xl"}
                    >
                      <CheckIcon /> Resolve
                    </Flex>
                    <Text as={"b"} fontSize={"xl"} color={"black"}>
                      Resolving a <span style={{ color: "red" }}>LOST</span>{" "}
                      Item
                    </Text>
                    <Text
                      fontSize={"lg"}
                      color={"black"}
                      p={2}
                      bg="gray.100"
                      borderRadius="full"
                    >
                      +2🍪
                    </Text>
                  </Flex>
                </Flex>
                <Flex justifyContent={"center"} alignItems={"center"} gap={5}>
                  <Text as={"b"} fontSize={"xl"}>
                    The more cookies you have, the higher you rank! 🏆
                  </Text>
                </Flex>

                <Button
                  ref={btnRef}
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<ArrowBackIcon />}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  transition="all 0.2s ease"
                  onClick={() => setShowCookieInfo(false)}
                >
                  Back to Leaderboard
                </Button>
              </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
