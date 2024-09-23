import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { auth, database, storage } from "../config/firebase";
import { FirebaseError } from "firebase/app";
import useDataStore from "../zustand/userDataStore";

const generateCustomerId = (loanType, totalEmiMonths, currentYear, firstName, lastName, position) => {
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const yearSuffix = String(currentYear).slice(-2);
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const positionCategory = position <= 10 ? 'A' : position <= 100 ? 'B' : position <= 10000 ? 'C' : 'D';
  
  return `${currentMonth}${loanType}${totalEmiMonths}${yearSuffix}${firstInitial}${lastInitial}${positionCategory}`;
};

const handleUploadFiles = async (filesArray, user, documentType, userDetails) => {
  try {
    const docRef = ref(database, `users/${user.uid}/documents/${documentType}`);
    const docSnapshot = await get(docRef);

    if (docSnapshot.exists()) {
      throw new Error("Documents already uploaded for this category.");
    }

    const uploadPromises = [];
    const fileUrls = [];

    filesArray.forEach((file) => {
      const fileRef = storageRef(storage, `documents/${user.uid}/${documentType}/${file.name}`);
      uploadPromises.push(uploadBytes(fileRef, file));
    });

    const uploadResults = await Promise.all(uploadPromises);
    
    for (const result of uploadResults) {
      const url = await getDownloadURL(result.ref);
      fileUrls.push(url);
    }

    await set(ref(database, `users/${user.uid}/documents/${documentType}`), {
      ...userDetails,
      fileUrls,
      uploadedAt: new Date().toISOString(),
    });

    return fileUrls;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};

const registerUser = async (email, password, firstName, lastName, dateOfBirth, mobile, photo, loanType, totalEmiMonths, loanValue) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;

    let photoURL = null;
    if (photo) {
      const profileImageRef = storageRef(storage, `profileImages/${uid}/${photo.name}`);
      await uploadBytes(profileImageRef, photo);
      photoURL = await getDownloadURL(profileImageRef);
      await updateProfile(user, { photoURL });
    }

    const userCountRef = ref(database, 'users');
    const userSnapshot = await get(userCountRef);
    const position = userSnapshot.exists() ? Object.keys(userSnapshot.val()).length + 1 : 1;

    const currentYear = new Date().getFullYear();
    const customerId = generateCustomerId(loanType, totalEmiMonths, currentYear, firstName, lastName, position);

    const existingSnapshot = await get(userCountRef);
    if (existingSnapshot.exists() && Object.values(existingSnapshot.val()).some(user => user.customerId === customerId)) {
      throw new Error("Customer ID already exists. Please try again.");
    }

    await set(ref(database, `users/${uid}`), {
      uid,
      firstName,
      lastName,
      email,
      mobile,
      dateOfBirth,
      photoURL,
      customerId,
      loanType,
      totalEmiMonths,
      loanValue,
      position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { user: { id: uid, name: firstName, email: user.email || '' }, customerId };
  } catch (error) {
    console.error("Error during registration:", error);
    throw new Error(error instanceof FirebaseError ? error.message : "An unknown error occurred during registration.");
  }
};

const userLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    useDataStore.getState().setUser(user);
    window.location.replace("/dashboard");
    return user;
  } catch (error) {
    console.error("Error during login:", error);
    switch (error.code) {
      case "auth/user-not-found":
        throw new Error("User not found");
      case "auth/wrong-password":
        throw new Error("Incorrect password");
      default:
        throw new Error("An error occurred during login. Please try again.");
    }
  }
};

const userSignOut = async () => {
  try {
    await signOut(auth);
    useDataStore.getState().clearUser();
    localStorage.removeItem("UserData");
    localStorage.clear();
    window.location.replace("/");
  } catch (error) {
    console.error("Error during sign out:", error);
    throw new Error("An error occurred during sign out. Please try again.");
  }
};

export {
  registerUser,
  userLogin,
  handleUploadFiles,
  userSignOut,
};