import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Spinner,
  Center,
  Text,
  Heading,
  Link,
  Flex,
  Divider,
  HStack,
  VStack,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { userLogin } from '../service/auth';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser } from 'react-icons/fi';
import { LuAlertCircle } from 'react-icons/lu';
import { form } from 'framer-motion/client';

const SignInForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = "Customer ID or Email is required.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { identifier, password } = formData;
      const response = await userLogin(identifier, password);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.name}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        icon: <LuAlertCircle />,
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <Center minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Box
        maxW="md"
        w="full"
        bg={bgColor}
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        borderColor={borderColor}
      >
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Sign in to your account
          </Heading>
          <Text textAlign="center" color="gray.600">
            Welcome back! Please enter your details to login.
          </Text>
          {loading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.identifier}>
                  {/* <FormLabel>Customer ID or Email</FormLabel> */}
                  <FormLabel>Email Id</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiUser color="gray.300" />
                    </InputLeftElement>
                    <Input
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Enter your Customer ID or Email"
                    />
                  </InputGroup>
                  {errors.identifier && <Text color="red.500" fontSize="sm">{errors.identifier}</Text>}
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiLock color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                  </InputGroup>
                  {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
                </FormControl>

                <Flex justify="flex-end" width="100%">
                  <Link color="teal.500" href="/forgot-password" fontSize="sm">
                    Forgot Password?
                  </Link>
                </Flex>

                <Button
                  colorScheme="teal"
                  type="submit"
                  width="full"
                  isLoading={loading}
                  loadingText="Signing In"
                >
                  Sign In
                </Button>


                <Flex justify="center">
                  <Text>Don't have an account?</Text>
                  <Link href="/register" color="teal.500" ml={2}>
                    Register here
                  </Link>
                </Flex>
              </VStack>
            </form>
          )}
        </VStack>
      </Box>
    </Center>
  );
};

export default SignInForm;