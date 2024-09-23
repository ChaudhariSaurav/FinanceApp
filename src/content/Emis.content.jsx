import React, { useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  HStack,
  Select,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { LuEye } from "react-icons/lu";
import AppLayout from "../layout/AppShell";
import Pagination from "../components/pagination";
import { useNavigate } from "react-router-dom";
import { EmiData } from "../stores/emi";

const EMIPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = EmiData.filter((emi) => {
    const matchesStatus = statusFilter === "All" || emi.status === statusFilter;
    const matchesSearch = emi.installmentId.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <Badge colorScheme="green">{status}</Badge>;
      case "Unpaid":
        return <Badge colorScheme="orange">{status}</Badge>;
      case "Bounce":
        return <Badge colorScheme="red">{status}</Badge>;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <Box p={4}>
        <Heading mb={4}>EMI Details</Heading>
        <HStack mb={4}>
          <Select
            placeholder="Filter by status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Bounce">Bounce</option>
          </Select>
          <HStack position="relative">
            <Input
              placeholder="Search by installment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              pr="4.5rem"
            />
            <Icon as={FiSearch} position="absolute" right="1.5rem" />
          </HStack>
        </HStack>
        <Box
          overflowX="auto"
          maxH="60vh"
          borderWidth="1px"
          borderRadius="md"
          mb={4}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Installment Order ID</Th>
                <Th>Due Date</Th>
                <Th>Amount Due</Th>
                <Th>Status</Th>
                <Th>Payment Date</Th>
                <Th>Payment Mode</Th>
                <Th>Date & Time of Payment</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((emi) => (
                <Tr key={emi.installmentId}>
                  <Td>{emi.installmentOrderId}</Td>
                  <Td>{emi.dueDate}</Td>
                  <Td>{emi.amountDue}</Td>
                  <Td>{getStatusBadge(emi.status)}</Td>
                  <Td>{emi.paymentDate || "N/A"}</Td>
                  <Td>{emi.modeOfPayment || "N/A"}</Td>
                  <Td>{emi.dateTimeOfPayment || "N/A"}</Td>
                  <Td>
                    <Button
                      onClick={() => {
                        const installmentId = emi.installmentOrderId;
                        if (installmentId) {
                          navigate(`/installment/${installmentId}`);
                        } else {
                          console.error('Installment ID is undefined');
                        }
                      }}
                      variant="outline"
                      colorScheme="blue"
                      leftIcon={<LuEye />}
                    >
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Box>
    </AppLayout>
  );
};

export default EMIPage;
