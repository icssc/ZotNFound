import React from "react";
import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
import Calendar from "react-calendar";

const DateInput = ({ isLost, date, handleItemDateChange }) => {
    return (
        <FormControl>
            <FormLabel
                px="10%"
                fontSize="xl"
                textAlign={"center"}
                mb={"5%"}
            >
                {isLost ? "📅 Lost Date:" : "📅 Found Date:"}
            </FormLabel>

            <Flex
                w="100%"
                alignItems={"center"}
                justifyContent={"center"}
                px={{ md: "10%", base: "3%" }}
            >
                <Calendar
                    className={"react-calendar"}
                    calendarType="US"
                    onChange={handleItemDateChange}
                    value={date}
                />
            </Flex>
        </FormControl>
    );
};

export default DateInput;
