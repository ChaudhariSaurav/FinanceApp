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
  FiLogOut,
  FiCreditCard
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const dashboardRoutes = [
  { icon: FiGrid, name: "Dashboard", path: "/dashboard" },
  // { icon: FiPieChart, name: "Analysis", path: "/analysis" },
  { 
    icon: FiFile, 
    name: "Documents", 
    path: "/documents", 
    hasSubmenu: true,
    submenuItems: [
      { name: "Customer Document", path: "/documents/customer" },
      { name: "Guranter Document", path: "/documents/guranter" },
      { name: "Total Document", path: "/documents/final" },
    ]
  },
  { icon: FiCreditCard, name: "Emis", path: "/emis" },
  // { icon: FiClock, name: "History", path: "/history" },
  // { icon: FiStar, name: "Favorites", path: "/favorites" },
];

const bottomRoutes = [
  { icon: FiHelpCircle, name: "Help Center", path: "/help" },
];

const Sidebar = ({ isOpen }) => {
  const { isOpen: isSubmenuOpen, onToggle: onSubmenuToggle } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate(); 
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const activeBgColor = useColorModeValue('blue.100', 'blue.800');
  const activeTextColor = useColorModeValue('blue.600', 'blue.200');

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  const renderMenuItem = useCallback(({ icon, name, path, hasSubmenu = false }) => (
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
      onClick={() => {
        if (hasSubmenu) {
          onSubmenuToggle();
        } else {
          navigate(path); 
        }
      }}
    >
      <Icon as={icon} mr={3} />
      <Text flex={1} fontWeight={isActive(path) ? 'bold' : 'normal'}>{name}</Text>
      {hasSubmenu && <Icon as={isSubmenuOpen ? FiChevronDown : FiChevronRight} />}
    </Flex>
  ), [isSubmenuOpen, activeBgColor, activeTextColor, textColor, hoverBgColor, location.pathname, navigate]);

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
          onClick={() => navigate(item.path)} 
        >
          {item.name}
        </Text>
      ))}
    </VStack>
  ), [hoverBgColor, activeTextColor, textColor, navigate]);

  return (
    <Box
      position="fixed"
      left={0}
      w={{ base: "full", md: 60 }}
      h="100vh"
      overflowY="auto"
      bg={bgColor}
      borderRight="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      transition="all 0.3s"
      zIndex={1000}
    >
      <VStack align="stretch" spacing={4} p={4}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('blue.500', 'blue.300')}>
           Ad Finance
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
    </Box>
  );
};

export default Sidebar;
