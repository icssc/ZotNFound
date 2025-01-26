import React from "react";
import { Box, Flex, FormControl, Heading, Input, Text } from "@chakra-ui/react";

const ImageInput = (
    { handleItemImageChange, isLoading, loadingAnimation, uploadedImage },
) => {
    return (
        <FormControl>
            <Flex
                gap={5}
                alignItems="center"
                flexDirection="column"
                justifyContent="center"
            >
                <Flex justifyContent="center" alignItems="center" gap={3}>
                    {uploadedImage ? uploadedImage : (
                        <Dropzone
                            handleItemImageChange={handleItemImageChange}
                            uploadedImage={uploadedImage}
                        />
                    )}
                </Flex>
            </Flex>
        </FormControl>
    );
};

export default ImageInput;

function Dropzone({ handleItemImageChange }) {
    return (
        <Box maxW={{ base: "100%", md: "md" }} w="100%">
            <Box
                position="relative"
                h={{ base: "10rem", md: "12rem" }}
                cursor="pointer"
                borderWidth="2px"
                borderStyle="dashed"
                borderColor="gray.300"
                borderRadius="lg"
                bg="gray.500"
                color="gray.900"
                p={{ base: "3", md: "6" }}
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
                _hover={{
                    bg: "gray.100",
                    borderColor: "gray.400",
                }}
            >
                <Heading size="sm" mt="4" color="gray.600">
                    Upload a file
                </Heading>
                <Text mt="1" fontSize="sm" color="gray.700">
                    Drop your file here or click to select a file
                </Text>
                <input
                    type="file"
                    accept="image/*"
                    style={{
                        position: "absolute",
                        inset: 0,
                        cursor: "pointer",
                        opacity: 0,
                    }}
                    onChange={handleItemImageChange}
                />
            </Box>
        </Box>
    );
}
