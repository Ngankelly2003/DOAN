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
  Tooltip,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CreditCardOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdvertiments,
  createAdvertiment,
  updateAdvertiment,
  deleteAdvertiment,
  getAdvertimentByUser,
  revenueAdvertiment,
  requestApprovalAdvertiment,
} from "@/service/store/advertiment/advertiment.api";
import {
  advertisementSelectors,
  resetEntity,
} from "@/service/store/advertiment/advertiment.reducer";
import { IAdvertisement, Status } from "@/model/advertisement.model";
import dayjs from "dayjs";
import { RootState } from "@/service/store/reducers";
import { createPayment } from "@/service/store/vnpay/vnpay.api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axiosInstance from "@/service/config/axios-interceptor";
import { getAdvertisingFields } from "@/service/store/advertising-field/advertising-field.api";
import { IAdvertisingField } from "@/model/advertisingField.model";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ADVERTISING_FIELDS = [
  { id: 1, name: "Điện tử" },
  { id: 2, name: "Cơ khí" },
  { id: 3, name: "Công nghệ thông tin" },
  { id: 4, name: "Thương mại" },
  { id: 5, name: "Giáo dục" },
  { id: 6, name: "Y tế" },
  { id: 7, name: "Du lịch" },
  { id: 8, name: "Bất động sản" },
];

