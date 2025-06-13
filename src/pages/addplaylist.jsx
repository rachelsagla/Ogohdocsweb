// import { Typography, Form, Input, Button, notification } from "antd";
// import { sendData } from "../utils/api";
// import { useNavigate } from "react-router-dom";
// const { Title } = Typography;
// const AddPlaylist = () => {
//   const [form] = Form.useForm();
//   const [api, contextHolder] = notification.useNotification();
//   const navigate = useNavigate();

//   const handleSubmit = () => {
//     const values = form.getFieldsValue();
//     const formData = new FormData();
//     for (const key in values) {
//       formData.append(key, values[key]);
//     }
//     sendData("/api/playlist/31", formData)
//       .then((resp) => {
//         if (resp?.datas) {
//           api.success({ message: "Success", description: "Playlist added" });
//           navigate("/playlist");
//         } else {
//           api.error({ message: "Error", description: "Failed to add playlist" });
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div style={{ maxWidth: 800, margin: '0 auto' }}>
//       {contextHolder}
//       <Title level={2} style={{ marginBottom: 24 }}>Add New Playlist</Title>
//       <Form 
//         layout="vertical" 
//         form={form}
//         style={{ 
//           background: '#fff', 
//           padding: 24, 
//           borderRadius: 8,
//           boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)'
//         }}
//       >
//         <Form.Item label="Name" name="play_name" rules={[{ required: true }]}>
//           <Input size="large" />
//         </Form.Item>
//         <Form.Item label="Genre" name="play_genre">
//           <Input size="large" />
//         </Form.Item>
//         <Form.Item label="URL" name="play_url">
//           <Input size="large" />
//         </Form.Item>
//         <Form.Item label="Thumbnail URL" name="play_thumbnail">
//           <Input size="large" />
//         </Form.Item>
//         <Form.Item label="Description" name="play_description">
//           <Input.TextArea rows={4} />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" size="large" onClick={handleSubmit} style={{ width: 120 }}>
//             Submit
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };
// export default AddPlaylist;