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
  Tooltip,
  Badge
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
  SoundOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { useState, useEffect } from "react";
import { getData, sendData, deleteData } from "/src/utils/api";

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

  const showAlert = (type, title, description) => {
    api[type]({
      message: title,
      description: description,
      placement: 'topRight',
      duration: 3
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
          New Playlist
        </Button>
      </Card>
    );
  };

  const renderDrawer = () => (
    <Drawer
      width={500}
      title={
        <div style={{ color: colors.brown }}>
          {isEdit ? "✏️ Edit Playlist" : "🎵 Add New Playlist"}
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
            Cancel
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
            {isEdit ? "💾 Update" : "🚀 Create"}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={<span style={{ color: colors.brown }}>Playlist Name</span>}
          name="play_name"
          rules={[
            { required: true, message: "Please input playlist name!" },
            { min: 2, message: "Name must be at least 2 characters!" }
          ]}
        >
          <Input 
            placeholder="Enter playlist name" 
            prefix={<CustomerServiceOutlined style={{ color: colors.brown }} />}
            style={{ 
              borderRadius: '8px', 
              background: colors.cream,
              border: `1px solid ${colors.brown}`
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: colors.brown }}>URL</span>}
          name="play_url"
          rules={[
            { required: true, message: "Please input playlist URL!" },
            { type: 'url', message: "Please enter a valid URL!" }
          ]}
        >
          <Input 
            placeholder="Enter URL (e.g., https://youtu.be/...)" 
            prefix={<YoutubeOutlined style={{ color: colors.brown }} />}
            style={{ 
              borderRadius: '8px', 
              background: colors.cream,
              border: `1px solid ${colors.brown}`
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: colors.brown }}>Thumbnail URL</span>}
          name="play_thumbnail"
          rules={[
            { required: true, message: "Please input thumbnail URL!" },
            { type: 'url', message: "Please enter a valid URL!" }
          ]}
        >
          <Input 
            placeholder="Enter image URL (e.g., https://img.youtube.com/...)" 
            prefix={<PictureOutlined style={{ color: colors.brown }} />}
            style={{ 
              borderRadius: '8px', 
              background: colors.cream,
              border: `1px solid ${colors.brown}`
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: colors.brown }}>Genre</span>}
          name="play_genre"
          rules={[{ required: true, message: "Please select genre!" }]}
        >
          <Select
            placeholder="Select genre"
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
          label={<span style={{ color: colors.brown }}>Description (Optional)</span>}
          name="play_description"
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Enter description (optional)" 
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
            Manage and enjoy your favorite content in one place
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
                Filter by Genre
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
                  🌟 All ({dataSources.length})
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
                <SearchOutlined /> Search
              </Text>
              <Input
                prefix={<SearchOutlined style={{ color: colors.brown }} />}
                placeholder="Search playlists, genres, or descriptions..."
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
                    {searchText ? "🔍 No results found" : "📝 No playlists yet"}
                  </Title>
                  <Text style={{ color: colors.brown, fontSize: '16px' }}>
                    {searchText 
                      ? `No playlists found matching "${searchText}"`
                      : "Create your first playlist to manage your favorite media"
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
                Create First Playlist
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
                          <Tooltip title="Open in new tab">
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
                      <Tooltip title="Share" key="share">
                        <ShareAltOutlined 
                          style={{ 
                            color: colors.brown,
                            fontSize: '18px'
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(item.play_url);
                            showAlert("success", "Copied! 📋", "Link copied to clipboard");
                          }}
                        />
                      </Tooltip>,
                      <Popconfirm
                        key="delete"
                        title="Delete playlist"
                        description={`Are you sure to delete "${item.play_name}"?`}
                        onConfirm={() => confirmDelete(item)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ 
                          style: { 
                            background: colors.brown, 
                            borderColor: colors.brown 
                          }
                        }}
                      >
                        <Tooltip title="Delete playlist">
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
                        {item.play_description || "No description"}
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