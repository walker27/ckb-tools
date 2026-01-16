import NetworkSwitch from "@/components/NetworkSwitch";
import { Layout, Menu, type MenuProps } from "antd";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";

const menuItems: MenuProps['items'] = [
  {
    key: 'guidance',
    label: (
      <Link to="/guidance">
        Guidance
      </Link>
    )
  },
  {
    key: 'address',
    label: (
      <Link to="/address">
        Address
      </Link>
    )
  },
  {
    key: 'transaction',
    label: (
      <Link to="/transaction">
        Transaction
      </Link>
    )
  },
  // {
  //   path: '/nft',
  //   name: 'NFT',
  //   // icon: <CrownOutlined />,
  //   // access: 'canAdmin',
  //   // component: './home',
  //   routes: [
  //     {
  //       path: '/nft/dob',
  //       name: 'DOB',
  //       // icon: <CrownOutlined />,
  //       // access: 'canAdmin',
  //       component: './nft/dob',
  //     },
  //   ],
  // },
];

export default function RootLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = location.pathname;

  return (
      <Layout className="min-h-full">
        <div className="absolute right-5 top-5">
          <NetworkSwitch />
        </div>
        <Outlet />
      </Layout>
  )
}