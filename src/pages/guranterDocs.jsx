import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
  Text,
  Select,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { handleUploadFiles } from "../service/auth";
import useDataStore from "../zustand/userDataStore";
import AppLayout from "../layout/AppShell";

const GuarantorUpload = () => {
  const [guarantorDetails, setGuarantorDetails] = useState({
    adharNumber: "",
    panCardNumber: "",
    name: "",
    relationship: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const toast = useToast();
  const { user } = useDataStore();

  const handleGuarantorChange = (e) => {
    setGuarantorDetails({ ...guarantorDetails, [e.target.name]: e.target.value });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Append files
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  });

  const validateInputs = () => {
    const { adharNumber, panCardNumber, name, relationship } = guarantorDetails;
    if (!adharNumber || !panCardNumber || !name || !relationship) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!/^\d{12}$/.test(adharNumber)) {
      toast({
        title: "Invalid Aadhar Number",
        description: "Aadhar Number should be 12 digits",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panCardNumber)) {
      toast({
        title: "Invalid PAN Card Number",
        description: "PAN Card Number should be in the format ABCDE1234F",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true); // Start loading

    try {
      await handleUploadFiles(files, user, 'guarantor', guarantorDetails);
      toast({
        title: "Upload successful",
        description: "Guarantor documents and details have been successfully uploaded.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFiles([]);
      setGuarantorDetails({ adharNumber: "", panCardNumber: "", name: "", relationship: "" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <AppLayout>
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading size="lg">Guarantor Document Upload</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isRequired>
              <FormLabel>Guarantor Name</FormLabel>
              <Input
                name="name"
                value={guarantorDetails.name}
                onChange={handleGuarantorChange}
                placeholder="Enter Guarantor Name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Aadhar Number</FormLabel>
              <Input
                name="adharNumber"
                value={guarantorDetails.adharNumber}
                onChange={handleGuarantorChange}
                placeholder="123456789012"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>PAN Card Number</FormLabel>
              <Input
                name="panCardNumber"
                value={guarantorDetails.panCardNumber}
                onChange={handleGuarantorChange}
                placeholder="ABCDE1234F"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Relationship</FormLabel>
              <Select
                name="relationship"
                value={guarantorDetails.relationship}
                onChange={handleGuarantorChange}
                placeholder="Select Relationship"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          <Box
            {...getRootProps()}
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            textAlign="center"
            cursor="pointer"
          >
            <input {...getInputProps()} />
            <Text>Drag and drop files here, or click to select files</Text>
          </Box>

          {files.length > 0 && (
            <VStack align="stretch">
              <Text fontWeight="bold">Selected Files:</Text>
              {files.map((file) => (
                <Text key={file.name}>{file.name}</Text>
              ))}
            </VStack>
          )}

          <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading} loadingText="Uploading...">
            Upload Guarantor Documents
          </Button>

          {/* {loading && <Spinner />} */}
          {loading && (
           <VStack spacing={4}>
           <Spinner size="xl" color="teal.500" thickness="4px" />
           <Text fontSize="lg" fontWeight="medium">Processing Please wait...</Text>
         </VStack>
          )}
        </VStack>
      </Container>
    </AppLayout>
  );
};

export default GuarantorUpload;
