import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  useColorMode,
} from "@chakra-ui/react";

import logout from "../../../assets/logos/logout.svg";
import logout_white from "../../../assets/logos/logout_white.svg";
import subscribe from "../../../assets/logos/subscribe.svg";
import subscribe_white from "../../../assets/logos/subscribe_white.svg";
import unsubscribe from "../../../assets/logos/unsubscribe.svg";
import unsubscribe_white from "../../../assets/logos/unsubscribe_white.svg";
import userlogo from "../../../assets/logos/userlogo.svg";
import userlogo_white from "../../../assets/logos/userlogo_white.svg";
import yourposts from "../../../assets/logos/yourposts.svg";
import yourposts_white from "../../../assets/logos/yourposts_white.svg";

export default function ProfilePicDropdown({
  user,
  subscription,
  handleLogout,
  subscribeToggle,
  setFindFilter,
  onOpen,
}) {
  const { colorMode } = useColorMode();
  return (
    <Menu>
      <MenuButton>
        <Image
          src={user?.photoURL}
          h={{ base: "30px", md: "60px" }}
          w={{ base: "30px", md: "60px" }}
          borderRadius="100%"
          cursor={"pointer"}
          alt="profile picture"
        />
      </MenuButton>

      <MenuList zIndex={10000}>
        <MenuItem>
          <Image
            boxSize="1.2rem"
            src={colorMode === "dark" ? userlogo_white : userlogo}
            alt="user email"
            mr="12px"
          />
          {user?.email}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFindFilter((prev) => ({
              ...prev,
              isYourPosts: !prev.isYourPosts,
            }));
            onOpen();
          }}
        >
          <Image
            boxSize="1.2rem"
            src={colorMode === "dark" ? yourposts_white : yourposts}
            alt="logoutbutton"
            mr="12px"
          />
          Your Posts
        </MenuItem>

        <MenuItem onClick={subscribeToggle}>
          {subscription ? (
            <>
              <Image
                boxSize="1.2rem"
                src={colorMode === "dark" ? unsubscribe_white : unsubscribe}
                alt="Unsubscribe from newsletter button"
                mr="12px"
              />
              Unsubscribe
            </>
          ) : (
            <>
              <Image
                boxSize="1.2rem"
                src={colorMode === "dark" ? subscribe_white : subscribe}
                alt="Subscribe from newsletter button"
                mr="12px"
              />
              Subscribe
            </>
          )}
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <Image
            boxSize="1.2rem"
            src={colorMode === "dark" ? logout_white : logout}
            alt="logoutbutton"
            mr="12px"
          />
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
