import { Navigate, Route, Routes } from "react-router";
import AddressPage from "@/pages/address";
import RootLayout from "./pages/layout";
// import DOBPage from "./pages/nft/dob";
import TransactionPage from "./pages/transaction";
import GuidancePage from "./pages/guidance";


export default function AppRoutes() {


  return (
    <Routes>
      <Route path="/" index element={<RootRedirect />} />
      <Route element={<RootLayout />}>
        <Route path="guidance" element={<GuidancePage />} />
        <Route path="address" element={<AddressPage />} />
        <Route path="transaction">
          <Route index element={<TransactionPage />} />
          <Route path=":txHash" element={<TransactionPage />} />
        </Route>
        {/* <Route path="nft">
          <Route path="dob" element={<DOBPage />} />
        </Route> */}
      </Route>
    </Routes>
  )
}


function RootRedirect() {
  return <Navigate to="/guidance" replace />;
}