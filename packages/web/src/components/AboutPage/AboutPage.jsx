import { React, useState, useEffect } from "react";
import {
  Button,
  Text,
  Flex,
  Image,
  Box,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import small_logo from "../../assets/images/small_logo.png";
import about1 from "../../assets/images/about1.png";
import about2 from "../../assets/images/about2.png";
import about3 from "../../assets/images/about3.png";
import about4 from "../../assets/images/about4.png";
import antAlmanacLogo from"../../assets/logos/antalmanac.svg";
import anteaterAPILogo from"../../assets/logos/anteaterapi.svg";
import zotMealLogo from"../../assets/logos/zotmeal.svg";
import zotMeetLogo from"../../assets/logos/zotmeet.svg";
import peterPortalLogo from"../../assets/logos/peterportal.svg";
import zotisticsLogo from"../../assets/logos/zotistics.svg";
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
  const [isLoading, setIsLoading] = useState(true);

  window.onresize = () => {
    setScreenWidth(window.screen.width);
  };

  const handleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [itemsResponse, leaderboardResponse] = await Promise.all([
          getItems(),
          getLeaderboardCount(),
        ]);
        setData(itemsResponse.data);
        setLeaderboardCount(leaderboardResponse.data + 500);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflowY="scroll"
      bg={bgColor}
      color={textColor}
      scrollSnapType="y proximity"
      scrollPaddingTop="0px"
      pb={20}
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
            <Image w="50px" h="50px" src={small_logo} alt="logo" />
          </Flex>
        </Flex>

        <Box width="100%" flex="1">

          <Box
            scrollSnapAlign="start" 
            scrollSnapMargin="20px"
            minHeight="100vh" 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Text fontSize="5xl" fontWeight="bold" textAlign="center" my={8}>
                We Are <Text as="span" color={accentColor}>ZotnFound</Text>.
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
          </Box>

          <Box scrollSnapAlign="start" scrollSnapMargin="10px" minHeight="100vh" display="flex" alignItems="center">
            <FeatureSection />
          </Box>

          <Box
            scrollSnapAlign="start"
            minHeight="100vh"
            display="flex"
            alignItems="center"
            ml={[0, 0, 40]} // Responsive margin: none on small screens
          >  
            <AboutSection />
          </Box>
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

const AboutSection = () => (
  <Flex
    direction="column"
    align="center"
    textAlign="left"
    mt={1500}
    mb={20}
    my={20}
    px={[4, 6, 8]} 
  >
    <Box 
      maxWidth="900px" 
      width="100%" 
      mx="auto"
      px={[4, 6, 8]} 
      textAlign={["center", "center", "left"]}
    >
      <Box maxW={["100%", "85%", "100%"]} mx="auto" textAlign={["center", "left", "left"]}></Box>
        <Text fontSize="3xl" mb={6} fontWeight="semibold" color="gray.400">
          Origin of <Text as="span" color="white" fontWeight="bold">ZotNFound</Text>.
        </Text>
        <Text fontSize="lg" lineHeight="1.8" mt={6}> 
          Many individuals frequently misplace their belongings, including phones, keys, and water bottles. 
          At UCI, this issue is particularly evident on the UCI subreddit, where numerous posts are dedicated 
          to lost and found items. Recognizing the need for a more efficient solution, we initially launched 
          an Instagram account to help reconnect lost items with their rightful owners. 
        </Text>
        <Text fontSize="lg" lineHeight="1.8" mt={6}> 
          The overwhelming response and growing community support—resulting in over 300 followers and 
          numerous successful returns—highlighted the demand for a more scalable and structured platform. 
          This led to the development of ZotNFound, an integrated lost-and-found system for UCI. 
        </Text>
        <Text fontSize="lg" lineHeight="1.8" mt={6}> 
          Today, ZotNFound is continually being developed, making the search for lost items easier and 
          less stressful for everyone.
        </Text>
      </Box>
    <AffiliatedSection />
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

const FeatureSection = () => (
  <Box my={16} width="100%">
    <Text 
      fontSize="3xl" 
      fontWeight="semibold" 
      textAlign="left" 
      mb={8}
      mt={35}
      pl={4}
      color="gray.400" 
    >
      Explore how <Text as="span" color="white" fontWeight="bold">ZotnFound</Text> works.
    </Text>

    <Swiper
      spaceBetween={20}
      slidesPerView={1.5}
      centeredSlides={true}
      loop={true}
      loopAdditionalSlides={2}
      watchSlidesProgress={true}
      grabCursor={true}
      modules={[Autoplay]}
      autoplay={{ 
        delay: 3000, 
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      }}
      pagination={false}
      speed={1000}
      style={{ paddingBottom: "40px" }}
    >
      <SwiperSlide style={{ width: "80vw", minHeight: "525px" }}>
        <FeatureCard
          image={about1}
          title="Getting Started"
          description="Lost or found something? Log in with your UCI email, join the ZotnFound community, and help lost items find their way back home."
        />
      </SwiperSlide>
      <SwiperSlide style={{ width: "100vw", height: "525px" }}>
        <FeatureCard
          image={about2}
          title="Navigating UCI Stress Free"
          description="Searching for your lost items is made easy with our interactive map. Search by name, use real-time markers, or filter by categories so you can find what's yours."
        />
      </SwiperSlide>
      <SwiperSlide style={{ width: "100vw", height: "525px" }}>
        <FeatureCard
          image={about3}
          title="Your Things Are Just a Search Away"
          description="No more endless backtracking. Simply search and filter what you've misplaced, and we'll show you where it is."
        />
      </SwiperSlide>
      <SwiperSlide style={{ width: "100vw", height: "525px" }}>
        <FeatureCard
          image={about4}
          title="Posting and Helping Out"
          description="Someone's out there looking for what you've found! Upload a picture and enter information about it so you can make their day."
        />
      </SwiperSlide>
    </Swiper>
  </Box>
);

const FeatureCard = ({ image, title, description }) => (
  <Flex
    direction="column"
    align="start"
    bg="gray.700" 
    p={6} 
    borderRadius="xl" 
    boxShadow="lg"
    color="gray.100" 
    width="100%"
    overflow="hidden"
  >
    <Text fontSize="xl" fontWeight="bold" mb={2} textAlign="left">
      {title}
    </Text>
    <Text textAlign="left" mb={4}>
      {description}
    </Text>
    <Image src={image} alt={title} mb={4} borderRadius="inherit"/>
  </Flex>
);


const affiliatedProjects = [
  { name: "AntAlmanac", logo: antAlmanacLogo, link: "https://antalmanac.com/" },
  { name: "Anteater API", logo: anteaterAPILogo, link: "https://docs.icssc.club/docs/developer/anteaterapi" },
  { name: "ZotMeal", logo: zotMealLogo, link: "https://www.zotmeal.com/" },
  { name: "ZotMeet", logo: zotMeetLogo, link: "https://zotmeet.com/" },
  { name: "PeterPortal", logo: peterPortalLogo, link: "https://https://peterportal.org/" },
  { name: "Zotistics", logo: zotisticsLogo, link: "https://zotistics.com/" },
];

const AffiliatedSection = () => (
  <Box
  width="100%"
  display="flex"
  justifyContent="center"
  px={[4, 6, 8]}
>
  <Box
    width="100%"
    maxWidth="900px"
    textAlign={["center", "center", "left"]}
    mt={125}
    mb={-20}
    py={4}
  >
    <Text fontSize="2xl" fontWeight="semibold" color="gray.400">
      Affiliated with{" "}
      <a 
        href="https://studentcouncil.ics.uci.edu/"  
        target="_blank" 
        rel="noopener noreferrer"
        style={{ color: "white", fontWeight: "bold", textDecoration: "none" }}
      >
        ICSSC
      </a>
    </Text>

    <Text fontSize="lg" color="gray.500" mb={4}>
      Explore other projects.
    </Text>

    <Flex justify={["center", "center", "left"]} gap={6} wrap="wrap">
      {affiliatedProjects.map((project, index) => (
        <a 
          key={index} 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Image 
            src={project.logo} 
            alt={project.name} 
            borderRadius="10px"
            border={"1.5px solid"}
            borderColor="gray.600"
            boxSize="55px"
            objectFit="cover"
            _hover={{ transform: "scale(1.1)", transition: "0.3s ease-in-out" }}
          />
        </a>
      ))}
    </Flex>
  </Box>

  </Box>
);
