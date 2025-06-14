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
  Skeleton,
  Drawer,
  Form,
  Input,
  Button,
  notification,
  Space,
  Popconfirm,
  Select,
  Tag,
  Empty,
  Tooltip
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
  CustomerServiceOutlined,
  YoutubeOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  ShareAltOutlined,
  SoundOutlined
} from '@ant-design/icons';
import { useState, useEffect } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Color Palette
const colors = {
  cream: '#F8E0B2',
  brown: '#8B4513',
  lightBrown: 'rgba(139, 69, 19, 0.1)'
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
    { value: 'music', label: 'Music', icon: <SoundOutlined /> },
    { value: 'song', label: 'Song', icon: <PlayCircleOutlined /> },
    { value: 'movie', label: 'Movie', icon: <YoutubeOutlined /> },
    { value: 'education', label: 'Education', icon: <CustomerServiceOutlined /> },
    { value: 'others', label: 'Others', icon: <HeartOutlined /> }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDataSources([
        {
          id_play: 1,
          play_name: "Chill Vibes Collection",
          play_url: "https://youtube.com/playlist?list=example1",
          play_thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
          play_genre: "music",
          play_description: "Perfect playlist for relaxing moments and study sessions"
        },
        {
          id_play: 2,
          play_name: "Indonesian Indie Hits",
          play_url: "https://youtube.com/playlist?list=example2",
          play_thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=200&fit=crop",
          play_genre: "song",
          play_description: "Best Indonesian indie songs compilation"
        },
        {
          id_play: 3,
          play_name: "Classic Movies Soundtrack",
          play_url: "https://youtube.com/playlist?list=example3",
          play_thumbnail: "https://images.unsplash.com/photo-1489599328959-58c1dd1c4b84?w=300&h=200&fit=crop",
          play_genre: "movie",
          play_description: "Iconic soundtracks from legendary movies"
        },
        {
          id_play: 4,
          play_name: "JavaScript Tutorials",
          play_url: "https://youtube.com/playlist?list=example4",
          play_thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
          play_genre: "education",
          play_description: "Complete JavaScript learning course for beginners"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const showAlert = (type, title, description) => {
    api[type]({
      message: title,
      description: description,
      placement: 'topRight',
      duration: 3
    });
  };

  const [formData, setFormData] = useState({
    play_name: '',
    play_url: '',
    play_thumbnail: '',
    play_genre: '',
    play_description: ''
  });

  const form = {
    getFieldValue: (field) => formData[field],
    setFieldsValue: (values) => setFormData(prev => ({ ...prev, ...values })),
    resetFields: () => setFormData({
      play_name: '',
      play_url: '',
      play_thumbnail: '',
      play_genre: '',
      play_description: ''
    }),
    validateFields: () => {
      return new Promise((resolve, reject) => {
        const errors = [];
        if (!formData.play_name || formData.play_name.length < 2) {
          errors.push('Nama playlist wajib diisi minimal 2 karakter');
        }
        if (!formData.play_url) {
          errors.push('URL playlist wajib diisi');
        }
        if (!formData.play_thumbnail) {
          errors.push('URL thumbnail wajib diisi');
        }
        if (!formData.play_genre) {
          errors.push('Genre wajib dipilih');
        }
        
        if (errors.length > 0) {
          reject(new Error(errors.join(', ')));
        } else {
          resolve(formData);
        }
      });
    }
  };

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

      setTimeout(() => {
        const newItem = {
          id_play: Date.now(),
          ...values,
          play_description: values.play_description || ""
        };

        if (isEdit) {
          setDataSources(prev => prev.map(item => 
            item.id_play === idSelected ? { ...item, ...values } : item
          ));
          showAlert("success", "Updated! 🎉", "Playlist berhasil diperbarui");
        } else {
          setDataSources(prev => [...prev, newItem]);
          showAlert("success", "Created! 🚀", "Playlist baru berhasil dibuat");
        }

        onCloseDrawer();
        setSubmitLoading(false);
      }, 1000);
    } catch (err) {
      setSubmitLoading(false);
      showAlert("error", "Oops! 😅", "Terjadi kesalahan, silakan coba lagi");
    }
  };

  const confirmDelete = async (record) => {
    setDataSources(prev => prev.filter(item => item.id_play !== record.id_play));
    showAlert("success", "Deleted! 🗑️", `"${record.play_name}" berhasil dihapus`);
  };

  const handleDrawerEdit = (record) => {
    setIsOpenDrawer(true);
    setIsEdit(true);
    setIdSelected(record.id_play);
    setFormData({
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

  const getGenreInfo = (genre) => {
    return genreOptions.find(g => g.value === genre) || genreOptions[0];
  };

  const openInNewTab = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderStatsCard = () => {
    const totalPlaylists = dataSources.length;

    return (
      <Card
        style={{
          background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBrown} 100%)`,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${colors.brown}`,
          textAlign: 'center',
          marginBottom: '24px'
        }}
      >
        <Text strong style={{ color: colors.brown, fontSize: '16px' }}>TOTAL PLAYLISTS</Text>
        <Title level={2} style={{ color: colors.brown, margin: '8px 0', fontSize: '36px' }}>
          {totalPlaylists}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleDrawer}
          style={{ 
            background: colors.brown,
            borderColor: colors.brown
          }}
        >
          Buat Baru
        </Button>
      </Card>
    );
  };

  const renderDrawer = () => (
    <Drawer
      width={500}
      title={
        <div style={{ color: colors.brown }}>
          {isEdit ? "✏️ Edit Playlist" : "🎵 Tambah Playlist Baru"}
        </div>
      }
      onClose={onCloseDrawer}
      open={isOpenDrawer}
      destroyOnClose
      styles={{
        header: { 
          borderBottom: `2px solid ${colors.brown}`,
          background: colors.cream
        },
        body: { 
          background: colors.cream,
          padding: '24px'
        },
      }}
      extra={
        <Space>
          <Button 
            onClick={onCloseDrawer} 
            disabled={submitLoading}
            style={{
              borderColor: colors.brown,
              color: colors.brown,
              background: colors.cream
            }}
          >
            Batal
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={submitLoading}
            style={{ 
              background: colors.brown, 
              borderColor: colors.brown,
              borderRadius: '8px'
            }}
          >
            {isEdit ? "💾 Update" : "🚀 Buat"}
          </Button>
        </Space>
      }
    >
      <Form layout="vertical">
        <Form.Item
          label={<span style={{ color: colors.brown }}>Nama Playlist</span>}
          required
          rules={[{ required: true, message: 'Nama playlist wajib diisi' }]}
        >
          <Input 
            placeholder="Misal: Lagu Favorit 2023" 
            value={formData.play_name}
            onChange={(e) => setFormData({...formData, play_name: e.target.value})}
            style={{ 
              borderRadius: '8px', 
              background: colors.cream,
              border: `1px solid ${colors.brown}`
            }}
          />
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: colors.brown }}>URL Playlist</span>}
          required
          rules={[{ required: true, message: 'URL playlist wajib diisi' }]}
        >
          <Input 
            placeholder="https://youtube.com/playlist?list=..." 
            value={formData.play_url}
            onChange={(e) => setFormData({...formData, play_url: e.target.value})}
            style={{ 
              borderRadius: '8px', 
              background: colors.cream,
              border: `1px solid ${colors.brown}`
            }}
          />
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: colors.brown }}>URL Thumbnail</span>}
          required
          rules={[{ required: true, message: 'URL thumbnail wajib diisi' }]}
        >
          <Input 
            placeholder="https://example.com/image.jpg" 
            value={formData.play_thumbnail}
            onChange={(e) => setFormData({...formData, play_thumbnail: e.target.value})}
            style={{ 
              borderRadius: '8px', 
              background: colors.cream,
              border: `1px solid ${colors.brown}`
            }}
          />
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: colors.brown }}>Genre</span>}
          required
          rules={[{ required: true, message: 'Genre wajib dipilih' }]}
        >
          <Select
            placeholder="Pilih genre playlist"
            value={formData.play_genre}
            onChange={(value) => setFormData({...formData, play_genre: value})}
            style={{ 
              borderRadius: '8px', 
              background: colors.cream,
              border: `1px solid ${colors.brown}`
            }}
            dropdownStyle={{
              background: colors.cream,
              border: `1px solid ${colors.brown}`
            }}
          >
            {genreOptions.map(option => (
              <Option 
                key={option.value} 
                value={option.value}
                style={{ background: colors.cream }}
              >
                {option.icon} {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: colors.brown }}>Deskripsi (Opsional)</span>}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Deskripsi tentang playlist ini..." 
            value={formData.play_description}
            onChange={(e) => setFormData({...formData, play_description: e.target.value})}
            style={{ 
              borderRadius: '8px', 
              background: colors.cream,
              border: `1px solid ${colors.brown}`
            }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );

  return (
    <div style={{ 
      background: colors.cream, 
      minHeight: '100vh',
      padding: '24px'
    }}>
      {contextHolder}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '32px',
          padding: '32px',
          background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBrown} 100%)`,
          borderRadius: '16px',
          border: `1px solid ${colors.brown}`
        }}>
          <Title 
            level={1} 
            style={{ 
              color: colors.brown, 
              margin: 0,
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}
          >
            ⭐ Playlist Manager
          </Title>
          <Paragraph style={{ 
            color: colors.brown, 
            fontSize: '1.1rem',
            margin: '12px 0 24px 0'
          }}>
            Atur dan nikmati berbagai konten pilihan Anda dalam satu tempat
          </Paragraph>
        </div>

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Filters */}
        <Card style={{ 
          marginBottom: '24px',
          borderRadius: '12px',
          background: colors.cream,
          border: `1px solid ${colors.brown}`
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Text strong style={{ 
                display: 'block', 
                marginBottom: '12px', 
                color: colors.brown,
                fontSize: '16px'
              }}>
                Filter Genre
              </Text>
              <Space wrap>
                <Tag 
                  onClick={() => setActiveFilter('all')}
                  style={{ 
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: activeFilter === 'all' ? colors.brown : colors.cream,
                    color: activeFilter === 'all' ? colors.cream : colors.brown,
                    border: `1px solid ${colors.brown}`,
                    fontWeight: 'bold'
                  }}
                >
                  🌟 Semua ({dataSources.length})
                </Tag>
                {genreOptions.map(option => {
                  const count = dataSources.filter(item => item.play_genre === option.value).length;
                  return (
                    <Tag
                      key={option.value}
                      onClick={() => setActiveFilter(option.value)}
                      style={{ 
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        background: activeFilter === option.value ? colors.brown : colors.cream,
                        color: activeFilter === option.value ? colors.cream : colors.brown,
                        border: `1px solid ${colors.brown}`,
                        fontWeight: 'bold'
                      }}
                    >
                      {option.icon} {option.label} ({count})
                    </Tag>
                  );
                })}
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ 
                display: 'block', 
                marginBottom: '12px', 
                color: colors.brown,
                fontSize: '16px'
              }}>
                <SearchOutlined /> Pencarian
              </Text>
              <Input
                prefix={<SearchOutlined style={{ color: colors.brown }} />}
                placeholder="Cari playlist, genre, atau deskripsi..."
                allowClear
                size="large"
                onChange={(e) => handleSearch(e.target.value)}
                style={{ 
                  borderRadius: '12px',
                  border: `1px solid ${colors.brown}`,
                  background: colors.cream
                }}
              />
            </Col>
          </Row>
        </Card>

        {/* Content Grid */}
        {isLoading ? (
          <Card style={{ 
            borderRadius: '12px', 
            background: colors.cream,
            border: `1px solid ${colors.brown}`
          }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        ) : filteredPlaylists.length === 0 ? (
          <Card style={{ 
            borderRadius: '12px',
            textAlign: 'center',
            padding: '40px',
            background: colors.cream,
            border: `1px solid ${colors.brown}`
          }}>
            <Empty
              description={
                <div>
                  <Title level={3} style={{ color: colors.brown }}>
                    {searchText ? "🔍 Tidak ada hasil" : "📝 Belum ada playlist"}
                  </Title>
                  <Text style={{ color: colors.brown, fontSize: '16px' }}>
                    {searchText 
                      ? `Tidak ditemukan playlist dengan kata kunci "${searchText}"`
                      : "Mulai buat playlist pertama Anda untuk mengelola koleksi media favorit"
                    }
                  </Text>
                </div>
              }
            />
            {!searchText && (
              <Button 
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleDrawer}
                style={{ 
                  background: colors.brown,
                  borderRadius: '8px',
                  marginTop: '16px'
                }}
              >
                Buat Playlist Pertama
              </Button>
            )}
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredPlaylists.map((item) => {
              const genreInfo = getGenreInfo(item.play_genre);
              return (
                <Col xs={24} sm={12} lg={8} xl={6} key={item.id_play}>
                  <Card
                    hoverable
                    style={{ 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: colors.cream,
                      border: `1px solid ${colors.brown}`,
                      transition: 'all 0.3s ease',
                      height: '100%'
                    }}
                    cover={
                      <div style={{ 
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <img
                          alt="playlist thumbnail"
                          src={item.play_thumbnail}
                          style={{ 
                            height: '200px', 
                            width: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/300x200/${colors.cream.substring(1)}/${colors.brown.substring(1)}?text=🎵+No+Image`;
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px'
                        }}>
                          <Tag 
                            color={colors.brown}
                            style={{
                              borderRadius: '20px',
                              fontWeight: 'bold',
                              border: 'none'
                            }}
                          >
                            {genreInfo.icon} {genreInfo.label}
                          </Tag>
                        </div>
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px'
                        }}>
                          <Tooltip title="Buka di tab baru">
                            <Button 
                              type="primary"
                              shape="circle"
                              icon={<YoutubeOutlined />}
                              style={{ 
                                background: colors.brown,
                                border: 'none'
                              }}
                              onClick={() => openInNewTab(item.play_url)}
                            />
                          </Tooltip>
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: `linear-gradient(transparent, ${colors.brown}80)`,
                          height: '60px'
                        }} />
                      </div>
                    }
                    actions={[
                      <Tooltip title="Edit playlist" key="edit">
                        <EditOutlined 
                          onClick={() => handleDrawerEdit(item)}
                          style={{ 
                            color: colors.brown,
                            fontSize: '18px'
                          }}
                        />
                      </Tooltip>,
                      <Tooltip title="Bagikan" key="share">
                        <ShareAltOutlined 
                          style={{ 
                            color: colors.brown,
                            fontSize: '18px'
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(item.play_url);
                            showAlert("success", "Copied! 📋", "Link berhasil disalin");
                          }}
                        />
                      </Tooltip>,
                      <Popconfirm
                        key="delete"
                        title="Hapus playlist"
                        description={`Yakin ingin menghapus "${item.play_name}"?`}
                        onConfirm={() => confirmDelete(item)}
                        okText="Ya, Hapus"
                        cancelText="Batal"
                        okButtonProps={{ 
                          style: { 
                            background: colors.brown, 
                            borderColor: colors.brown 
                          }
                        }}
                      >
                        <Tooltip title="Hapus playlist">
                          <DeleteOutlined 
                            style={{ 
                              color: colors.brown,
                              fontSize: '18px'
                            }} 
                          />
                        </Tooltip>
                      </Popconfirm>
                    ]}
                  >
                    <div style={{ padding: '8px 0' }}>
                      <Title 
                        level={4} 
                        style={{ 
                          color: colors.brown,
                          margin: '0 0 8px 0',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                        ellipsis={{ tooltip: item.play_name }}
                      >
                        {item.play_name}
                      </Title>
                      <Paragraph 
                        style={{ 
                          color: colors.brown,
                          opacity: 0.7,
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.4'
                        }}
                        ellipsis={{ rows: 2, tooltip: item.play_description }}
                      >
                        {item.play_description || "Tidak ada deskripsi"}
                      </Paragraph>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Render Drawer */}
        {renderDrawer()}
      </div>
    </div>
  );
};

export default Playlist;