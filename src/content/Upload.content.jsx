// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   Box,
//   Button,
//   Container,
//   Divider,
//   Flex,
//   FormControl,
//   FormLabel,
//   Heading,
//   Input,
//   SimpleGrid,
//   Text,
//   Tabs,
//   Tab,
//   TabList,
//   TabPanels,
//   TabPanel,
//   useBreakpointValue,
//   useToast,
//   VStack,
//   HStack,
//   Badge,
//   IconButton,
//   AbsoluteCenter,
//   Select,
// } from "@chakra-ui/react";
// import { useDropzone } from "react-dropzone";
// import { ref, onValue, set } from "firebase/database";
// import { LuPlus, LuTrash, LuUpload } from "react-icons/lu";
// import AppLayout from "../layout/AppShell";
// import { database, storage } from "../config/firebase";
// import useDataStore from "../zustand/userDataStore";
// import { handleUploadFiles } from "../service/auth";

// const FileUploadSection = ({ index, filesArray, handleFileDrop, handleRemoveFile, handleUploadSectionRemove, isMobile }) => {
//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop: (acceptedFiles) => handleFileDrop(acceptedFiles, index),
//     accept: {
//       "application/pdf": [],
//       "image/*": [],
//     },
//   });

//   return (
//     <Box mb={4}>
//       <Box
//         {...getRootProps()}
//         border="2px dashed"
//         p={4}
//         borderColor="gray.300"
//         borderRadius="md"
//         mb={2}
//         textAlign="center"
//         cursor="pointer"
//         transition="all 0.3s"
//         _hover={{ borderColor: "blue.500", bg: "blue.50" }}
//       >
//         <input {...getInputProps()} />
//         <Text>Drag 'n' drop some files here, or click to select files</Text>
//       </Box>
//       {filesArray[index]?.length > 0 && (
//         <VStack align="stretch" spacing={2}>
//           <Text fontWeight="bold">Files to Upload:</Text>
//           {filesArray[index].map((file) => (
//             <Flex key={file.name} justifyContent="space-between" alignItems="center">
//               <HStack>
//                 <Badge colorScheme={file.name.endsWith(".pdf") ? "red" : "green"}>
//                   {file.name.endsWith(".pdf") ? "PDF" : "Image"}
//                 </Badge>
//                 <Text isTruncated maxWidth={isMobile ? "150px" : "300px"}>{file.name}</Text>
//               </HStack>
//               <IconButton
//                 icon={<LuTrash />}
//                 onClick={() => handleRemoveFile(file.name, index)}
//                 aria-label="Remove file"
//                 size="sm"
//                 colorScheme="red"
//                 variant="ghost"
//               />
//             </Flex>
//           ))}
//         </VStack>
//       )}
//       <Button mt={2} leftIcon={<LuTrash />} colorScheme="red" onClick={() => handleUploadSectionRemove(index)}>
//         Remove Section
//       </Button>
//     </Box>
//   );
// };

// const UploadDocument = () => {
//   const [customerDetails, setCustomerDetails] = useState({
//     adharNumber: "",
//     panCardNumber: "",
//   });

//   const [guarantorDetails, setGuarantorDetails] = useState({
//     adharNumber: "",
//     panCardNumber: "",
//     name: "",
//     relationship: "",
//   });

//   const [userData, setUserData] = useState(null);
//   const [filesArray, setFilesArray] = useState([[]]);
//   const toast = useToast();
//   const isMobile = useBreakpointValue({ base: true, md: false });
//   const { user } = useDataStore();

//   useEffect(() => {
//     const userId = user.uid;
//     const userRef = ref(database, `users/${userId}`);
//     onValue(userRef, (snapshot) => {
//       const data = snapshot.val();
//       setUserData(data);
//     });
//   }, [user]);

//   const handleCustomerChange = (e) => {
//     setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
//   };

//   const handleGuarantorChange = (e) => {
//     setGuarantorDetails({ ...guarantorDetails, [e.target.name]: e.target.value });
//   };

//   const handleFileDrop = useCallback((acceptedFiles, index) => {
//     setFilesArray((prevFilesArray) => {
//       const newFilesArray = [...prevFilesArray];
//       newFilesArray[index] = [...newFilesArray[index], ...acceptedFiles];
//       return newFilesArray;
//     });
//   }, []);

//   const handleRemoveFile = useCallback((fileName, index) => {
//     setFilesArray((prevFilesArray) => {
//       const newFilesArray = [...prevFilesArray];
//       newFilesArray[index] = newFilesArray[index].filter((file) => file.name !== fileName);
//       return newFilesArray;
//     });
//   }, []);

//   const handleUploadSectionRemove = useCallback((index) => {
//     setFilesArray((prevFilesArray) => {
//       const newFilesArray = prevFilesArray.filter((_, i) => i !== index);
//       return newFilesArray;
//     });
//   }, []);

//   const addFileUploadSection = useCallback(() => {
//     setFilesArray((prevFilesArray) => [...prevFilesArray, []]);
//   }, []);

//   // Function to upload files

//   const handleSubmitDocuments = async () => {
//     try {
//       await handleUploadFiles(filesArray, user);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     }
//   };

//   // Memoize FileUploadSection components
//   const fileUploadSections = useMemo(() => {
//     return filesArray.map((_, index) => (
//       <FileUploadSection
//         key={index}
//         index={index}
//         filesArray={filesArray}
//         handleFileDrop={handleFileDrop}
//         handleRemoveFile={handleRemoveFile}
//         handleUploadSectionRemove={handleUploadSectionRemove}
//         isMobile={isMobile}
//       />
//     ));
//   }, [filesArray, handleFileDrop, handleRemoveFile, handleUploadSectionRemove, isMobile]);

