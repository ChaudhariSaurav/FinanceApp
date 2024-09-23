import React, { useEffect, useState } from 'react';
import AppLayout from '../layout/AppShell';
import useDataStore from '../zustand/userDataStore';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  VStack,
  Spinner,
  useToast,
} from '@chakra-ui/react';

const DashContent = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useDataStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set the greeting based on the current time
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good Morning!');
    } else if (currentHour < 14) {
      setGreeting('Good Afternoon!');
    } else if (currentHour < 18) {
      setGreeting('Good Evening!');
    } else {
      setGreeting('Good Night!');
    }
  }, []);

  useEffect(() => {
    const userId = user.uid;
    const userRef = ref(database, `users/${userId}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserData([data]);
      } else {
        toast({
          title: 'No Data Found',
          description: 'No user data available.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
      setLoading(false);
    }, (error) => {
      toast({
        title: 'Error Fetching Data',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid, toast]);

  return (
    <AppLayout>
      <Container maxW="container.xl" py={8}>
        {/* <Heading mb={6}>Dashboard</Heading> */}
		<Text fontSize="xl" mb={4}>
          {greeting}  🙌
        </Text>
        {loading ? (
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading...</Text>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={12}>
            {userData.map((user, index) => (
              <Card key={index} borderWidth={1} borderRadius="md" boxShadow="md">
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold">
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text>Customer Id: {user.customerId}</Text>
                  <Text>Loan for Apply: {user.loanValue}</Text>
                  <Text>Emis for: {user.totalEmiMonths} Months</Text>
                  <Text>Mobile: {user.mobile}</Text>
                  <Text>Date of Birth: {user.dateOfBirth}</Text>
                  <Text>Adhar Number: {user?.documents?.customer?.adharNumber}</Text>
                  <Text>Pancard Number: {user?.documents?.customer?.panCardNumber}</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </AppLayout>
  );
};

export default DashContent;
