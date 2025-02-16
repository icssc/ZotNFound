import React, { useState } from "react";
import { AddIcon, CheckIcon } from "@chakra-ui/icons";
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
        finalFocusRef={btnRef}>
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
                  boxShadow={"lg"}>
                  You have {point} cookies 🍪
                </Text>
              </Flex>
            )}

            {leaderboard && showCookieInfo == false ? (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                flexDir={"column"}
                gap={5}>
                <Flex
                  w={{ base: "100%", md: "500px" }}
                  padding={5}
                  px={{ base: 3, md: 5 }}
                  background={"#5c5be5"}
                  color={"white"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  borderRadius={"xl"}
                  boxShadow={"7px 7px 14px #a8a8a8"}>
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
                  background={"white"}
                  color={"black"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  borderRadius={"xl"}
                  boxShadow={"7px 7px 14px #a8a8a8"}>
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
                  background={"white"}
                  color={"black"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  borderRadius={"xl"}
                  boxShadow={"7px 7px 14px #a8a8a8"}>
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
                  onClick={() => setShowCookieInfo(true)}>
                  Learn How It Works 🍪
                </Button>
              </Flex>
            ) : (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                flexDir={"column"}
                gap={3}>
                <Text as={"b"} fontSize={"4xl"} textDecoration={"underline"}>
                  How to Earn Cookies
                </Text>
                <Text as={"b"} fontSize={"xl"}>
                  Cookies are a way to track contributions and engagement with
                  ZotNFound!
                </Text>
                <Flex
                  justifyContent={"center"}
                  gap={10}
                  alignItems={"center"}
                  flexDir={"row"}>
                  {/* Cookies for posting an Item */}
                  <Flex
                    bg={"white"}
                    boxShadow={"7px 7px 14px grey"}
                    borderRadius={"xl"}
                    p={5}
                    gap={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDir={"column"}>
                    <Flex
                      w={"50px"}
                      h={"50px"}
                      background={"#74a2fa"}
                      borderRadius={"50%"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      color={"white"}>
                      <AddIcon />
                    </Flex>
                    <Text as={"b"} fontSize={"xl"} color={"black"}>
                      Post a lost item
                    </Text>
                    <Text fontSize={"lg"} color={"black"}>
                      +1🍪
                    </Text>
                  </Flex>

                  {/* Cookies for finding an Item */}
                  <Flex
                    bg={"white"}
                    boxShadow={"7px 7px 14px grey"}
                    borderRadius={"xl"}
                    p={5}
                    gap={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDir={"column"}>
                    <Flex
                      w={"125px"}
                      h={"50px"}
                      bg="navy"
                      color="white"
                      borderRadius={"full"}
                      justifyContent="space-between">
                      <Flex
                        width={"40%"}
                        bg={"white"}
                        border={"2px black solid"}
                        borderRadius={"full"}></Flex>
                      <Flex justifyContent={"center"} py={5} w={"60%"}>
                        <Text fontSize="1xl">FOUND👐</Text>
                      </Flex>
                    </Flex>
                    <Text as={"b"} fontSize={"xl"} color={"black"}>
                      Find an Item
                    </Text>
                    <Text fontSize={"lg"} color={"black"}>
                      +3🍪
                    </Text>
                  </Flex>

                  {/* Cookies for resolving a found Item */}
                  <Flex
                    bg={"white"}
                    boxShadow={"7px 7px 14px grey"}
                    borderRadius={"xl"}
                    p={5}
                    gap={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDir={"column"}>
                    <Flex
                      bg={"#86efac"}
                      w={125}
                      h={50}
                      gap={2}
                      borderRadius={"15"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      color={"black"}
                      fontSize={"2xl"}>
                      <CheckIcon /> Resolve
                    </Flex>
                    <Text as={"b"} fontSize={"xl"} color={"black"}>
                      Resolving a <span style={{ color: "blue" }}>FOUND</span>{" "}
                      Item
                    </Text>
                    <Text fontSize={"lg"} color={"black"}>
                      +5🍪
                    </Text>
                  </Flex>

                  {/* Cookies for resolving a lost Item */}
                  <Flex
                    bg={"white"}
                    boxShadow={"7px 7px 14px grey"}
                    borderRadius={"xl"}
                    p={5}
                    gap={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDir={"column"}>
                    <Flex
                      bg={"#86efac"}
                      w={125}
                      h={50}
                      gap={2}
                      borderRadius={"15"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      color={"black"}
                      fontSize={"2xl"}>
                      <CheckIcon /> Resolve
                    </Flex>
                    <Text as={"b"} fontSize={"xl"} color={"black"}>
                      Resolving a <span style={{ color: "red" }}>LOST</span>{" "}
                      Item
                    </Text>
                    <Text fontSize={"lg"} color={"black"}>
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
                  onClick={() => setShowCookieInfo(false)}>
                  🡰 Back to Leaderboard
                </Button>
              </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
