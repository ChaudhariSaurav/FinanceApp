import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

// Define the types for the user and store state
interface User {
    id: string;
    firstName: string;
    lastName: string;
    name: string; // Combined name property
}

interface DataStore {
    isLoggedIn: boolean;
    data: any[]; // Consider specifying a more specific type for data
    user: User | null;
    setUser: (user: Omit<User, 'name'>) => void; // Omit 'name' from input
    clearUser: () => void;
}

// Custom storage object for persistence
const customStorage: PersistOptions<DataStore>['storage'] = {
    getItem: (name) => {
        const item = localStorage.getItem(name);
        return item ? JSON.parse(item) : null;
    },
    setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
    removeItem: (name) => localStorage.removeItem(name),
};

const useDataStore = create<DataStore>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            data: [],
            user: null,
            setUser: ({ id, firstName, lastName }) => {
                const name = `${firstName} ${lastName}`; // Combine first and last names
                set({ user: { id, firstName, lastName, name }, isLoggedIn: true });
            },
            clearUser: () => set({ user: null, isLoggedIn: false }),
        }),
        {
            name: "UserData Storage",
            storage: customStorage,
        }
    )
);

export default useDataStore;
