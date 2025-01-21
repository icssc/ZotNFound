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
        Many people are constantly losing their belongings, whether that be
        their phones, keys, or water bottles. This is especially true for UCI
        students on the UCI subreddit, where there are countless posts being
        created about lost and found items. Due to this problem, we decided to
        take matters into our own hands and created an Instagram account to help
        lost items return back to their original owners. We have so far helped
        over 10 people and gained over 300+ followers.
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
