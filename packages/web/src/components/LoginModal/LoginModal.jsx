import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Image,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState, useCallback } from "react";

import small_logo from "../../assets/images/small_logo.png";

import DataContext from "../../context/DataContext";
import google_logo from "../../assets/logos/google_logo.png";
import { UserAuth } from "../../context/AuthContext";
import Cookies from "universal-cookie";

export default function LoginModal() {
  const { isLoginModalOpen, onLoginModalClose } = useContext(DataContext);
  const [isAttempt, setIsAttempt] = useState(false);
  // const { googleSignIn, user } = UserAuth();
  const [user, setUser] = useState(null, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  const cookies = new Cookies();

  const signInGoogle = useCallback(async () => {
    console.log("Sign in with Google");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_AWS_API_ENDPOINT}/googleOAuth`
      );
      const url = res.data.googleAuthorizationUrl;

      cookies.set("state", res.data.state);
      cookies.set("codeVerifier", res.data.codeVerifier);

      window.location.href = url;
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  // Google sign-in functionality - redirects to Google sign-in page
  const handleSignInGoogle = useCallback(() => {
    signInGoogle();
    setTimeout(() => {
      setIsAttempt((prev) => true);
    }, 5000);
  }, [signInGoogle]);

  // The sign-in error alert - appears when user tries to sign in with non-UCI email
  const signInErrorAlert = (
    <Alert status="error" justifyContent={"center"} flexDir={"column"} gap={2}>
      <Flex>
        <AlertIcon />
        <AlertTitle>Can't sign in?</AlertTitle>
      </Flex>
      <AlertDescription>Please sign in with @uci.edu</AlertDescription>
    </Alert>
  );

  // The welcome message text - appears when user successfully signs in (AKA user has an @uci.edu email)
  const welcomeMessage = (
    <Text fontSize="2xl" as="b">
      Welcome back Anteater!
    </Text>
  );
  return (
    <>
      <Modal
        isOpen={isLoginModalOpen && !user}
        onClose={onLoginModalClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="2xl" as="b">
              Login
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDir="column"
              gap={8}
            >
              <Image src={small_logo} width="15vh" />
              {isAttempt ? signInErrorAlert : welcomeMessage}
              <Button
                onClick={handleSignInGoogle}
                variant={"outline"}
                colorScheme="darkblue"
                size="lg"
              >
                <Flex gap={2} alignItems="center">
                  <Image width="20px" height="20px" src={google_logo} />
                  Sign in with Google
                </Flex>
              </Button>
            </Flex>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
