import React from "react";
import { Menu, MenuButton, MenuList, MenuItem, Image } from "@chakra-ui/react";

import userlogo from "../../assets/logos/userlogo.svg";
import yourposts from "../../assets/logos/yourposts.svg";
import subscribe from "../../assets/logos/subscribe.svg";
import unsubscribe from "../../assets/logos/unsubscribe.svg";
import logout from "../../assets/logos/logout.svg";

export default function ProfilePicDropdown({
  user,
  subscription,
  handleLogout,
  subscribeToggle,
  setFindFilter,
  onOpen,
}) {
  return (
    <Menu>
      <MenuButton>
        <Image
          src={user?.photoURL}
          h={{ base: "27px", md: "60px" }}
          w={{ base: "27px", md: "60px" }}
          borderRadius="100%"
          cursor={"pointer"}
        />
      </MenuButton>

      <MenuList zIndex={10000}>
        <MenuItem>
          <Image boxSize="1.2rem" src={userlogo} alt="user email" mr="12px" />
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
            src={yourposts}
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
                src={unsubscribe}
                alt="Unsubscribe from newsletter button"
                mr="12px"
              />
              Unsubscribe
            </>
          ) : (
            <>
              <Image
                boxSize="1.2rem"
                src={subscribe}
                alt="Subscribe from newsletter button"
                mr="12px"
              />
              Subscribe
            </>
          )}
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <Image boxSize="1.2rem" src={logout} alt="logoutbutton" mr="12px" />
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
