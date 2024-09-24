import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Image,
  Link,
  Spinner,
  useToast,
  Badge,
  Divider,
  HStack,
  IconButton,
  Tooltip,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { ref, get } from "firebase/database";
import { database } from "../config/firebase";
import useDataStore from "../zustand/userDataStore";
import AppLayout from "../layout/AppShell";
import { LuFileText, LuDownload, LuImage } from "react-icons/lu";
import { images } from "../stores/images";

const FinalUploadedPage = () => {
  const [customerDocs, setCustomerDocs] = useState(null);
  const [guarantorDocs, setGuarantorDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useDataStore();
  const toast = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const customerRef = ref(
          database,
          `users/${user.uid}/documents/customer`
        );
        const guarantorRef = ref(
          database,
          `users/${user.uid}/documents/guarantor`
        );

        const [customerSnapshot, guarantorSnapshot] = await Promise.all([
          get(customerRef),
          get(guarantorRef),
        ]);

        if (customerSnapshot.exists()) {
          setCustomerDocs(customerSnapshot.val());
        }

        if (guarantorSnapshot.exists()) {
          setGuarantorDocs(guarantorSnapshot.val());
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Failed to fetch uploaded documents. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user, toast]);

  const handleDownload = (url, fileName) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        toast({
          title: "Download Error",
          description: "Failed to download the file. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const renderDocuments = (docs, title) => {
    if (!docs) return null;

    return (
      <Box>
        <Heading size="md" mb={4}>
          {title}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {docs.fileUrls.map((url, index) => (
            <Box
              key={index}
              borderWidth={1}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
            >
              <Box p={4} bg="gray.50">
                <HStack justifyContent="space-between">
                  <Badge
                    colorScheme={
                      url.toLowerCase().endsWith(".pdf") ? "red" : "green"
                    }
                  >
                    {url.toLowerCase().endsWith(".pdf") ? "PDF" : "Image"}
                  </Badge>
                  <Tooltip
                    label={
                      url.toLowerCase().endsWith(".pdf")
                        ? "Download PDF"
                        : "View Image"
                    }
                  >
                    <IconButton
                      icon={
                        url.toLowerCase().endsWith(".pdf") ? (
                          <LuDownload />
                        ) : (
                          <LuImage />
                        )
                      }
                      onClick={() =>
                        url.toLowerCase().endsWith(".pdf")
                          ? handleDownload(url, `document_${index + 1}.pdf`)
                          : window.open(url, "_blank")
                      }
                      aria-label={
                        url.toLowerCase().endsWith(".pdf")
                          ? "Download PDF"
                          : "View Image"
                      }
                      size="sm"
                    />
                  </Tooltip>
                </HStack>
              </Box>
              {url.toLowerCase().endsWith(".pdf") ? (
                <Box
                  p={4}
                  bg="gray.100"
                  textAlign="center"
                  m={5}
                  boxShadow={"xl"}
                >
                  <LuFileText size={48} />
                  <Text mt={2}>Document {index + 1}</Text>
                </Box>
              ) : (
                <Image
                  src={url}
                  alt={`Uploaded document ${index + 1}`}
                  objectFit="cover"
                  height="200px"
                  width="100%"
                />
              )}
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    );
  };

  const renderDetails = (details, title) => {
    if (!details) return null;

    return (
      <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
        <Heading size="md" mb={2}>
          {title}
        </Heading>
        <VStack align="stretch" spacing={2}>
          {Object.entries(details).map(
            ([key, value]) =>
              key !== "fileUrls" && (
                <HStack key={key} justifyContent="space-between">
                  <Text fontWeight="bold">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Text>
                  <Text>{value}</Text>
                </HStack>
              )
          )}
        </VStack>
      </Box>
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <Container centerContent>
          <Spinner size="xl" />
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading size="lg" textAlign="center">
            Uploaded Documents
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {renderDetails(customerDocs, "Customer Details")}
            {renderDetails(guarantorDocs, "Guarantor Details")}
          </SimpleGrid>

          <Box position="relative" padding="10">
            <Divider />
            <AbsoluteCenter bg="white" px="4">
              <Badge>Customer Document </Badge>
            </AbsoluteCenter>
          </Box>

          {renderDocuments(customerDocs, "Customer Documents")}

          <Box position="relative" padding="10">
            <Divider />
            <AbsoluteCenter bg="white" px="4">
              <Badge>Guranter Document </Badge>
            </AbsoluteCenter>
          </Box>

          {renderDocuments(guarantorDocs, "Guarantor Documents")}

          {!customerDocs && !guarantorDocs && (
            <Box
              textAlign="center"
              p={8}
              bg="transparent"
              borderRadius="md"
              transition="all 0.3s"
              _hover={{
                shadow: "md",
                borderColor: "white",
              }}
            >
              {images.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Image ${index + 1}`}
                  mb={4}
                  mx={"auto"}
                  maxW={"400px"}
                  objectFit={"contain"}
                />
              ))}

              <Text fontSize="xl">No documents have been uploaded yet.</Text>
            </Box>
          )}
        </VStack>
      </Container>
    </AppLayout>
  );
};

export default FinalUploadedPage;
