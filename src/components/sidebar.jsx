import React, { useCallback } from 'react';
import {
  Box,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Text,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiGrid, 
  FiPieChart, 
  FiFile, 
  FiClock, 
  FiStar, 
  FiHelpCircle, 
  FiSettings, 
  FiChevronDown, 
  FiChevronRight,
  FiUser,
  FiLogOut
} from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const dashboardRoutes = [
  { icon: FiGrid, name: "Dashboard", path: "/dashboard" },
  { icon: FiPieChart, name: "Analysis", path: "/analysis" },
  { 
    icon: FiFile, 
    name: "Documents", 
    path: "/documents", 
    hasSubmenu: true,
    submenuItems: [
      { name: "Subitem 1", path: "/documents/subitem1" },
      { name: "Subitem 2", path: "/documents/subitem2" },
    ]
  },
  { icon: FiClock, name: "History", path: "/history" },
  { icon: FiStar, name: "Favorites", path: "/favorites" },
];

const bottomRoutes = [
  { icon: FiHelpCircle, name: "Help Center", path: "/help" },
  { icon: FiSettings, name: "Settings", path: "/settings" },
];

const Sidebar = ({ isOpen }) => {
  const { isOpen: isSubmenuOpen, onToggle: onSubmenuToggle } = useDisclosure();
  const location = useLocation();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const activeBgColor = useColorModeValue('blue.100', 'blue.800');
  const activeTextColor = useColorModeValue('blue.600', 'blue.200');

  const isActive = (path) => location.pathname === path;

  const renderMenuItem = useCallback(({ icon, name, path, hasSubmenu = false, onClick }) => (
    <Flex
      key={path}
      align="center"
      p={2}
      cursor="pointer"
      borderRadius="md"
      transition="all 0.2s"
      bg={isActive(path) ? activeBgColor : 'transparent'}
      color={isActive(path) ? activeTextColor : textColor}
      _hover={{ bg: isActive(path) ? activeBgColor : hoverBgColor }}
      onClick={onClick}
    >
      <Icon as={icon} mr={3} />
      <Text flex={1} fontWeight={isActive(path) ? 'bold' : 'normal'}>{name}</Text>
      {hasSubmenu && <Icon as={isSubmenuOpen ? FiChevronDown : FiChevronRight} />}
    </Flex>
  ), [isSubmenuOpen, activeBgColor, activeTextColor, textColor, hoverBgColor, location.pathname]);

  const renderSubmenuItems = useCallback((items) => (
    <VStack align="stretch" pl={6} mt={1}>
      {items.map((item) => (
        <Text 
          key={item.path}
          p={2} 
          cursor="pointer" 
          borderRadius="md" 
          _hover={{ bg: hoverBgColor }}
          color={isActive(item.path) ? activeTextColor : textColor}
          fontWeight={isActive(item.path) ? 'bold' : 'normal'}
        >
          {item.name}
        </Text>
      ))}
    </VStack>
  ), [hoverBgColor, activeTextColor, textColor]);

  return (
    <Box
      position="fixed"
      left={0}
      w={{ base: "full", md: 60 }}
      h="full"
      bg={bgColor}
      borderRight="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      transition="all 0.3s"
    >
      <VStack align="stretch" spacing={4} p={4}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('blue.500', 'blue.300')}>
            chakra PRO
          </Text>
        </Box>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input placeholder="Search" bg={useColorModeValue('white', 'gray.800')} />
        </InputGroup>

        <VStack align="stretch" spacing={1}>
          {dashboardRoutes.map((route) => (
            <React.Fragment key={route.path}>
              {renderMenuItem({
                icon: route.icon,
                name: route.name,
                path: route.path,
                hasSubmenu: route.hasSubmenu,
                onClick: route.hasSubmenu ? onSubmenuToggle : undefined
              })}
              {route.hasSubmenu && isSubmenuOpen && renderSubmenuItems(route.submenuItems)}
            </React.Fragment>
          ))}
        </VStack>

        <Divider />

        <VStack align="stretch" spacing={1}>
          {bottomRoutes.map((route) => renderMenuItem(route))}
        </VStack>
      </VStack>

      <Box position="absolute" bottom={0} w="full" p={4}>
        <Flex align="center">
          <Avatar size="sm" name="John Doe" src="https://bit.ly/dan-abramov" mr={2} />
          <Box flex={1}>
            <Text fontWeight="bold" color={textColor}>John Doe</Text>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>john@chakra-ui.com</Text>
          </Box>
          <Menu>
            <MenuButton as={Icon} icon={<FiChevronDown />} color={textColor} />
            <MenuList>
              <MenuItem icon={<FiUser />}>Profile</MenuItem>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    </Box>
  );
};

export default Sidebar;