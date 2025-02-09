import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const DeleteConfirmationPopover = ({ onDelete, onClose }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="red" size={"lg"} gap={2}>
          <DeleteIcon /> Delete
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="semibold">Confirm Action</PopoverHeader>
        <PopoverBody>
          Are you sure you want to delete this item? This action cannot be
          undone
        </PopoverBody>
        <PopoverFooter display="flex" justifyContent="flex-end">
          <ButtonGroup size="sm">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onDelete}>
              Confirm
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteConfirmationPopover;
