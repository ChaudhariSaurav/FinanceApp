import React, { useEffect, useState } from "react";
import AppLayout from "../layout/AppShell";
import useDataStore from "../zustand/userDataStore";
import { database } from "../config/firebase";
import { ref, onValue } from "firebase/database";
import {
  Container,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  VStack,
  Spinner,
  Progress,
  useToast,
} from "@chakra-ui/react";

const DashContent = () => {
  const [userData, setUserData] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [installments, setInstallments] = useState([]); // Added state for installments
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useDataStore();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Set greeting based on the time of day
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning!");
    } else if (currentHour < 14) {
      setGreeting("Good Afternoon!");
    } else if (currentHour < 18) {
      setGreeting("Good Evening!");
    } else {
      setGreeting("Good Night!");
    }
  }, []);

  useEffect(() => {
    const userId = user.uid;
    const userRef = ref(database, `users/${userId}`);
    const paymentHistoryRef = ref(database, `users/${userId}/paymentHistory`);
    const installmentsRef = ref(database, `installments/${userId}`);

    // Fetch user data
    const unsubscribeUser = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserData([data]);
      } else {
        toast({
          title: "No Data Found",
          description: "No user data available.",
          status: "warning",
        });
      }
    });

    // Fetch payment history
    const unsubscribePaymentHistory = onValue(paymentHistoryRef, (snapshot) => {
      const historyInfo = snapshot.val();
      if (historyInfo) {
        setPaymentHistory(Object.values(historyInfo));
      }
    });

    // Fetch installments data
    const unsubscribeInstallments = onValue(installmentsRef, (snapshot) => {
      const installmentsInfo = snapshot.val();
      if (installmentsInfo) {
        setInstallments(Object.values(installmentsInfo));
      }
      setLoading(false); // Set loading false here to indicate data fetching is done
    });

    return () => {
      unsubscribeUser();
      unsubscribePaymentHistory();
      unsubscribeInstallments();
    };
  }, [user.uid, toast]);

  const calculateTotalPaid = () => {
    return paymentHistory.reduce(
      (acc, item) => acc + (item?.amountPaid || 0),
      0
    );
  };

  const calculateTotalEmi = () => {
    return userData.length > 0 ? userData[0].totalEmiMonths || 0 : 0;
  };

  const calculateProgress = () => {
    const totalEmi = calculateTotalEmi();
    const totalPaidEmi = paymentHistory.length;
    return totalEmi > 0 ? (totalPaidEmi / totalEmi) * 100 : 0;
  };

  const getNextInstallmentDate = () => {
    const dueDateNow = new Date();
    const nextInstallment = installments
      .filter((installment) => new Date(installment.dueDate) > dueDateNow)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

    return nextInstallment ? nextInstallment.dueDate : null;
  };

  const nextInstallmentDate = getNextInstallmentDate();

  return (
    <AppLayout>
      <Container maxW="container.xl" py={8}>
        <Text fontSize="xl" mb={4}>
          {userData.map((user, index) => (
            <Text key={index} fontSize="lg" fontWeight="bold">
              {greeting} 🙌 {user.firstName} {user.lastName}
            </Text>
          ))}
        </Text>

        {loading ? (
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading...</Text>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12}>
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={12}>
              {userData.map((user, index) => (
                <Card
                  key={index}
                  borderWidth={1}
                  borderRadius="md"
                  boxShadow="md"
                >
                  <CardBody>
                    <Text>Customer Id: {user.customerId}</Text>
                    <Text>Loan for Apply: {user.loanValue}</Text>
                    <Text>Emis for: {user.totalEmiMonths} Months</Text>
                    <Text>Mobile: {user.mobile}</Text>
                    <Text>Date of Birth: {user.dateOfBirth}</Text>
                    <Text>
                      Aadhar Number: {user?.documents?.customer?.adharNumber}
                    </Text>
                    <Text>
                      Pancard Number: {user?.documents?.customer?.panCardNumber}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
            <Card borderWidth={1} borderRadius="md" boxShadow="md">
              <CardBody>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Payment Info
                </Text>
                {paymentHistory.length > 0 ? (
                  <>
                    <Text>
                      Total Installments: {calculateTotalEmi()} Months
                    </Text>
                    <Text>Total Amount Paid: {calculateTotalPaid()}</Text>
                    <Progress
                      value={calculateProgress()}
                      colorScheme="blue"
                      size="sm"
                      thickness="4px"
                      mt={4}
                    />
                    <Text mt={2} fontSize="md" fontWeight="bold">
                      {`${Math.round(calculateProgress())}% Completed`}
                    </Text>
                    {nextInstallmentDate && (
                      <Text mt={2} fontSize="md" fontWeight="bold" color="teal">
                        Next Installment Due Date: {new Date(nextInstallmentDate).toLocaleDateString()}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text>No payment information available.</Text>
                )}
              </CardBody>
            </Card>
          </SimpleGrid>
        )}
      </Container>
    </AppLayout>
  );
};

export default DashContent;
