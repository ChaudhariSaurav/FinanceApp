import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import { get, ref,set, query, orderByChild, equalTo } from "firebase/database";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { auth, database, storage } from "../config/firebase";
import { FirebaseError } from "firebase/app";
import useDataStore from "../zustand/userDataStore";

// Function to generate customer ID
const generateCustomerId = (loanType, totalEmiMonths, currentYear, firstName, lastName, position) => {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const yearSuffix = String(currentYear).slice(-2);
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    const positionCategory = position <= 10 ? 'A' : position <= 100 ? 'B' : position <= 10000 ? 'C' : 'D';
    
    return `${currentMonth}${loanType}${totalEmiMonths}${yearSuffix}${firstInitial}${lastInitial}${positionCategory}`;
};

// Function to register a new user
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
        if (existingSnapshot.exists()) {
            const users = existingSnapshot.val();
            const customerIdExists = Object.values(users).some(user => user.customerId === customerId);
            if (customerIdExists) throw new Error("Customer ID already exists. Please try again.");
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

// Function to log in a user
// const userLogin = async (identifier, password) => {
//     try {
//       let userCredential;
//       // Check if the identifier is an email or a customer ID
//       const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  
//       if (isEmail) {
//         // Login with email
//         userCredential = await signInWithEmailAndPassword(auth, identifier, password);
//         const uid = userCredential.user.uid;
//         console.log({uid})
//         const userRef = ref(database, `users/${uid}`);
//         const userSnapshot = await get(userRef);
//         userData = userSnapshot.val();
//       } else {
//         // Login with customer ID
//         const usersRef = ref(database, 'users');
//         const customerIdQuery = query(usersRef, orderByChild('customerId'), equalTo(identifier));
//         const querySnapshot = await get(customerIdQuery);
//         console.log({querySnapshot})
  
//         if (querySnapshot.exists()) {
//           const userDataArray = Object.values(querySnapshot.val());
//           if (userDataArray.length > 0) {
//             userData = userDataArray[0];
//             userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
//           } else {
//             throw new Error("User not found with the provided customer ID.");
//           }
//         } else {
//           throw new Error("User not found with the provided customer ID.");
//         }
//       }
  
//       if (!userData) {
//         throw new Error("User data not found in the database.");
//       }
  
//       // Extract relevant user data
//       const {
//         uid,
//         firstName,
//         lastName,
//         email,
//         customerId,
//         loanType,
//         totalEmiMonths,
//         loanValue,
//         photoURL,
//         mobile,
//         dateOfBirth,
//       } = userData;
  
//       // Create a user object with all relevant data
//       const user = {
//         uid,
//         firstName,
//         lastName,
//         email,
//         customerId,
//         loanType,
//         totalEmiMonths,
//         loanValue,
//         photoURL,
//         mobile,
//         dateOfBirth,
//         lastLogin: new Date().toISOString(),
//       };
  
//       // Update Zustand store with user data
//       useUserStore.getState().setUser(user);
  
//       // Update last login time in the database
//       const userRef = ref(database, `users/${uid}`);
//       await set(userRef, { ...userData, lastLogin: user.lastLogin });
  
//       console.log("Login successful:", user);
//       return user;
//     } catch (error) {
//       console.error("Error during login:", error);
//       if (error instanceof FirebaseError) {
//         switch (error.code) {
//           case 'auth/user-not-found':
//             throw new Error("No user found with this email or customer ID.");
//           case 'auth/wrong-password':
//             throw new Error("Incorrect password. Please try again.");
//           case 'auth/too-many-requests':
//             throw new Error("Too many unsuccessful login attempts. Please try again later.");
//           case 'auth/user-disabled':
//             throw new Error("This account has been disabled. Please contact support.");
//           default:
//             throw new Error(`Authentication error: ${error.message}`);
//         }
//       } else {
//         throw new Error("An unexpected error occurred during login. Please try again.");
//       }
//     }
//   };

const userLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    useDataStore.getState().setUser(user);
    window.location.replace("/welcome");
    return user;
  } catch (error) {
    console.error("Error during login:", error);
    if (error.code === "auth/user-not-found") {
      throw new Error("User not found");
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password");
    }
    throw new Error("An error occurred during login. Please try again.");
  }
};

// Handle social media logins and update user profile
const handleSocialLogin = async (provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await updateUserProfile(user);
    useDataStore.getState().setUser(user);
    window.location.replace("/welcome");
    return user;
  } catch (error) {
    console.error(`${provider.constructor.name} login error:`, error);
    throw new Error("An error occurred during social login. Please try again.");
  }
};


// Function to sign out the user
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

// Export authentication functions
export {
    registerUser,
    userLogin,
    userSignOut,
};

