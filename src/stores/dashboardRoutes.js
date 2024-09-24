import { FiCreditCard, FiDollarSign, FiFile, FiGrid, FiHelpCircle } from "react-icons/fi";

export const dashboardRoutes = [
	{ icon: FiGrid, name: "Dashboard", path: "/dashboard" },
	{ 
	  icon: FiFile, 
	  name: "Documents", 
	  path: "/documents", 
	  hasSubmenu: true,
	  submenuItems: [
		{ name: "Customer Document", path: "/documents/customer" },
		{ name: "Guranter Document", path: "/documents/guranter" },
		{ name: "Total Document", path: "/documents/final" },
	  ]
	},
	{ 
	  icon: FiCreditCard, 
	  name: "EMI", 
	  path: "/emi", 
	  hasSubmenu: true,
	  submenuItems: [
		{ name: "EMI Payment", path: "/emi/pay" },
		{ name: "EMI Details", path: "/emi/details" },
	  ]
	},
	{ icon: FiDollarSign, name: "Payment History", path: "/payment-history" },
  ];
  
  export const bottomRoutes = [
	{ icon: FiHelpCircle, name: "Help Center", path: "/help-center" },
  ];