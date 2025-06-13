// import { Layout, Menu } from "antd";
// import {
//   UnorderedListOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import { useNavigate, useLocation } from "react-router-dom";

// const { Sider } = Layout;

// const Sidenav = ({ collapsed }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     {
//       key: "/playlist",
//       icon: <UnorderedListOutlined />,
//       label: "View Playlist",
//     },
//     {
//       key: "/addplaylist",
//       icon: <PlusOutlined />,
//       label: "Add Playlist",
//     },
//   ];

//   return (
//     <Sider 
//       collapsible
//       collapsed={collapsed}
//       trigger={null} // We'll handle the trigger via the button in App.js
//       width={220} 
//       style={{ 
//         background: "#fff", 
//         minHeight: "100vh",
//         boxShadow: '2px 0 8px 0 rgba(29,35,41,0.05)'
//       }}
//     >
//       <div
//         style={{
//           height: 64,
//           fontSize: collapsed ? 16 : 20,
//           fontWeight: "bold",
//           textAlign: "center",
//           lineHeight: "64px",
//           overflow: 'hidden',
//           whiteSpace: 'nowrap',
//           transition: 'all 0.2s'
//         }}
//       >
//         {collapsed ? '🎵' : '🎵 Playlist'}
//       </div>
//       <Menu
//         mode="inline"
//         selectedKeys={[location.pathname]}
//         items={menuItems}
//         onClick={(e) => navigate(e.key)}
//         inlineCollapsed={collapsed}
//         style={{
//           borderRight: 0
//         }}
//       />
//     </Sider>
//   );
// };

// export default Sidenav;