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
import useDataStore from "../zustand/useUserDataStore";

// Define the shape of the app user
interface AppUser {
    id: string;
    name: string;
    email: string;
}

// Function to generate customer ID
const generateCustomerId = (
    loanType: string,
    totalEmiMonths: number,
    currentYear: number,
    firstName: string,
    lastName: string,
    position: number
): string => {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const yearSuffix = String(currentYear).slice(-2);
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    const positionCategory =
        position <= 10 ? 'A' :
        position <= 100 ? 'B' :
        position <= 10000 ? 'C' : 'D';

    return `${currentMonth}${loanType}${totalEmiMonths}${yearSuffix}${firstInitial}${lastInitial}${positionCategory}`;
};

// Function to register a new user
// const registerUser = async (
//     email: string,
//     password: string,
//     firstName: string,
//     lastName: string,
//     dateOfBirth: string,
//     mobile: string,
//     photo: File | null,
//     loanType: string,
//     totalEmiMonths: number,
//     loanValue: number
// ): Promise<{ user: AppUser; customerId: string }> => {
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         const uid = user.uid;

//         // Upload profile photo if provided
//         let photoURL: string | null = null;
//         if (photo) {
//             const profileImageRef = storageRef(storage, `profileImages/${uid}/${photo.name}`);
//             await uploadBytes(profileImageRef, photo);
//             photoURL = await getDownloadURL(profileImageRef);
//             await updateProfile(user, { photoURL });
//         }

//         // Fetch the current count of users to determine the new position
//         const userCountRef = ref(database, 'users');
//         const userSnapshot = await get(userCountRef);
//         const position = userSnapshot.exists() ? Object.keys(userSnapshot.val()).length + 1 : 1;

//         // Generate customer ID
//         const currentYear = new Date().getFullYear();
//         const customerId = generateCustomerId(loanType, totalEmiMonths, currentYear, firstName, lastName, position);

//         // Save additional user data in the Firebase Realtime Database
//         await set(ref(database, `users/${uid}`), {
//             uid,
//             firstName,
//             lastName,
//             email,
//             mobile,
//             dateOfBirth,
//             photoURL,
//             customerId,
//             loanType,
//             totalEmiMonths,
//             loanValue,
//             position,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//         });

//         return {
//             user: { id: user.uid, name: firstName, email: user.email || '' },
//             customerId,
//         };
//     } catch (error) {
//         console.error("Error during registration:", error);
//         throw error instanceof FirebaseError ? new Error(error.message) : new Error("An unknown error occurred during registration.");
//     }
// };

// Function to register a new user
const registerUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    mobile: string,
    photo: File | null,
    loanType: string,
    totalEmiMonths: number,
    loanValue: number
): Promise<{ user: AppUser; customerId: string }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const uid = user.uid;

        // Upload profile photo if provided
        let photoURL: string | null = null;
        if (photo) {
            const profileImageRef = storageRef(storage, `profileImages/${uid}/${photo.name}`);
            await uploadBytes(profileImageRef, photo);
            photoURL = await getDownloadURL(profileImageRef);
            await updateProfile(user, { photoURL });
        }

        // Fetch the current count of users to determine the new position
        const userCountRef = ref(database, 'users');
        const userSnapshot = await get(userCountRef);
        const position = userSnapshot.exists() ? Object.keys(userSnapshot.val()).length + 1 : 1;

        // Generate customer ID
        const currentYear = new Date().getFullYear();
        const customerId = generateCustomerId(loanType, totalEmiMonths, currentYear, firstName, lastName, position);

        // Check if the customer ID already exists
        const existingCustomerIdRef = ref(database, 'users');
        const existingSnapshot = await get(existingCustomerIdRef);

        if (existingSnapshot.exists()) {
            const users = existingSnapshot.val();
            const customerIdExists = Object.values(users).some((user: any) => user.customerId === customerId);

            if (customerIdExists) {
                alert("Customer ID already exists. Please try again.");
                throw new Error("Duplicate customer ID");
            }
        }

        // Save additional user data in the Firebase Realtime Database
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

        return {
            user: { id: user.uid, name: firstName, email: user.email || '' },
            customerId,
        };
    } catch (error) {
        console.error("Error during registration:", error);
        throw error instanceof FirebaseError ? new Error(error.message) : new Error("An unknown error occurred during registration.");
    }
};


// Function to log in a user
// const userLogin = async (email: string, password: string): Promise<AppUser> => {
//     try {
//         const { user } = await signInWithEmailAndPassword(auth, email, password);

//         // Extract user information
//         const nameParts = user.displayName ? user.displayName.split(" ") : [];
//         const firstName = nameParts[0] || '';
//         const lastName = nameParts.slice(1).join(" ") || '';

// 		console.log({nameParts})

//         // Update Zustand store with user data
//         useDataStore.getState().setUser({
//             id: user.uid,
//             firstName,
//             lastName,
//         });

//         // Optionally redirect after login
//         window.location.replace("/dashboard");

//         return { id: user.uid, name: firstName, email: user.email || '' };
//     } catch (error) {
//         console.error("Error during login:", error);
//         throw error instanceof FirebaseError ? 
//             new Error(getLoginErrorMessage(error.code)) :
//             new Error("An unknown error occurred during login.");
//     }
// };

const userLogin = async (email: string, password: string): Promise<AppUser> => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        // Fetch user information from the Realtime Database
        const userRef = ref(database, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
		console.log({userSnapshot})

        if (!userSnapshot.exists()) {
            throw new Error("User data not found in the database.");
        }

        const userData = userSnapshot.val();
        const firstName = userData.firstName || '';
        const lastName = userData.lastName || '';
		

        // Update Zustand store with user data
        useDataStore.getState().setUser({
            id: user.uid,
            firstName,
            lastName,
			
        });

        // Optionally redirect after login
        window.location.replace("/dashboard");

        return { id: user.uid, name: `${firstName} ${lastName}`, email: user.email || '' };
    } catch (error) {
        console.error("Error during login:", error);
        throw error instanceof FirebaseError ? 
            new Error(getLoginErrorMessage(error.code)) :
            new Error("An unknown error occurred during login.");
    }
};

// Helper function for login error messages
const getLoginErrorMessage = (code: string): string => {
    switch (code) {
        case 'auth/user-not-found':
            return "User not found.";
        case 'auth/wrong-password':
            return "Incorrect password.";
        default:
            return "An error occurred during login. Please try again.";
    }
};

// Function to sign out the user
const userSignOut = async (): Promise<void> => {
    try {
        await signOut(auth);
        useDataStore.getState().clearUser(); // Clear Zustand store data
        localStorage.removeItem("UserData Storage");

        // Redirect to home page
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
