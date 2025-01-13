import React from 'react';
import { Box, Container, Text, HStack, Link, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverColor = useColorModeValue('gray.800', 'white');
  
  return (
    <Box
      as="footer"
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      py={4}
      position="fixed"
      bottom={0}
      width="100%"
      zIndex={2}
    >
      <Container
        maxW="container.xl"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color={textColor}>
          © {new Date().getFullYear()} ZotnFound. All rights reserved.
        </Text>
        <HStack spacing={6}>
          <Link
            href="/about"
            color={textColor}
            _hover={{ color: hoverColor, textDecoration: 'none' }}
          >
            About
          </Link>
          <Link
            href="https://github.com/icssc/ZotNFound"
            isExternal
            color={textColor}
            _hover={{ color: hoverColor, textDecoration: 'none' }}
          >
            GitHub
          </Link>
        </HStack>
      </Container>
    </Box>
  );
};

export default Footer; 