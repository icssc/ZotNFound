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
                    <Dropzone handleItemImageChange={handleItemImageChange} />
                </Flex>
                {isLoading ? loadingAnimation : uploadedImage}
            </Flex>
        </FormControl>
    );
};

export default ImageInput;

function Dropzone({ handleItemImageChange }) {
    return (
        <Box style={{ maxWidth: "md", width: "100%" }}>
            <Box
                style={{
                    position: "relative",
                    height: "12rem",
                    cursor: "pointer",
                    borderWidth: "2px",
                    borderStyle: "dashed",
                    borderColor: "#CBD5E0",
                    borderRadius: "0.5rem",
                    backgroundColor: "#111",
                    color: "white",
                    padding: "1.5rem",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Heading size="sm" style={{ marginTop: "1rem", color: "#CBD5E0" }}>
                    Upload a file
                </Heading>
                <Text style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#718096" }}>
                    Drop your file here or click to select a file
                </Text>
                <input  
                    type="file"
                    style={{
                        position: "absolute",
                        inset: 0,
                        cursor: "pointer",
                        opacity: 0
                    }}
                    onChange={handleItemImageChange}
                />
            </Box>
        </Box>
    );
}
