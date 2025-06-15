"use client";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Card,
  Statistic,
  Row,
  Col,
  InputNumber,
  DatePicker,
  Tag,
} from "antd";
import { EyeOutlined, FileDoneOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdvertiments,
  createAdvertiment,
  updateAdvertiment,
  getAdvertimentByUser,
  revenueAdvertiment,
  exportFileAdvertiment,
} from "@/service/store/advertiment/advertiment.api";
import { advertisementSelectors } from "@/service/store/advertiment/advertiment.reducer";
import { IAdvertisement, Status } from "@/model/advertisement.model";
import dayjs from "dayjs";
import { RootState } from "@/service/store/reducers";

const { Option } = Select;
const { RangePicker } = DatePicker;

const RevenueManagement = () => {
  const advertisements = useSelector(advertisementSelectors.selectAll);
  const { user } = useSelector((state: RootState) => state.user.initialState);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRevenue, setCurrentRevenue] = useState<any>(null);
  const [form] = Form.useForm();
  const [editingAdId, setEditingAdId] = useState<number | null>(null);
  const ads = advertisements.filter(
    (item: IAdvertisement) => item.status === Status.APPROVED
  );
  const { revenue } = useSelector(
    (state: RootState) => state.advertiment.initialState
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (user?.userId) {
      (async () => {
        if (user?.roleEntity?.roleCode === "admin")
          return await dispatch(getAdvertiments() as any);
        await dispatch(getAdvertimentByUser(Number(user?.userId)) as any);
      })();
    }
  }, [user?.userId]);

  const columns = [
    { title: "Name", dataIndex: "advertisementName", key: "advertisementName" },
    {
      title: "Start Date",
      dataIndex: "startTime",
      key: "startTime",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "endTime",
      key: "endTime",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Status) => (
        <Tag color={status === Status.APPROVED ? "green" : "gold"}>
          {status === "APPROVED" ? "Đã phê duyệt" : "Chờ phê duyệt"}
        </Tag>
      ),
    },
    {
      title: "Fields",
      dataIndex: "advertisingFields",
      key: "advertisingFields",
      render: (
        fields: { advertisingFieldId: number; advertisingFieldName: string }[]
      ) => fields?.map((field) => field?.advertisingFieldName).join(", "),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IAdvertisement) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewRevenue(record)}
          >
            Doanh thu
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewRevenue = async (record: IAdvertisement) => {
    setEditingAdId(record.advertisementId);
    form.setFieldsValue({
      ...record,
      timeRange: [dayjs(record.startTime), dayjs(record.endTime)],
      advertisingFields: record.advertisingFields.map(
        (field) => field?.advertisingFieldId
      ),
    });
    try {
      const result = await dispatch(
        revenueAdvertiment(record.advertisementId) as any
      );
      setCurrentRevenue(result.payload?.data);
    } catch (error) {
      console.error("Error fetching revenue:", error);
      setCurrentRevenue(null);
    }
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const [startTime, endTime] = values.timeRange;
      const newAd: IAdvertisement = {
        ...values,
        startTime: startTime.format("YYYY-MM-DD"),
        endTime: endTime.format("YYYY-MM-DD"),
        status: Status.PENDING,
        advertisementId:
          editingAdId ||
          Math.max(...ads.map((ad) => ad.advertisementId), 0) + 1,
        advertisingFields: values.advertisingFields.map((id: number) => {
          return {
            advertisingFieldId: id,
            advertisingFieldName: id === 1 ? "Dien tu" : "Co khi",
          };
        }),
      };

      if (editingAdId === null) {
        dispatch(createAdvertiment(newAd) as any);
      } else {
        dispatch(updateAdvertiment(newAd) as any);
      }
      setIsModalVisible(false);
    });
  };

  const handleExportFile = () => {
    dispatch(exportFileAdvertiment() as any);
  };
  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng số quảng cáo" value={ads.length} />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng giá quảng cáo"
              value={ads.reduce((sum, ad) => sum + ad.price, 0) + " VNĐ"}
            />
          </Card>
        </Col>
      </Row>
      <Button
        className="ml-2"
        icon={<FileDoneOutlined />}
        onClick={handleExportFile}
        style={{ marginBottom: "16px", background: "#0db50d", color: "#FFF" }}
      >
        Xuất file excel
      </Button>
      <Table columns={columns} dataSource={ads} rowKey="advertisementId" />

      <Modal
        title={editingAdId === null ? "Add New Ad" : "Edit Ad"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="advertisementName"
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {currentRevenue !== null && (
            <Form.Item label="Revenue">
              <Input value={currentRevenue.amount} readOnly />
            </Form.Item>
          )}
          <Form.Item
            name="advertisementLink"
            label="Link"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="advertisementPosition"
            label="Position"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="center">Center</Option>
              <Option value="sidebar">Sidebar</Option>
              <Option value="footer">Footer</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="timeRange"
            label="Time Range"
            rules={[{ required: true }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} prefix="$" />
          </Form.Item>
          <Form.Item
            name="advertisingFields"
            label="Advertising Fields"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              <Option value={1}>Dien tu</Option>
              <Option value={3}>Co khi</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RevenueManagement;
