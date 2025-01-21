import React from "react";
import {
    Flex,
    FormControl,
    FormLabel,
    Input,
    Textarea,
} from "@chakra-ui/react";

const MissingItemInput = (
    { newAddedItem, handleItemNameChange, handleItemDescriptionChange },
) => {
    return (
        <Flex width={{ md: "50%", base: "90%" }}>
            <FormControl>
                <FormLabel fontSize="2xl">🔑 Item Name:</FormLabel>
                <Input
                    variant="outline"
                    placeholder="Ex: Airpods Pro, ..."
                    size="lg"
                    mb={5}
                    border="2px solid gray"
                    value={newAddedItem.name}
                    onChange={handleItemNameChange}
                />
                <FormLabel fontSize="2xl">📝Description of Item:</FormLabel>
                <Textarea
                    variant="outline"
                    placeholder="Ex: Lost in ICS 31 Lec, ..."
                    size="lg"
                    border="2px solid gray"
                    value={newAddedItem.description}
                    onChange={handleItemDescriptionChange}
                    rows="5"
                />
            </FormControl>
        </Flex>
    );
};

export default MissingItemInput;