const AdManagement = () => {
  const ads = useSelector(advertisementSelectors.selectAll);
  const { updateStatusUser, deleteStatusUser, isRequestApproval } = useSelector(
    (state: RootState) => state.advertiment.initialState
  );
  const { user } = useSelector((state: RootState) => state.user.initialState);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingAdId, setEditingAdId] = useState<number | null>(null);
  const [requestAdver, setRequestAdver] = useState<number | null>(null);
  const [urlPayment, setUrlPayment] = useState<string>("");
  const [advertisingFields, setAdvertisingFields] = useState<IAdvertisingField[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<Record<number, string>>({});
  const [transactionRefs, setTransactionRefs] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchAdvertisingFields = async () => {
      try {
        const response = await dispatch(getAdvertisingFields() as any);
        if (response.payload) {
          setAdvertisingFields(response.payload);
        }
      } catch (error) {
        console.error("Error fetching advertising fields:", error);
        toast.error("Không thể tải danh sách lĩnh vực quảng cáo");
      }
    };
    fetchAdvertisingFields();
  }, [dispatch]);

  useEffect(() => {
    if (urlPayment) {
      const a = document.createElement("a");
      a.setAttribute("href", urlPayment), a.setAttribute("target", "_blank");
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [urlPayment]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
      const vnp_TxnRef = queryParams.get("vnp_TxnRef");

      if (vnp_ResponseCode && vnp_TxnRef) {
        try {
          const response = await axiosInstance.get(`/vnpay/payment-callback`, {
            params: queryParams,
          });
          if (response.data === "successful") {
            setPaymentStatus((prev) => ({ ...prev, [vnp_TxnRef]: "success" }));
            toast.success("Thanh toán thành công!");
          } else {
            setPaymentStatus((prev) => ({ ...prev, [vnp_TxnRef]: "failed" }));
            toast.error("Thanh toán thất bại. Vui lòng thử lại.");
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
          toast.error("Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.");
        }
      }
    };

    checkPaymentStatus();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.roleEntity?.roleCode === "admin") {
        await dispatch(getAdvertiments() as any);
      } else {
        await dispatch(getAdvertimentByUser(Number(user?.userId)) as any);
      }
    };
    fetchData();
  }, [user?.userId]);

  useEffect(() => {
    if (updateStatusUser) {
      toast.success(
        `${editingAdId ? "Chỉnh sửa" : "Tạo mới"} quảng cáo thành công`
      );
      dispatch(resetEntity());
      setIsModalVisible(false);
      (async () => {
        if (user?.roleEntity?.roleCode === "admin")
          return await dispatch(getAdvertiments() as any);
        await dispatch(getAdvertimentByUser(Number(user?.userId)) as any);
      })();
    }
  }, [updateStatusUser]);

  useEffect(() => {
    if (deleteStatusUser) {
      toast.success(`Xóa quảng cáo thành công`);
      dispatch(resetEntity());
      setIsModalVisible(false);
      (async () => {
        if (user?.roleEntity?.roleCode === "admin")
          return await dispatch(getAdvertiments() as any);
        await dispatch(getAdvertimentByUser(Number(user?.userId)) as any);
      })();
    }
  }, [deleteStatusUser]);

  useEffect(() => {
    if (isRequestApproval) {
      toast.success(`Gửi phê duyệt quảng cáo thành công`);
      dispatch(resetEntity());
      setIsModalVisible(false);
      (async () => {
        if (user?.roleEntity?.roleCode === "admin")
          return await dispatch(getAdvertiments() as any);
        await dispatch(getAdvertimentByUser(Number(user?.userId)) as any);
      })();
    }
  }, [isRequestApproval]);

  useEffect(() => {
    const savedRefs = localStorage.getItem('transactionRefs');
    if (savedRefs) {
      setTransactionRefs(JSON.parse(savedRefs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactionRefs', JSON.stringify(transactionRefs));
    console.log("Transaction references updated:", transactionRefs);
  }, [transactionRefs]);

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 70,
    },
    { title: "Name", dataIndex: "advertisementName", key: "advertisementName" },
    {
      title: "Link",
      dataIndex: "advertisementLink",
      key: "advertisementLink",
      render: (_: any, record: IAdvertisement) => {
        const link = record?.advertisementLink ?? "";
        // Check if the link is an email address
        if (link.includes('@')) {
          return <span>{link}</span>;
        }
        // Check if the link is a valid URL
        if (link.startsWith('http://') || link.startsWith('https://')) {
          return (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          );
        }
        // If not a valid URL, just display the text
        return <span>{link}</span>;
      },
      width: 100,
      ellipsis: true,
    },
    {
      title: "Position",
      dataIndex: "advertisementPosition",
      key: "advertisementPosition",
    },
    {
      title: "Start Date",
      dataIndex: "startTime",
      key: "startTime",
      render: (text: string) => text ? dayjs(text).format("YYYY-MM-DD") : "",
    },
    {
      title: "End Date",
      dataIndex: "endTime",
      key: "endTime",
      render: (text: string) => text ? dayjs(text).format("YYYY-MM-DD") : "",
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
      title: "Mã hóa đơn",
      key: "transactionRef",
      render: (_: any, record: IAdvertisement) => (
        <span>{transactionRefs[record.advertisementId] || "-"}</span>
      ),
    },
    ...(user?.roleEntity?.roleCode === "admin"
      ? [
          {
            title: "Fields",
            dataIndex: "advertisingFields",
            key: "advertisingFields",
            render: (fields: any[]) => {
              if (!fields || !Array.isArray(fields)) return '';
              return fields
                .map(field => {
                  const id = typeof field === 'object' ? field?.advertisingFieldId : field;
                  const found = advertisingFields.find(f => f.advertisingFieldId === id);
                  return found
                    ? found.advertisingFieldName
                    : (field?.advertisingFieldName || field?.name || '');
                })
                .filter(Boolean)
                .join(", ");
            },
          },
        ]
      : []),
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IAdvertisement) => (
        <Space size="middle">
          {user?.roleEntity?.roleCode === "admin" && (
            <Tooltip title="Chỉnh sửa">
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              ></Button>
            </Tooltip>
          )}

          {record.status !== Status.APPROVED &&
            user?.roleEntity?.roleCode === "user" && (
              <Tooltip title="Chỉnh sửa">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                ></Button>
              </Tooltip>
            )}

          {user?.roleEntity?.roleCode === "user" &&
            record.status !== Status.APPROVED &&
            record.advertisementId !== requestAdver && (
              <Popconfirm
                title="Bạn có chắc chắn muốn gửi phê duyệt quảng cáo này?"
                onConfirm={() => {
                  handleSendApproval(record);
                }}
                okText="Có"
                cancelText="Không"
              >
                <Tooltip title="Gửi phê duyệt">
                  <Button icon={<FormOutlined />}></Button>
                </Tooltip>
              </Popconfirm>
            )}
          {user?.roleEntity?.roleCode === "user" &&
            record.status === Status.APPROVED && (
              <Tooltip title={
                transactionRefs[record.advertisementId]
                  ? "Đã thanh toán - Không thể thanh toán lại"
                  : paymentStatus[record.advertisementId] === "failed"
                  ? "Thanh toán thất bại - Nhấn để thử lại"
                  : "Thanh toán"
              }>
                <Button
                  icon={<CreditCardOutlined />}
                  onClick={() => handlePayment(record)}
                  danger={paymentStatus[record.advertisementId] === "failed"}
                  disabled={!!transactionRefs[record.advertisementId]}
                ></Button>
              </Tooltip>
            )}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa quảng cáo này?"
            onConfirm={() => handleDelete(record.advertisementId)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} danger></Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingAdId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handlePayment = (record: IAdvertisement) => {
    dispatch(revenueAdvertiment(record.advertisementId) as any).then(
      (data: any) => {
        const revenue = data.payload?.data;
        const amount = Number(revenue.amount);
        const amountInVND = Math.round(amount * 100);
        dispatch(
          createPayment({
            amount: amountInVND,
            orderInfo: `Thanh toán ${record.advertisementName}`,
          }) as any
        ).then((data: { payload: string }) => {
          const paymentUrl = data.payload;
          // Extract transaction reference from payment URL
          const urlParams = new URLSearchParams(paymentUrl.split('?')[1]);
          const vnp_TxnRef = urlParams.get('vnp_TxnRef');
          if (vnp_TxnRef) {
            const newRefs = { ...transactionRefs, [record.advertisementId]: vnp_TxnRef };
            updateTransactionRefs(newRefs);
          }
          setUrlPayment(paymentUrl);
        });
      }
    );
  };

  const handleEdit = (record: IAdvertisement) => {
    setEditingAdId(record.advertisementId);
    form.setFieldsValue({
      ...record,
      timeRange: [dayjs(record.startTime), dayjs(record.endTime)],
      advertisingFields: record.advertisingFields.map(
        (field) => field?.advertisingFieldId
      ),
    });
    setIsModalVisible(true);
  };

  const handleSendApproval = (record: IAdvertisement) => {
    dispatch(requestApprovalAdvertiment(record.advertisementId) as any);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteAdvertiment(id) as any);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const [start, end] = values?.timeRange || [];
      const startDate = start ? dayjs(start).format("YYYY-MM-DD") : null;
      const endDate = end ? dayjs(end).format("YYYY-MM-DD") : null;
      if (editingAdId === null && requestAdver === null) {
        const newAd: any = {
          advertisementName: values.advertisementName,
          advertisementLink: values.advertisementLink,
          advertisementPosition: values.advertisementPosition,
          startDate,
          endDate,
          advertisingFieldIds: values?.advertisingFields?.map((id: number) => id),
          price: String(values.price),
          userId: user?.userId,
        };
        dispatch(createAdvertiment(newAd) as any);
      } else if (requestAdver && editingAdId === null) {
        dispatch(requestApprovalAdvertiment(requestAdver) as any);
      } else {
        const Ad: any = {
          advertisementName: values.advertisementName,
          advertisementLink: values.advertisementLink,
          advertisementPosition: values.advertisementPosition,
          startDate,
          endDate,
          price: String(values.price),
          advertisementId:
            editingAdId ||
            Math.max(...ads.map((ad) => ad.advertisementId), 0) + 1,
          advertisingFieldIds: values.advertisingFields.map((id: number) => id),
          userId: user?.roleEntity?.roleCode === "admin" ? null : user?.userId,
        };
        dispatch(updateAdvertiment(Ad) as any);
      }
      setIsModalVisible(false);
    });
  };

  const updateTransactionRefs = (newRefs: Record<number, string>) => {
    setTransactionRefs(newRefs);
    localStorage.setItem('transactionRefs', JSON.stringify(newRefs));
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng số quảng cáo" value={ads.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Quảng cáo chưa phê duyệt"
              value={ads.filter((ad) => ad.status === Status.PENDING).length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Quảng cáo đã phê duyệt"
              value={ads.filter((ad) => ad.status === Status.APPROVED).length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng giá quảng cáo"
              value={ads.reduce((sum, ad) => sum + ad.price, 0) + " VNĐ"}
            />
          </Card>
        </Col>
      </Row>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: "16px" }}
      >
        Thêm mới quảng cáo
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
              <Option value="left">Left</Option>
              <Option value="right">Right</Option>
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
            label="Fields"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một lĩnh vực' }]}
          >
            <Select mode="multiple" placeholder="Chọn lĩnh vực quảng cáo">
              {advertisingFields.map(field => (
                <Option key={field.advertisingFieldId} value={field.advertisingFieldId}>
                  {field.advertisingFieldName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdManagement;
