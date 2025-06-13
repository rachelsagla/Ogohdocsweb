// import {
//   Col,
//   Row,
//   Typography,
//   Card,
//   List,
//   Skeleton,
//   Divider,
//   FloatButton,
//   Drawer,
//   Form,
//   Input,
//   Button,
//   notification,
//   Space,
//   Popconfirm,
//   Select
// } from "antd";
// const { Title, Text } = Typography;
// const { Option } = Select;
// import { getData, sendData, deleteData } from "/src/utils/api";
// import { useState, useEffect } from "react";
// import {
//   PlusOutlined,
//   EditOutlined,
//   SearchOutlined,
//   DeleteOutlined
// } from '@ant-design/icons';

// const Playlist = () => {
//   const [dataSources, setDataSources] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [isOpenDrawer, setIsOpenDrawer] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [idSelected, setIdSelected] = useState(null);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [api, contextHolder] = notification.useNotification();

//   const genreOptions = [
//     { value: 'music', label: 'Music' },
//     { value: 'song', label: 'Song' },
//     { value: 'movie', label: 'Movie' },
//     { value: 'education', label: 'Education' },
//     { value: 'others', label: 'Others' }
//   ];

//   const showAlert = (type, title, description) => {
//     api[type]({
//       message: title,
//       description: description,
//     });
//   };

//   useEffect(() => {
//     getPlaylistData();
//   }, []);

//   const getPlaylistData = async () => {
//     setIsLoading(true);
//     try {
//       const resp = await getData("/api/playlist/31");
//       if (resp && resp.datas) {
//         setDataSources(Array.isArray(resp.datas) ? resp.datas : [resp.datas]);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       showAlert("error", "Error", "Failed to fetch playlist data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const [form] = Form.useForm();

//   const onCloseDrawer = () => {
//     setIsOpenDrawer(false);
//     setIsEdit(false);
//     setIdSelected(null);
//     form.resetFields();
//   };

//   const handleDrawer = () => {
//     setIsOpenDrawer(true);
//     setIsEdit(false);
//     form.resetFields();
//   };

//   const handleSubmit = async () => {
//   try {
//     setSubmitLoading(true);
//     const values = await form.validateFields();

//     const payload = {
//       play_name: values.play_name,
//       play_url: values.play_url,
//       play_thumbnail: values.play_thumbnail,
//       play_genre: values.play_genre,
//       play_description: values.play_description || "",
//       group_id: "31"
//     };

//     let url, method;
    
//     if (isEdit && idSelected) {
//       url = `/api/playlist/update/${idSelected}`;
//       method = "POST"; // As per your API requirements
//     } else {
//       url = "/api/playlist/31";
//       method = "POST";
//     }

//     const resp = await sendData(url, payload, method);

//     if (resp?.message === "OK") {
//       onCloseDrawer();
//       showAlert("success", "Success", isEdit ? "Playlist updated successfully" : "Playlist created successfully");
//       await getPlaylistData();
//     } else {
//       showAlert("error", "Error", resp?.message || "Failed to save playlist");
//     }
//   } catch (err) {
//     console.error("Submit error:", err);
//     showAlert("error", "Error", err.message || "Failed to save playlist");
//   } finally {
//     setSubmitLoading(false);
//   }
// };

// const confirmDelete = async (record) => {
//   try {
//     const resp = await deleteData(`/api/playlist/${record.id_play}`);
//     console.log("Delete response:", resp);

//     await getPlaylistData();
//     showAlert("success", "Success", "Playlist deleted successfully");

//   } catch (err) {
//     console.error("Delete error:", err);
//     showAlert("error", "Error", "Failed to delete playlist");
//   }
// };

//   const handleDrawerEdit = (record) => {
//     setIsOpenDrawer(true);
//     setIsEdit(true);
//     setIdSelected(record.id_play);

//     form.setFieldsValue({
//       play_name: record.play_name,
//       play_url: record.play_url,
//       play_thumbnail: record.play_thumbnail,
//       play_genre: record.play_genre,
//       play_description: record.play_description
//     });
//   };

