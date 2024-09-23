import { Navigate } from "react-router-dom";
import NotFoundError from "../error/404";
import Dashboard from "../pages/dashboard";
import HistoryContent from "../content/history.content";
import Installment from "../content/Installment.content";
import EMIPage from "../content/Emis.content";
import UploadDocument from "../content/Upload.content";
import FinalDocuments from "../content/TotalDocumet.content";
import GuarantorUpload from "../pages/guranterDocs";
import CustomerUpload from "../pages/customerDocs";



export const ValidAuthroutes = [
    { path: "/*", element: <Navigate to="/dashboard" replace={true} /> },
    { path: "/dashboard", element: <Dashboard/> },
    { path: "/history", element: <HistoryContent/> },
    { path: "/installment/:installmentOrderId", element: <Installment/> },
    { path: "/documents/customer", element: <CustomerUpload/> },
    { path: "/documents/final", element: <FinalDocuments/> },
    { path: "/documents/guranter", element: <GuarantorUpload/> },
    { path: "/emis", element: <EMIPage/> },
    { path: "/", element: <NotFoundError /> },
];