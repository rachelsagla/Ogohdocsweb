// import { Col, Row, Typography, Card, List, Skeleton, Divider, FloatButton, Drawer, Form, Input, Button, notification, Space, message, Popconfirm, Image } from "antd";
// import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import { useState, useEffect } from "react";
// import { getData, sendData, deleteData } from "../../utils/api";

// const { Title, Text } = Typography;

// const Playlist = () => {
//   const [playlists, setPlaylists] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentPlaylist, setCurrentPlaylist] = useState(null);
//   const [form] = Form.useForm();
//   const [api, contextHolder] = notification.useNotification();

//   // Notification helper
//   const showNotification = (type, message, description) => {
//     api[type]({
//       message,
//       description,
//     });
//   };

//   // Fetch playlists
//   useEffect(() => {
//     fetchPlaylists();
//   }, []);

//   const fetchPlaylists = () => {
//     setIsLoading(true);
//     getData("/api/playlist")
//       .then((response) => {
//         if (response) {
//           setPlaylists(response);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching playlists:", error);
//         showNotification("error", "Error", "Failed to fetch playlists");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     form.validateFields().then(values => {
//       const formData = new FormData();
//       Object.entries(values).forEach(([key, value]) => {
//         formData.append(key, value);
//       });

//       let url = "/api/playlist";
//       let method = "POST";

//       if (isEditMode && currentPlaylist) {
//         url = `/api/playlist/update/${currentPlaylist.id_play}`;
//         method = "POST"; // Assuming update uses POST as per your API
//       }

//       sendData(url, formData, method)
//         .then((response) => {
//           if (response?.success) {
//             showNotification(
//               "success",
//               "Success",
//               isEditMode ? "Playlist updated successfully" : "Playlist created successfully"
//             );
//             form.resetFields();
//             setIsDrawerOpen(false);
//             fetchPlaylists();
//           }
//         })
//         .catch((error) => {
//           console.error("Error saving playlist:", error);
//           showNotification("error", "Error", "Failed to save playlist");
//         });
//     });
//   };

//   // Handle edit
//   const handleEdit = (playlist) => {
//     setCurrentPlaylist(playlist);
//     setIsEditMode(true);
//     form.setFieldsValue({
//       play_name: playlist.play_name,
//       play_url: playlist.play_url,
//       play_thumbnail: playlist.play_thumbnail,
//       play_gente: playlist.play_gente,
//       play_description: playlist.play_description
//     });
//     setIsDrawerOpen(true);
//   };

//   // Handle delete
//   const handleDelete = (playlist) => {
//     deleteData(`/api/playlist/${playlist.id_play}`)
//       .then((response) => {
//         if (response?.success) {
//           showNotification("success", "Success", "Playlist deleted successfully");
//           fetchPlaylists();
//         }
//       })
//       .catch((error) => {
//         console.error("Error deleting playlist:", error);
//         showNotification("error", "Error", "Failed to delete playlist");
//       });
//   };

//   // Render the form drawer
//   const renderFormDrawer = () => (
//     <Drawer
//       title={isEditMode ? "Edit Playlist" : "Create Playlist"}
//       width={500}
//       onClose={() => {
//         setIsDrawerOpen(false);
//         form.resetFields();
//       }}
//       open={isDrawerOpen}
//       extra={
//         <Space>
//           <Button onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
//           <Button type="primary" onClick={handleSubmit}>
//             Submit
//           </Button>
//         </Space>
//       }
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           name="play_name"
//           label="Playlist Name"
//           rules={[{ required: true, message: "Please input playlist name!" }]}
//         >
//           <Input placeholder="Enter playlist name" />
//         </Form.Item>

//         <Form.Item
//           name="play_url"
//           label="Playlist URL"
//           rules={[{ required: true, message: "Please input playlist URL!" }]}
//         >
//           <Input placeholder="Enter playlist URL" />
//         </Form.Item>

//         <Form.Item
//           name="play_thumbnail"
//           label="Thumbnail URL"
//           rules={[{ required: true, message: "Please input thumbnail URL!" }]}
//         >
//           <Input placeholder="Enter thumbnail URL" />
//         </Form.Item>

//         <Form.Item
//           name="play_gente"
//           label="Genre"
//           rules={[{ required: true, message: "Please input genre!" }]}
//         >
//           <Input placeholder="Enter genre" />
//         </Form.Item>

//         <Form.Item
//           name="play_description"
//           label="Description"
//           rules={[{ required: true, message: "Please input description!" }]}
//         >
//           <Input.TextArea rows={4} placeholder="Enter description" />
//         </Form.Item>
//       </Form>
//     </Drawer>
//   );

//   return (
//     <div className="layout-content">
//       {contextHolder}
//       <Row gutter={[24, 0]}>
//         <Col span={24}>
//           <Card bordered={false}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <Title level={2}>Playlist Management</Title>
//               <Button
//                 type="primary"
//                 icon={<PlusOutlined />}
//                 onClick={() => {
//                   setIsEditMode(false);
//                   setCurrentPlaylist(null);
//                   setIsDrawerOpen(true);
//                 }}
//               >
//                 Add Playlist
//               </Button>
//             </div>
//             <Divider />

//             {isLoading && playlists.length === 0 ? (
//               <Skeleton active />
//             ) : (
//               <List
//                 grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
//                 dataSource={playlists}
//                 renderItem={(item) => (
//                   <List.Item>
//                     <Card
//                       hoverable
//                       cover={
//                         <Image
//                           src={item.play_thumbnail}
//                           alt={item.play_name}
//                           style={{ height: "200px", objectFit: "cover" }}
//                           preview={false}
//                         />
//                       }
//                       actions={[
//                         <EditOutlined key="edit" onClick={() => handleEdit(item)} />,
//                         <Popconfirm
//                           title="Delete this playlist?"
//                           description="Are you sure to delete this playlist?"
//                           onConfirm={() => handleDelete(item)}
//                           okText="Yes"
//                           cancelText="No"
//                         >
//                           <DeleteOutlined key="delete" />
//                         </Popconfirm>,
//                       ]}
//                     >
//                       <Card.Meta
//                         title={item.play_name}
//                         description={
//                           <>
//                             <Text ellipsis>{item.play_description}</Text>
//                             <br />
//                             <Text type="secondary">{item.play_gente}</Text>
//                             <br />
//                             <Button
//                               type="link"
//                               href={item.play_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               Open Playlist
//                             </Button>
//                           </>
//                         }
//                       />
//                     </Card>
//                   </List.Item>
//                 )}
//               />
//             )}
//           </Card>
//         </Col>
//       </Row>
//       {renderFormDrawer()}
//     </div>
//   );
// };

// export default Playlist;