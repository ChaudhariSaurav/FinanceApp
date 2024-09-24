import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../config/firebase";
import useDataStore from "../zustand/userDataStore";
import AppLayout from "../layout/AppShell";
import { EmiImages } from "../stores/images";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Image,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
} from "@chakra-ui/react";
import { LuChevronLeft, LuCreditCard } from "react-icons/lu";
import { handlePayment } from "../service/auth";

const EmiDetails = () => {
  const { month } = useParams();
  const [emi, setEmi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const user = useDataStore((state) => state.user);
  const toast = useToast();
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    const fetchEmiDetails = async () => {
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const emiRef = ref(database, `installments/${user.uid}/${month}`);
        const snapshot = await get(emiRef);
    
        if (snapshot.exists()) {
          setEmi({ ...snapshot.val(), month: parseInt(month, 10) });
        } else {
          setError("EMI details not found");
        }
      } catch (err) {
        setError("Failed to fetch EMI details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmiDetails();
  }, [user, month]);

  const handleMakePayment = async () => {
    if (!user || !emi) return;

    setPaymentProcessing(true);
    try {
      const result = await handlePayment(user.uid, emi.month, emi.amount );

      if (result.success) {
        const updatedData = {
          ...emi,
          status: "Paid",
          paymentDate: new Date().toISOString(),
        };

        await ref(database, `installments/${user.uid}/${month}`).set(updatedData);
        await ref(database, `users/${user.uid}/paymentStatus`).set({
          lastPayment: updatedData.paymentDate,
          status: "Paid",
        });

        setEmi(updatedData);

        toast({
          title: "Payment Successful",
          description: `₹${emi.amount.toFixed(2)} paid successfully for month ${emi.month}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          navigate("/emi/pay");
        }, 1000);
      } else {
        throw new Error(result.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an issue processing your payment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const colorScheme =
      status === "Paid" ? "green" : status === "Pending" ? "orange" : "red";
    return <Badge colorScheme={colorScheme}>{status}</Badge>;
  };

  if (loading) {
    return (
      <AppLayout>
        <Box textAlign="center" my={20}>
          <Spinner size="xl" />
          <Text mt={4}>Loading EMI details...</Text>
        </Box>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Alert status="error" mt={4}>
          <AlertIcon />
          {error}
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box p={4}>
        <Breadcrumb
          spacing="8px"
          separator={<LuChevronLeft color="gray.500" />}
          mb={4}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/emi/pay">
              EMI Payments
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Installment {month}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
  
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bg={bgColor}
          borderColor={borderColor}
        >
          <Box p={6}>
            <Heading as="h1" size="xl" mb={6} color={textColor}>
              Installment Details for Month {month}
            </Heading>
  
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <VStack align="stretch" spacing={4}>
                <Stat>
                  <StatLabel>Amount Due</StatLabel>
                  <StatNumber>₹{emi.amount !== undefined ? emi.amount.toFixed(2) : 0}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Status</StatLabel>
                  <StatNumber>{getStatusBadge(emi.status)}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>{emi.status === "Paid" ? "Paid On" : "Due Date"}</StatLabel>
                  <StatNumber>
                    {emi.status === "Paid" 
                      ? formatDate(emi.paymentDate) 
                      : formatDate(emi.dueDate)}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatHelpText>Transaction ID: {emi.razorpay_id}</StatHelpText>
                </Stat>
              </VStack>
  
              <VStack align="stretch" spacing={4}>
                {emi.status === "Paid" ? (
                  <Button
                    colorScheme="green"
                    onClick={handlePrint}
                    size="lg"
                  >
                    Print Receipt
                  </Button>
                ) : (
                  <Button
                    leftIcon={<LuCreditCard />}
                    colorScheme="blue"
                    onClick={handleMakePayment}
                    size="lg"
                    isLoading={paymentProcessing}
                    loadingText="Processing Payment"
                  >
                    Make Payment
                  </Button>
                )}
                <Text fontSize="sm" color={textColor}>
                  Please ensure timely payment to avoid late fees.
                </Text>
              </VStack>
            </SimpleGrid>
          </Box>
        </Box>
  
        <Box mt={8}>
          {!emi ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {EmiImages.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`EMI Information ${index + 1}`}
                  borderRadius="md"
                  objectFit="cover"
                  w="100%"
                  h={{ base: "200px", md: "250px" }}
                />
              ))}
            </SimpleGrid>
          ) : null}
        </Box>
      </Box>
    </AppLayout>
  );
  
};

export default EmiDetails;
