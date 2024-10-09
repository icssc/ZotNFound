import { React, useState, useEffect } from "react";
import { Button, Text, Flex, Stack, Icon, Image, Box} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import zotnfound_win from "../../assets/images/zotnfound_win.png";
import zotnfound_ig from "../../assets/images/zotnfound_ig.png";
import small_logo from "../../assets/images/small_logo.png";
import login_page from "../../assets/images/login_page.jpg";
import about1 from "../../assets/images/about1.png";
import about2 from "../../assets/images/about2.png";
import about3 from "../../assets/images/about3.png";
import about4 from "../../assets/images/about4.png";
import { getItems, getLeaderboardCount } from "../../utils/ApiUtils";
import { motion } from "framer-motion";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

export default function AboutPage() {
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.screen.width);
  const [data, setData] = useState([]);
  const [leaderboardCount, setLeaderboardCount] = useState(0);
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  window.onresize = () => {
    setScreenWidth(window.screen.width);
  };

  const handleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    getItems().then((itemsData) => {
      setData(itemsData.data);
    });

    getLeaderboardCount().then((leaderboardData) => {
      setLeaderboardCount(leaderboardData.data);
    });
  }, []);

  return (
    <Box
      bg={bgColor}
      color={textColor}
      minHeight="100vh"
      overflowY="auto"
    >
      <Flex
        direction="column"
        align="center"
        maxWidth="1200px"
        margin="0 auto"
        minHeight="100vh"
      >
        <Flex
          as="header"
          width="100%"
          justify="space-between"
          align="center"
          py={4}
          px={8}
          position="sticky"
          top={0}
          bg={bgColor}
          zIndex={10}
        >
          <Button onClick={handleClick} leftIcon={<ArrowBackIcon />}>
            Return Home
          </Button>
          <Flex align="center">
            <Text fontSize="3xl" fontWeight="bold" mr={2}>
              ZotnFound
            </Text>
            <Image w="50px" h="50px" src={small_logo} />
          </Flex>
        </Flex>

        <Box width="100%" px={4} flex="1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text fontSize="5xl" fontWeight="bold" textAlign="center" my={8}>
              We are <Text as="span" color={accentColor}>ZotnFound</Text>
            </Text>
          </motion.div>

          <Flex
            justify="center"
            align="center"
            wrap="wrap"
            gap={8}
            my={12}
          >
            <StatCard
              label="Lost Items"
              value={data.filter((item) => item.islost).length}
              color="red.400"
            />
            <StatCard
              label="Found Items"
              value={data.filter((item) => !item.islost).length}
              color="green.400"
            />
            <StatCard
              label="Successful Returns"
              value={data.filter((item) => item.isresolved).length}
              color="yellow.400"
            />
            <StatCard
              label="Active Users"
              value={leaderboardCount}
              color="purple.400"
            />
          </Flex>

          <FeatureSection />

          <AboutSection />
        </Box>

        <Footer />
      </Flex>
    </Box>
  );
}

const StatCard = ({ label, value, color }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Flex
      direction="column"
      align="center"
      bg={useColorModeValue("white", "gray.800")}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      width="200px"
    >
      <Text fontSize="4xl" fontWeight="bold" color={color}>
        {value}
      </Text>
      <Text fontSize="lg" mt={2}>
        {label}
      </Text>
    </Flex>
  </motion.div>
);

const FeatureSection = () => (
  <Box my={16} width="100%">
    <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={8}>
      Explore how ZotnFound works
    </Text>
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
    >
      <SwiperSlide>
        <FeatureCard
          image={about1}
          title="Get Started - It's Simple & Easy"
          description="Log in with your UCI email and start listing lost & found items!"
        />
      </SwiperSlide>
      <SwiperSlide>
        <FeatureCard
          image={about2}
          title="Navigate Around the Map"
          description="Effortlessly navigate UCI's interactive map to efficiently search for lost and found items."
        />
      </SwiperSlide>
      <SwiperSlide>
        <FeatureCard
          image={about3}
          title="Search for Lost & Found Items"
          description="Utilize the easy to use filter and search bar to look up specific items."
        />
      </SwiperSlide>
      <SwiperSlide>
        <FeatureCard
          image={about4}
          title="Upload Your Items - Join the Community!"
          description="Show off the different items that you may have found or lost."
        />
      </SwiperSlide>
    </Swiper>
  </Box>
);

const FeatureCard = ({ image, title, description }) => (
  <Flex
    direction="column"
    align="center"
    bg={useColorModeValue("white", "gray.800")}
    p={6}
    borderRadius="lg"
    boxShadow="lg"
    height="100%"
  >
    <Image src={image} alt={title} mb={4} borderRadius="md" />
    <Text fontSize="xl" fontWeight="bold" mb={2}>
      {title}
    </Text>
    <Text textAlign="center">{description}</Text>
  </Flex>
);

const AboutSection = () => (
  <Flex
    direction={{ base: "column", md: "row" }}
    align="center"
    justify="space-between"
    wrap="wrap"
    my={16}
    px={8}
  >
    <Box flex={1} mr={{ base: 0, md: 8 }} mb={{ base: 8, md: 0 }}>
      <Text fontSize="3xl" fontWeight="bold" mb={4}>
        Origin of ZotnFound
      </Text>
      <Text>
        Many people are constantly losing their belongings, whether that be their phones, keys, or water bottles. This is especially true for UCI students on the UCI subreddit, where there are countless posts being created about lost and found items. Due to this problem, we decided to take matters into our own hands and created an Instagram account to help lost items return back to their original owners. We have so far helped over 10 people and gained over 300+ followers.
      </Text>
    </Box>
    <Image
      src={zotnfound_ig}
      alt="ZotnFound Instagram"
      borderRadius="lg"
      boxShadow="lg"
      maxWidth="400px"
    />
  </Flex>
);

const Footer = () => (
  <Flex
    as="footer"
    width="100%"
    justify="center"
    align="center"
    py={8}
    borderTop="1px"
    borderColor={useColorModeValue("gray.200", "gray.700")}
  >
    <Text>&copy; 2023 ZotnFound. All rights reserved.</Text>
  </Flex>
);