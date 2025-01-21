import React from "react";
import { Flex, FormControl, Input } from "@chakra-ui/react";

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
                    <Input
                        type="file"
                        accept="image/*"
                        multiple
                        width="38%"
                        sx={{
                            "::file-selector-button": {
                                height: 10,
                                padding: 0,
                                mr: 4,
                                background: "none",
                                border: "none",
                                fontWeight: "bold",
                            },
                        }}
                        onChange={handleItemImageChange}
                    />
                </Flex>
                {isLoading ? loadingAnimation : uploadedImage}
            </Flex>
        </FormControl>
    );
};

export default ImageInput;
