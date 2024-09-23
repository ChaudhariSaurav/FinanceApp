import React, { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Spacer,
  Alert,
  AlertIcon,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import AppLayout from '../layout/AppShell';
import { EmiData } from '../stores/emi';
import { LuChevronLeft, LuEye } from 'react-icons/lu';

const Installment = () => {
  const { installmentOrderId } = useParams(); // Get installment ID from the URL
  const { colorMode } = useColorMode(); // Get current color mode
  const selectedEMI = EmiData.find(emi => emi.installmentOrderId === installmentOrderId);
  const [emi, setEmi] = useState(selectedEMI); // Use state to manage EMI details

  const handlePrint = () => {
    window.print(); // Trigger the print dialog
  };

  const handleSetUnpaid = () => {
    if (emi) {
      setEmi({ ...emi, status: 'Unpaid', paymentDate: null, modeOfPayment: null, dateTimeOfPayment: null });
    }
  };

  const handleCancel = () => {
    if (emi) {
      setEmi({ ...emi, status: 'Cancelled', paymentDate: null, modeOfPayment: null, dateTimeOfPayment: null });
    }
  };

  const handleMakePayment = () => {
    alert('Payment processed successfully!'); // Placeholder alert
    setEmi({ ...emi, status: 'Paid', paymentDate: new Date().toLocaleString(), modeOfPayment: 'Online', dateTimeOfPayment: new Date() });
  };

  const handleFinePay = () => {
    alert('Fine paid successfully!'); // Placeholder alert
  };

  // Color values based on the current color mode
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('black', 'white');

  return (
    <AppLayout>
      <Breadcrumb spacing='8px' separator={<LuChevronLeft color='gray.500' />}>
        <BreadcrumbItem>
          <BreadcrumbLink href='/emis'>Go to Emi</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href='#'>Installment</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg" bg={bgColor} borderColor={borderColor}>
        <Heading mb={4} color={textColor}>Installment Details for Installment ID #{installmentOrderId}</Heading>

        {emi ? (
          <>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color={textColor}>Detail</Th>
                  <Th color={textColor}>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td color={textColor}>Installment Order ID</Td>
                  <Td color={textColor}>{emi.installmentOrderId}</Td>
                </Tr>
                <Tr>
                  <Td color={textColor}>Due Date</Td>
                  <Td color={textColor}>{emi.dueDate}</Td>
                </Tr>
                <Tr>
                  <Td color={textColor}>Amount Due</Td>
                  <Td color={textColor}>{emi.amountDue}</Td>
                </Tr>
                <Tr>
                  <Td color={textColor}>Status</Td>
                  <Td>
                    <Alert status={emi.status === 'Paid' ? 'success' : emi.status === 'Bounce' ? 'warning' : 'info'}>
                      <AlertIcon />
                      {emi.status}
                    </Alert>
                  </Td>
                </Tr>
                <Tr>
                  <Td color={textColor}>Payment Date</Td>
                  <Td color={textColor}>{emi.paymentDate || 'N/A'}</Td>
                </Tr>
                <Tr>
                  <Td color={textColor}>Mode of Payment</Td>
                  <Td color={textColor}>{emi.modeOfPayment || 'N/A'}</Td>
                </Tr>
                <Tr>
                  <Td color={textColor}>Date & Time of Payment</Td>
                  <Td color={textColor}>{emi.dateTimeOfPayment ? new Date(emi.dateTimeOfPayment).toLocaleString() : 'N/A'}</Td>
                </Tr>
              </Tbody>
            </Table>

            <Flex mt={4}>
              <Spacer />
              {emi.status === 'Unpaid' && (
                <Button onClick={handleMakePayment} colorScheme="green" mr={2}>
                  Make Payment
                </Button>
              )}
              {emi.status === 'Bounce' && (
                <Button onClick={handleFinePay} colorScheme="orange" mr={2}>
                  Fine Pay
                </Button>
              )}
              {emi.status === 'Paid' && (
                <Button onClick={handlePrint} colorScheme="blue" mr={2}>
                  <LuEye style={{ marginRight: '4px' }} /> Print
                </Button>
              )}
              <Button onClick={handleSetUnpaid} colorScheme="red" mr={2}>
                Mark as Unpaid
              </Button>
              <Button onClick={handleCancel} colorScheme="orange">
                Cancel
              </Button>
            </Flex>
          </>
        ) : (
          <Text color={textColor}>No details found for this installment.</Text>
        )}
      </Box>
    </AppLayout>
  );
};

export default Installment;