//   // const confirmDelete = async (record) => {
//   //   try {
//   //     const resp = await deleteData(`/api/playlist/${record.id_play}`);
      
//   //     if (resp?.success) {
//   //       await getPlaylistData();
//   //       showAlert("success", "Success", "Playlist deleted successfully");
//   //     } else {
//   //       showAlert("error", "Error", resp?.message || "Failed to delete playlist");
//   //     }
//   //   } catch (err) {
//   //     console.error("Delete error:", err);
//   //     showAlert("error", "Error", "Failed to delete playlist");
//   //   }
//   // };

//   const handleSearch = (search) => {
//     setSearchText(search.toLowerCase());
//   };

//   const dataSourceFiltered = dataSources.filter((item) => {
//     if (!searchText) return true;
    
//     return (
//       (item.play_name && item.play_name.toLowerCase().includes(searchText)) ||
//       (item.play_genre && item.play_genre.toLowerCase().includes(searchText)) ||
//       (item.play_description && item.play_description.toLowerCase().includes(searchText))
//     );
//   });

//   const openInNewTab = (url) => {
//     if (!url) return;
//     const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
//     if (newWindow) newWindow.opener = null;
//   };

//   const renderDrawer = () => (
//     <Drawer
//       width={500}
//       title={isEdit ? "Edit Playlist" : "Add New Playlist"}
//       onClose={onCloseDrawer}
//       open={isOpenDrawer}
//       destroyOnClose
//       extra={
//         <Space>
//           <Button onClick={onCloseDrawer} disabled={submitLoading}>
//             Cancel
//           </Button>
//           <Button 
//             type="primary" 
//             onClick={handleSubmit}
//             loading={submitLoading}
//           >
//             {isEdit ? "Update" : "Create"}
//           </Button>
//         </Space>
//       }
//     >
//       <Form form={form} layout="vertical" preserve={false}>
//         <Form.Item
//           label="Name"
//           name="play_name"
//           rules={[
//             { required: true, message: "Please input playlist name!" },
//             { min: 2, message: "Name must be at least 2 characters!" }
//           ]}
//         >
//           <Input placeholder="Enter playlist name" />
//         </Form.Item>

//         <Form.Item
//           label="URL"
//           name="play_url"
//           rules={[
//             { required: true, message: "Please input playlist URL!" },
//             { type: 'url', message: "Please enter a valid URL!" }
//           ]}
//         >
//           <Input placeholder="Enter URL (e.g., https://youtu.be/...)" />
//         </Form.Item>

//         <Form.Item
//           label="Thumbnail URL"
//           name="play_thumbnail"
//           rules={[
//             { required: true, message: "Please input thumbnail URL!" },
//             { type: 'url', message: "Please enter a valid URL!" }
//           ]}
//         >
//           <Input placeholder="Enter image URL (e.g., https://img.youtube.com/...)" />
//         </Form.Item>

//         <Form.Item
//           label="Genre"
//           name="play_genre"
//           rules={[{ required: true, message: "Please select genre!" }]}
//         >
//           <Select placeholder="Select genre">
//             {genreOptions.map(option => (
//               <Option key={option.value} value={option.value}>
//                 {option.label}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label="Description"
//           name="play_description"
//         >
//           <Input.TextArea rows={4} placeholder="Enter description (optional)" />
//         </Form.Item>
//       </Form>
//     </Drawer>
//   );

//   return (
//     <div className="layout-content">
//       {contextHolder}
//       <FloatButton
//         shape="circle"
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={handleDrawer}
//         tooltip="Add New Playlist"
//       />
//       {renderDrawer()}

//       <Row gutter={[24, 0]}>
//         <Col xs={24} className="mb-24">
//           <Card bordered={false} className="circlebox h-full w-full">
//             <Title level={2}>Playlist Management</Title>
//             <Text style={{ fontSize: "12pt" }}>Manage your music playlists</Text>
//             <Divider />

//             <Input
//               prefix={<SearchOutlined />}
//               placeholder="Search playlists..."
//               allowClear
//               size="large"
//               onChange={(e) => handleSearch(e.target.value)}
//               style={{ marginBottom: 16 }}
//             />

