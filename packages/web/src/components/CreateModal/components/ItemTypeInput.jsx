import React from 'react';
import { Flex, FormControl, FormLabel } from '@chakra-ui/react';
import TypeSelector from '../../TypeSelector/TypeSelector';
import LostFoundSwitch from '../LostFoundSwitch';

const ItemTypeInput = ({ setNewAddedItem, newAddedItem }) => {
    return (
        <Flex
            flexDir={"column"}
            w="100%"
            justifyContent={"center"}
            alignItems={"center"}
        >
            <FormControl>
                <FormLabel
                    ml={5}
                    fontSize="2xl"
                    mb={8}
                    textAlign={"center"}
                >
                    ❓ Select Item Type:
                </FormLabel>
            </FormControl>

            <TypeSelector
                setNewAddedItem={setNewAddedItem}
                newAddedItem={newAddedItem}
            />
            <FormControl>
                <Flex flexDir={"column"}>
                    <FormLabel
                        htmlFor="lost-item"
                        ml={5}
                        fontSize="2xl"
                        my={8}
                        textAlign={"center"}
                    >
                        🤔 Lost or Found Item?
                    </FormLabel>

                    <Flex
                        alignItems={"center"}
                        textAlign={"center"}
                        justify={"center"}
                        mb={"5%"}
                    >
                        <LostFoundSwitch
                            setNewAddedItem={setNewAddedItem}
                            newAddedItem={newAddedItem}
                        />
                    </Flex>
                </Flex>
            </FormControl>
        </Flex>
    );
};

export default ItemTypeInput;