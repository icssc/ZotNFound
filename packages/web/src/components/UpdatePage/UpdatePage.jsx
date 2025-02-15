import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  List,
  ListItem,
  Icon,
  Image,
  useColorModeValue,
  Container,
  Heading,
  Badge,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { SiInstagram } from "react-icons/si";
import { motion } from "framer-motion";
import updatepage from "../../assets/images/updatepage.png";

const MotionBox = motion(Box);

export default function UpdatePage() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState("");
  const [updates, setUpdates] = useState([
    {
      date: "9/25/2023",
      title: "Website Launch",
      description: "ZotnFound is now live! Explore our new features and start finding lost items.",
      items: [
        { type: "image", content: updatepage },
        { type: "text", content: "WEBSITE IS LIVE!" },
        { type: "text", content: "New user-friendly interface" },
        { type: "text", content: "Enhanced search capabilities" },
      ],
      tag: "Major Update",
    },
    // Add more updates here
  ]);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const tagColor = useColorModeValue("green.500", "green.200");

  const handleClick = () => {
    navigate("/");
  };

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    onOpen();
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <Flex direction="column" align="center">
          <Flex w="full" justifyContent="space-between" mb={8} align="center">
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={handleClick}
              size="lg"
              variant="outline"
            >
              Return Home
            </Button>
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="extrabold"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              ZotnFound Updates
            </Heading>
            <Button
              as="a"
              href="https://www.instagram.com/zotnfound/"
              target="_blank"
              leftIcon={<Icon as={SiInstagram} />}
              colorScheme="pink"
              size="lg"
            >
              Follow Us
            </Button>
          </Flex>

          <VStack spacing={12} align="stretch" w="full">
            {updates.map((update, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  borderWidth={1}
                  borderRadius="xl"
                  p={8}
                  borderColor={borderColor}
                  boxShadow="xl"
                  bg={cardBgColor}
                >
                  <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                      {update.tag}
                    </Badge>
                    <Text fontSize="lg" fontWeight="medium" color="gray.500">
                      {update.date}
                    </Text>
                  </Flex>
                  <Heading as="h3" size="xl" mb={4}>
                    {update.title}
                  </Heading>
                  <Text fontSize="lg" mb={6}>
                    {update.description}
                  </Text>
                  <Divider mb={6} />
                  <List spacing={4}>
                    {update.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex}>
                        <HStack align="flex-start" spacing={4}>
                          {item.type === "image" ? (
                            <Image
                              src={item.content}
                              maxW="200px"
                              alt="update image"
                              borderRadius="md"
                              cursor="pointer"
                              onClick={() => openImageModal(item.content)}
                              transition="transform 0.3s"
                              _hover={{ transform: "scale(1.05)" }}
                            />
                          ) : (
                            <Text fontSize="lg">• {item.content}</Text>
                          )}
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </MotionBox>
            ))}
          </VStack>
        </Flex>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Image src={selectedImage} w="100%" alt="selected image"/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