//             {isLoading ? (
//               <Skeleton active paragraph={{ rows: 8 }} />
//             ) : (
//               <List
//                 grid={{ gutter: 16, xl: 4, lg: 3, md: 2, sm: 1, xs: 1 }}
//                 dataSource={dataSourceFiltered}
//                 locale={{ emptyText: "No playlists found" }}
//                 renderItem={(item) => (
//                   <List.Item>
//                     <Card
//                       hoverable
//                       cover={
//                         <img
//                           alt="playlist thumbnail"
//                           src={item.play_thumbnail}
//                           style={{ height: 160, objectFit: 'cover' }}
//                           onError={(e) => {
//                             e.target.src = 'https://via.placeholder.com/300x160?text=No+Image';
//                           }}
//                         />
//                       }
//                       actions={[
//                         <EditOutlined 
//                           key="edit" 
//                           onClick={() => handleDrawerEdit(item)}
//                           title="Edit playlist"
//                         />,
//                         <SearchOutlined 
//                           key="view" 
//                           onClick={() => openInNewTab(item.play_url)}
//                           title="Open in new tab"
//                         />,
//                         <Popconfirm
//                           key="delete"
//                           title="Delete playlist"
//                           description="Are you sure to delete this playlist?"
//                           onConfirm={() => confirmDelete(item)}
//                           okText="Yes"
//                           cancelText="No"
//                         >
//                           <DeleteOutlined title="Delete playlist" />
//                         </Popconfirm>
//                       ]}
//                     >
//                       <Card.Meta
//                         title={item.play_name}
//                         description={
//                           <>
//                             <Text strong>{item.play_genre}</Text>
//                             <br />
//                             <Text type="secondary" ellipsis={{ rows: 2 }}>
//                               {item.play_description || "No description"}
//                             </Text>
//                             <br />
//                             <Button
//                               type="link"
//                               onClick={() => openInNewTab(item.play_url)}
//                               style={{ padding: 0, marginTop: 8 }}
//                               size="small"
//                             >
//                               Open Link
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
//     </div>
//   );
// };

// export default Playlist;

