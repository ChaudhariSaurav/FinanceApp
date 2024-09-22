import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
} from '@chakra-ui/react';
import { FiMenu, FiMoon, FiSun, FiUser, FiMail, FiLogOut } from 'react-icons/fi';
import useDataStore from '../zustand/userDataStore';
import { userSignOut } from '../service/auth';

const Header = ({ onToggleSidebar }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const appName = import.meta.env.VITE_APP_NAME || 'Admin Panel';
  const { user } = useDataStore();
  const handleLogout = async () => {
    try {
      await userSignOut();
      window.location.href = ('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  

  return (
    <Box
      as="header"
      bg={useColorModeValue('white', 'gray.800')}
      px={4}
      position="fixed"
      w="full"
      zIndex="sticky"
      borderBottomWidth={2}
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      h="60px"
      boxShadow="sm"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggleSidebar}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
            mr={2}
          />
          <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
            {appName}
          </Text>
        </Flex>

        <Flex alignItems="center">
          <IconButton
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
            mr={4}
          />

          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            >
              <Avatar
                size={'sm'}
                src={`https://avatars.dicebear.com/api/male/username.svg`}
              />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>
               Name
              </MenuItem>
              <MenuItem icon={<FiMail />}>
                Email
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;