//   return (
//     <AppLayout>
//       <Container maxW="container.xl" py={8}>
//         <VStack spacing={8} align="stretch">
//           <Flex justifyContent="space-between" alignItems="center">
//             <Heading size="md">Document Upload</Heading>
//           </Flex>

//           <Tabs variant="enclosed" colorScheme="blue">
//             <TabList>
//               <Tab>Customer Details</Tab>
//               <Tab>Guarantor Details</Tab>
//             </TabList>

//             <TabPanels>
//               <TabPanel>
//                 <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
//                   <FormControl>
//                     <FormLabel>Aadhar Number</FormLabel>
//                     <Input
//                       type="text"
//                       name="adharNumber"
//                       value={customerDetails.adharNumber}
//                       onChange={handleCustomerChange}
//                       placeholder="1234-5678-9012"
//                     />
//                   </FormControl>

//                   <FormControl>
//                     <FormLabel>Pan Card Number</FormLabel>
//                     <Input
//                       type="text"
//                       name="panCardNumber"
//                       value={customerDetails.panCardNumber}
//                       onChange={handleCustomerChange}
//                       placeholder="ABCDE1234F"
//                     />
//                   </FormControl>
//                   {userData && (
//                     <FormControl>
//                       <FormLabel>Loan Amount</FormLabel>
//                       <Input
//                         type="number"
//                         name="loanAmount"
//                         value={userData.loanValue}
//                         disabled
//                         placeholder="Enter Loan Amount"
//                         min={1}
//                       />
//                     </FormControl>
//                   )}
//                 </SimpleGrid>
//               </TabPanel>

//               <TabPanel>
//                 <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
//                   <FormControl>
//                     <FormLabel>Aadhar Number</FormLabel>
//                     <Input
//                       type="text"
//                       name="adharNumber"
//                       value={guarantorDetails.adharNumber}
//                       onChange={handleGuarantorChange}
//                       placeholder="1234-5678-9012"
//                     />
//                   </FormControl>

//                   <FormControl>
//                     <FormLabel>Pan Card Number</FormLabel>
//                     <Input
//                       type="text"
//                       name="panCardNumber"
//                       value={guarantorDetails.panCardNumber}
//                       onChange={handleGuarantorChange}
//                       placeholder="ABCDE1234F"
//                     />
//                   </FormControl>

//                   <FormControl>
//                     <FormLabel>Name</FormLabel>
//                     <Input
//                       type="text"
//                       name="name"
//                       value={guarantorDetails.name}
//                       onChange={handleGuarantorChange}
//                       placeholder="Enter Guarantor Name"
//                     />
//                   </FormControl>

//                   <FormControl>
//                     <FormLabel>Relationship</FormLabel>
//                     <Select
//                       name="relationship"
//                       value={guarantorDetails.relationship}
//                       onChange={handleGuarantorChange}
//                       placeholder="Select Relationship"
//                     >
//                       <option value="Father">Father</option>
//                       <option value="Mother">Mother</option>
//                       <option value="Spouse">Spouse</option>
//                       <option value="Brother">Brother</option>
//                       <option value="Sister">Sister</option>
//                       <option value="Friend">Friend</option>
//                       <option value="Other">Other</option>
//                     </Select>
//                   </FormControl>
//                 </SimpleGrid>
//               </TabPanel>
//             </TabPanels>
//           </Tabs>

//           <Box position="relative" padding="2">
//             <Divider />
//             <AbsoluteCenter bg="white" px="4">
//               <Badge colorScheme="green">Customer Details</Badge>
//             </AbsoluteCenter>
//           </Box>
//           {userData && (
//             <Box>
//               <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
//                 <Text><strong>First Name:</strong> {userData.firstName}</Text>
//                 <Text><strong>Last Name:</strong> {userData.lastName}</Text>
//                 <Text><strong>Email:</strong> {userData.email}</Text>
//                 <Text><strong>CustomerID:</strong> {userData.customerId}</Text>
//                 <Text><strong>Date Of Birth:</strong> {userData.dateOfBirth}</Text>
//                 <Text><strong>Loan Amount:</strong> Rs:{userData.loanValue}</Text>
//               </SimpleGrid>
//             </Box>
//           )}

//           <Box>
//             <Box position="relative" padding="8">
//               <Divider />
//               <AbsoluteCenter bg="white" px="4">
//                 <Badge colorScheme="green">Upload Documents Here</Badge>
//               </AbsoluteCenter>
//             </Box>
//             {fileUploadSections}

//             <Flex justifyContent="space-between" mt={4} flexDirection={isMobile ? "column" : "row"}>
//               <Button
//                 leftIcon={<LuPlus />}
//                 onClick={addFileUploadSection}
//                 colorScheme="teal"
//                 mb={isMobile ? 2 : 0}
//                 width={isMobile ? "full" : "auto"}
//               >
//                 Add More Files
//               </Button>
//               <Button
//                 leftIcon={<LuUpload />}
//                 onClick={() => {
//                   // You can implement additional upload logic if needed here
//                 }}
//                 colorScheme="blue"
//                 width={isMobile ? "full" : "auto"}
//               >
//                 Upload Files
//               </Button>
//             </Flex>
//           </Box>

//           <Button mt={4} colorScheme="green" onClick={handleSubmitDocuments} size="lg" width="full">
//             Submit Documents
//           </Button>
//         </VStack>
//       </Container>
//     </AppLayout>
//   );
// };

// export default UploadDocument;


import React from 'react'
import CustomerDocumentUpload from '../pages/customerDocs'
import GuarantorDocumentUpload from '../pages/guranterDocs'

function UploadDocument() {
  return (
	<div>
	  <CustomerDocumentUpload/>
	  <GuarantorDocumentUpload/>
	</div>
  )
}

export default UploadDocument
