import { GithubFilled, InfoCircleFilled, QuestionCircleFilled } from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Link, Outlet, useLocation } from "react-router";


export default function RootLayout() {
  const location = useLocation();

  return (
    <ProLayout
      fixSiderbar
      logo={<img src="/nervos.black.svg" alt="logo" width="32" height="32" />}
      title="CKB Tools"
      route={{
        path: '/',
        routes: [
          {
            path: '/guidance',
            name: 'Guidance',
            // icon: <CrownOutlined />,
            // access: 'canAdmin',
            component: './guidance',
          },
          {
            path: '/address',
            name: 'Address',
            // icon: <CrownOutlined />,
            // access: 'canAdmin',
            component: './address',
          },
          {
            path: '/transaction',
            name: 'Transaction',
            // icon: <CrownOutlined />,
            // access: 'canAdmin',
            component: './transaction',
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
        ],
      }}
      location={{
        pathname: location.pathname,
      }}
      onMenuHeaderClick={(e) => console.log(e)}
      menuItemRender={(item, dom) => (
        <Link to={item.path || "/home"}>
          {dom}
        </Link>
      )}
      actionsRender={() => [
        <InfoCircleFilled key="InfoCircleFilled" />,
        <QuestionCircleFilled key="QuestionCircleFilled" />,
        <GithubFilled key="GithubFilled" />,
      ]}
    >
      <Outlet />
    </ProLayout>
  )
}