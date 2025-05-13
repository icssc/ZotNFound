import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function CreateMarkerConfirmModal({ isOpen, onClose, onConfirm, position }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const lat = position?.lat ? position.lat.toFixed(6) : "N/A";
  const lng = position?.lng ? position.lng.toFixed(6) : "N/A";

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor} color={textColor}>
        <ModalHeader>Confirm Location</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>
              Are you sure you want to create a marker at these coordinates?
            </Text>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
              Latitude: {lat}
              <br />
              Longitude: {lng}
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={onConfirm}>
            Confirm Location
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