import {
  Col,
  Row,
  Typography,
  Card,
  List,
  Skeleton,
  Divider,
  FloatButton,
  Drawer,
  Form,
  Input,
  Button,
  notification,
  Space,
  Popconfirm,
  Select,
  Tag,
  Avatar,
  Badge
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
  CustomerServiceOutlined,
  YoutubeOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { useState, useEffect } from "react";
import { getData, sendData, deleteData } from "/src/utils/api";

const { Title, Text } = Typography;
const { Option } = Select;

// Color palette
const colors = {
  primary: '#8B4513',   // Brown
  secondary: '#F8E0B2', // Cream
  accent: '#D4A76A',    // Light brown
  dark: '#5C3A21',      // Dark brown
  light: '#FFF9F0'      // Light cream
};

const Playlist = () => {
  const [dataSources, setDataSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [activeFilter, setActiveFilter] = useState('all');

  const genreOptions = [
    { value: 'music', label: 'Music', color: colors.primary },
    { value: 'song', label: 'Song', color: '#A67C52' },
    { value: 'movie', label: 'Movie', color: '#BF8B5E' },
    { value: 'education', label: 'Education', color: '#8B5A2B' },
    { value: 'others', label: 'Others', color: '#D2B48C' }
  ];

  const showAlert = (type, title, description) => {
    api[type]({
      message: title,
      description: description,
    });
  };

  useEffect(() => {
    getPlaylistData();
  }, []);

  const getPlaylistData = async () => {
    setIsLoading(true);
    try {
      const resp = await getData("/api/playlist/31");
      if (resp && resp.datas) {
        setDataSources(Array.isArray(resp.datas) ? resp.datas : [resp.datas]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showAlert("error", "Error", "Failed to fetch playlist data");
    } finally {
      setIsLoading(false);
    }
  };

  const [form] = Form.useForm();

  const onCloseDrawer = () => {
    setIsOpenDrawer(false);
    setIsEdit(false);
    setIdSelected(null);
    form.resetFields();
  };

  const handleDrawer = () => {
    setIsOpenDrawer(true);
    setIsEdit(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      const values = await form.validateFields();

      const payload = {
        play_name: values.play_name,
        play_url: values.play_url,
        play_thumbnail: values.play_thumbnail,
        play_genre: values.play_genre,
        play_description: values.play_description || "",
        group_id: "31"
      };

      let url, method;
      
      if (isEdit && idSelected) {
        url = `/api/playlist/update/${idSelected}`;
        method = "POST";
      } else {
        url = "/api/playlist/31";
        method = "POST";
      }

      const resp = await sendData(url, payload, method);

      if (resp?.message === "OK") {
        onCloseDrawer();
        showAlert("success", "Success", isEdit ? "Playlist updated successfully" : "Playlist created successfully");
        await getPlaylistData();
      } else {
        showAlert("error", "Error", resp?.message || "Failed to save playlist");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showAlert("error", "Error", err.message || "Failed to save playlist");
    } finally {
      setSubmitLoading(false);
    }
  };

  const confirmDelete = async (record) => {
    try {
      const resp = await deleteData(`/api/playlist/${record.id_play}`);
      console.log("Delete response:", resp);

      await getPlaylistData();
      showAlert("success", "Success", "Playlist deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      showAlert("error", "Error", "Failed to delete playlist");
    }
  };

  const handleDrawerEdit = (record) => {
    setIsOpenDrawer(true);
    setIsEdit(true);
    setIdSelected(record.id_play);

    form.setFieldsValue({
      play_name: record.play_name,
      play_url: record.play_url,
      play_thumbnail: record.play_thumbnail,
      play_genre: record.play_genre,
      play_description: record.play_description
    });
  };

  const handleSearch = (search) => {
    setSearchText(search.toLowerCase());
  };

  const dataSourceFiltered = dataSources.filter((item) => {
    if (!searchText) return true;
    return (
      (item.play_name && item.play_name.toLowerCase().includes(searchText)) ||
      (item.play_genre && item.play_genre.toLowerCase().includes(searchText)) ||
      (item.play_description && item.play_description.toLowerCase().includes(searchText))
    );
  });

  const filteredPlaylists = activeFilter === 'all' 
    ? dataSourceFiltered 
    : dataSourceFiltered.filter(item => item.play_genre === activeFilter);

  const getGenreColor = (genre) => {
    const option = genreOptions.find(g => g.value === genre);
    return option ? option.color : colors.primary;
  };

  const openInNewTab = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderDrawer = () => (
    <Drawer
      width={500}
      title={isEdit ? "Edit Playlist" : "Add New Playlist"}
      onClose={onCloseDrawer}
      open={isOpenDrawer}
      destroyOnClose
      styles={{
        header: { 
          borderBottom: `1px solid ${colors.secondary}`,
          backgroundColor: colors.light
        },
        body: { 
          backgroundColor: colors.light
        },
      }}
      extra={
        <Space>
          <Button onClick={onCloseDrawer} disabled={submitLoading}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={submitLoading}
            style={{ backgroundColor: colors.primary, borderColor: colors.dark }}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="Name"
          name="play_name"
          rules={[
            { required: true, message: "Please input playlist name!" },
            { min: 2, message: "Name must be at least 2 characters!" }
          ]}
        >
          <Input 
            placeholder="Enter playlist name" 
            prefix={<CustomerServiceOutlined style={{ color: colors.primary }} />}
          />
        </Form.Item>

        <Form.Item
          label="URL"
          name="play_url"
          rules={[
            { required: true, message: "Please input playlist URL!" },
            { type: 'url', message: "Please enter a valid URL!" }
          ]}
        >
          <Input 
            placeholder="Enter URL (e.g., https://youtu.be/...)" 
            prefix={<YoutubeOutlined style={{ color: colors.primary }} />}
          />
        </Form.Item>

        <Form.Item
          label="Thumbnail URL"
          name="play_thumbnail"
          rules={[
            { required: true, message: "Please input thumbnail URL!" },
            { type: 'url', message: "Please enter a valid URL!" }
          ]}
        >
          <Input 
            placeholder="Enter image URL (e.g., https://img.youtube.com/...)" 
            prefix={<PictureOutlined style={{ color: colors.primary }} />}
          />
        </Form.Item>

        <Form.Item
          label="Genre"
          name="play_genre"
          rules={[{ required: true, message: "Please select genre!" }]}
        >
          <Select placeholder="Select genre">
            {genreOptions.map(option => (
              <Option key={option.value} value={option.value}>
                <Tag color={option.color}>{option.label}</Tag>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="play_description"
        >
          <Input.TextArea rows={4} placeholder="Enter description (optional)" />
        </Form.Item>
      </Form>
    </Drawer>
  );

  return (
    <div style={{ backgroundColor: colors.light, minHeight: '100vh' }}>
      {contextHolder}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px'
        }}>
          <div>
            <Title level={2} style={{ color: colors.primary, margin: 0 }}>Playlist Manager</Title>
            <Text style={{ color: colors.dark }}>Curate your perfect soundscape</Text>
          </div>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleDrawer}
            style={{ backgroundColor: colors.primary, borderColor: colors.dark }}
          >
            New Playlist
          </Button>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '24px' }}>
          <Text strong style={{ display: 'block', marginBottom: '12px', color: colors.dark }}>
            Filter by Genre
          </Text>
          <Space wrap>
            <Badge.Ribbon text="All" color={colors.accent}>
              <Tag 
                onClick={() => setActiveFilter('all')}
                style={{ 
                  cursor: 'pointer',
                  padding: '8px 16px',
                  backgroundColor: activeFilter === 'all' ? colors.primary : 'white',
                  color: activeFilter === 'all' ? 'white' : colors.dark,
                  border: `1px solid ${colors.secondary}`
                }}
              >
                All Media
              </Tag>
            </Badge.Ribbon>
            {genreOptions.map(option => (
              <Tag
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                style={{ 
                  cursor: 'pointer',
                  padding: '8px 16px',
                  backgroundColor: activeFilter === option.value ? option.color : 'white',
                  color: activeFilter === option.value ? 'white' : colors.dark,
                  border: `1px solid ${colors.secondary}`
                }}
              >
                {option.label}
              </Tag>
            ))}
          </Space>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search playlists..."
            allowClear
            size="large"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ 
              maxWidth: '400px',
              borderColor: colors.secondary
            }}
          />
        </div>

        <Divider style={{ borderColor: colors.secondary }} />

        {/* Content */}
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Row gutter={[24, 24]}>
            {filteredPlaylists.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id_play}>
                <Card
                  hoverable
                  style={{ 
                    border: `1px solid ${colors.secondary}`,
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                  cover={
                    <div style={{ position: 'relative' }}>
                      <img
                        alt="playlist thumbnail"
                        src={item.play_thumbnail}
                        style={{ 
                          height: '160px', 
                          width: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x160?text=No+Image';
                        }}
                      />
                      <Button 
                        type="text"
                        icon={<YoutubeOutlined />}
                        style={{ 
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          color: 'white',
                          backgroundColor: 'rgba(0,0,0,0.7)'
                        }}
                        onClick={() => openInNewTab(item.play_url)}
                      />
                    </div>
                  }
                  actions={[
                    <EditOutlined 
                      key="edit" 
                      onClick={() => handleDrawerEdit(item)}
                      style={{ color: colors.primary }}
                    />,
                    <Popconfirm
                      key="delete"
                      title="Delete playlist"
                      description="Are you sure to delete this playlist?"
                      onConfirm={() => confirmDelete(item)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined style={{ color: colors.primary }} />
                    </Popconfirm>
                  ]}
                >
                  <Card.Meta
                    title={item.play_name}
                    description={
                      <div style={{ marginTop: '8px' }}>
                        <Tag 
                          color={getGenreColor(item.play_genre)}
                          style={{ marginBottom: '8px' }}
                        >
                          {item.play_genre}
                        </Tag>
                        <Text 
                          type="secondary" 
                          style={{ 
                            display: 'block',
                            marginBottom: '8px'
                          }}
                        >
                          {item.play_description || "No description"}
                        </Text>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Render the drawer */}
        {renderDrawer()}
      </div>
    </div>
  );
};

export default Playlist;