import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  HStack,
  Link,
  useColorMode,
  Box,
  Divider,
} from "@chakra-ui/react";

import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import logo from "../../../assets/images/small_logo.png";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { RiNewspaperLine } from "react-icons/ri";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiNews } from "react-icons/bi";
import { FaInstagram } from "react-icons/fa";

export default function ZotNFoundLogoText() {
  const [screenWidth, setScreenWidth] = useState(window.screen.width);
  const { colorMode } = useColorMode();

  window.onresize = () => {
    setScreenWidth(window.screen.width);
  };

  return (
    <Flex
      alignItems="center"
      w="100%"
      className="med"
      justify="space-between"
      px={4}
    >
      {/* Logo Section - Only visible on desktop */}
      <Flex
        alignItems="center"
        minW={{ base: "180px", md: "250px" }}
        display={{ base: "none", md: "flex" }}
      >
        <Image
          width={{ base: "35px", md: "50px" }}
          src={logo}
          alt="ZotNFound Logo"
          display={screenWidth < 350 ? "None" : "inline"}
        />
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Button
            variant="ghost"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            p={2}
          >
            ZotNFound
          </Button>
        </Link>
      </Flex>

      {/* Desktop Navigation Links */}
      <HStack
        spacing={6}
        display={{ base: "none", md: "flex" }}
        ml="auto"
        mr={4}
      >
        <Link
          as={RouterLink}
          to="/changelog"
          display="flex"
          alignItems="center"
          gap={2}
          color={colorMode === "dark" ? "gray.300" : "gray.600"}
          _hover={{ color: "blue.500" }}
          fontSize="md"
        >
          <RiNewspaperLine />
          Updates
        </Link>

        <Link
          as={RouterLink}
          to="/update"
          display="flex"
          alignItems="center"
          gap={2}
          color={colorMode === "dark" ? "gray.300" : "gray.600"}
          _hover={{ color: "blue.500" }}
          fontSize="md"
        >
          <BiNews />
          News
        </Link>

        <Link
          as={RouterLink}
          to="/about"
          display="flex"
          alignItems="center"
          gap={2}
          color={colorMode === "dark" ? "gray.300" : "gray.600"}
          _hover={{ color: "blue.500" }}
          fontSize="md"
        >
          <AiOutlineInfoCircle />
          About
        </Link>

        <Link
          href="https://www.instagram.com/zotnfound/"
          target="_blank"
          display="flex"
          alignItems="center"
          gap={2}
          color={colorMode === "dark" ? "gray.300" : "gray.600"}
          _hover={{ color: "blue.500" }}
          fontSize="md"
        >
          <FaInstagram />
          Instagram
        </Link>
      </HStack>

      {/* Mobile Menu with Logo */}
      <Box display={{ base: "block", md: "none" }} w="100%">
        <Menu autoSelect={false} placement="bottom-end">
          <Flex justify="space-between" align="center" w="100%">
            <Flex align="center">
              <Image
                width="35px"
                src={logo}
                alt="ZotNFound Logo"
                display={screenWidth < 350 ? "None" : "inline"}
                mr={2}
              />
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
                fontSize="xl"
                fontWeight="bold"
                p={2}
              >
                ZotNFound
              </MenuButton>
            </Flex>
          </Flex>

          <MenuList zIndex={10000}>
            <MenuItem
              as={RouterLink}
              to="/changelog"
              icon={<RiNewspaperLine />}
            >
              Updates
            </MenuItem>
            <MenuItem as={RouterLink} to="/update" icon={<BiNews />}>
              News
            </MenuItem>
            <MenuItem
              as={RouterLink}
              to="/about"
              icon={<AiOutlineInfoCircle />}
            >
              About
            </MenuItem>
            <Divider my={2} />
            <MenuItem
              as="a"
              href="https://www.instagram.com/zotnfound/"
              target="_blank"
              icon={<FaInstagram />}
            >
              Instagram
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
}
