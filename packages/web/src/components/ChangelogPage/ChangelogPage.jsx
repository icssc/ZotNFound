import React from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Divider,
  Badge,
  useColorModeValue,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const ChangelogPage = () => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const changes = [
    {
      version: "1.1.0",
      date: "2024-03-20",
      type: "feature",
      emoji: "⚡",
      title: "Performance & Search Update",
      description:
        "Major improvements to search functionality and overall performance",
      message: `Dear ZotNFound Community,

We've been listening closely to your feedback about search and performance. Many of you mentioned that finding specific items could be faster and more intuitive. Today, we're excited to bring you a major update that addresses these concerns and more. We've completely revamped our search system and made significant performance improvements across the platform. We hope these changes make your experience with ZotNFound even better!

With gratitude,
The ZotNFound Team`,
      changes: `
### Search Enhancements 🎯
- Added **search functionality** improvements with fuzzy matching
- Instant results now appear as you type
- Better ranking algorithm for search results

### Performance Boost 🚀
- Enhanced map clustering for better performance with **large numbers** of items
- Reduced initial load time by 50%
- Optimized image loading and caching

### New Features 🌟
- Smart filtering system for item categories
- Advanced date range selection
- Improved notification system
      `,
    },
    {
      version: "1.0.1",
      date: "2024-03-10",
      type: "fix",
      emoji: "🔧",
      title: "Bug Fixes & Mobile Improvements",
      description: "Critical fixes and mobile experience enhancement",
      message: `Hello Anteaters!

Thank you for all your bug reports and suggestions over the past few weeks. We know some of you experienced issues with the mobile version and email login - we hear you! This update focuses on fixing these pain points and making the mobile experience smoother for everyone. Your patience and feedback have been invaluable in helping us improve ZotNFound.

Best wishes,
The ZotNFound Team`,
      changes: `
### Authentication Updates 🔐
- Fixed login issues with certain email providers
- Improved **authentication flow** and error handling
- Added remember me functionality

### Mobile Experience 📱
- Improved mobile responsiveness across all pages
- Better touch interactions for map
- Enhanced mobile navigation

### UI Improvements 🎨
- Updated item marker icons for better visibility
- New color scheme for better contrast
- Improved accessibility features
      `,
    },
    {
      version: "1.0.0",
      date: "2024-03-01",
      type: "release",
      emoji: "🎉",
      title: "Initial Release",
      description: "Launching ZotNFound to the UCI community",
      message: `Dear UCI Community,

We're thrilled to officially launch ZotNFound! This project started from a simple Instagram page where we helped connect lost items with their owners, and now it's grown into a full-fledged platform for our UCI community. We built this with love and care, thinking about how we could make the process of finding lost items as simple and stress-free as possible.

We're excited to start this journey with you and can't wait to hear your thoughts and suggestions. Remember, ZotNFound is more than just a lost and found platform - it's a community initiative built by Anteaters, for Anteaters.

Zot Zot Zot!
The ZotNFound Team`,
      changes: `
### Platform Launch 🚀
- Initial release of ZotNFound platform
- Complete end-to-end lost and found system
- Integrated UCI authentication

### Core Features 💫
- Lost and found item posting with **image support**
- Secure UCI email authentication system
- Interactive campus map with **real-time updates**

### Community Features 🤝
- Direct messaging between users
- Item status tracking
- Community guidelines and safety features
      `,
    },
  ];

  const getBadgeColor = (type) => {
    switch (type) {
      case "feature":
        return "green";
      case "fix":
        return "orange";
      case "release":
        return "blue";
      default:
        return "gray";
    }
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headerBg = useColorModeValue("blue.50", "blue.900");

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" py={12}>
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Tooltip label="Back to Home" placement="right">
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              position="fixed"
              top={4}
              left={4}
              aria-label="Back to home"
              size="lg"
              rounded="full"
              colorScheme="blue"
              opacity={0.8}
              _hover={{ opacity: 1 }}
            />
          </Tooltip>

          <Box textAlign="left" mb={8}>
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-l, blue.400, purple.500)"
              bgClip="text"
              mb={4}
            >
              ZotNFound Updates
            </Heading>
            <Text
              fontSize="xl"
              color={useColorModeValue("gray.600", "gray.300")}
            >
              Keep track of the latest improvements and features
            </Text>
          </Box>

          {changes.map((change, index) => (
            <Box
              key={index}
              bg={bgColor}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
              shadow="lg"
              transition="all 0.2s"
              _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
            >
              <Box bg={headerBg} p={6} textAlign="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mb={4}
                >
                  <Text fontSize="5xl" mb={3}>
                    {change.emoji}
                  </Text>
                  <Box>
                    <Heading size="lg" mb={2}>
                      {change.title}
                    </Heading>
                    <Text color="gray.500">{change.description}</Text>
                  </Box>
                </Box>
                <Badge
                  colorScheme={getBadgeColor(change.type)}
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {change.type}
                </Badge>
                <Text color="gray.500" fontSize="md" mt={3}>
                  Version {change.version} • {formatDate(change.date)}
                </Text>
              </Box>

              <Box p={6}>
                <Box
                  className="markdown-content"
                  textAlign="left"
                  whiteSpace="pre-line"
                  mb={6}
                  color={useColorModeValue("gray.700", "gray.300")}
                  fontStyle="italic"
                  borderLeft="4px solid"
                  borderColor="blue.400"
                  pl={4}
                >
                  {change.message}
                </Box>
                <Box className="markdown-content" textAlign="left">
                  <ReactMarkdown>{change.changes}</ReactMarkdown>
                </Box>
              </Box>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

export default ChangelogPage;
