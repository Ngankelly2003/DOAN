"use client";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  Statistic,
  Row,
  Col,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createAdvertisingField,
  deleteAdvertisingField,
  getAdvertisingFields,
  updateAdvertisingField,
} from "@/service/store/advertising-field/advertising-field.api";
import { useDispatch, useSelector } from "react-redux";
import {
  AdvertisingFieldSelectors,
  resetEntity,
} from "@/service/store/advertising-field/advertising-field.reducer";
import { IAdvertisingField } from "@/model/advertisingField.model";
import { RootState } from "@/service/store/reducers";
import { toast } from "react-toastify";

const AdvertisingFieldManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);
  const fields = useSelector(AdvertisingFieldSelectors.selectAll);
  const { updateStatusUser, deleteStatusUser } = useSelector(
    (state: RootState) => state.advertisingField.initialState
  );
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(getAdvertisingFields() as any);
    })();
  }, []);

  useEffect(() => {
    if (updateStatusUser) {
      toast.success(
        `${
          editingFieldId
            ? "cập nhật lĩnh vực quảng cáo thành công"
            : "Thêm mới lĩnh vực quảng cáo thành công"
        }`
      );
      (async () => {
        await dispatch(getAdvertisingFields() as any);
      })();
      dispatch(resetEntity());
    }
  }, [updateStatusUser]);

  useEffect(() => {
    if (deleteStatusUser) {
      toast.success("Xóa lĩnh vực quảng cáo thành công");
      dispatch(getAdvertisingFields() as any);
      dispatch(resetEntity());
    }
  }, [deleteStatusUser]);
  const columns = [
    { title: "ID", dataIndex: "advertisingFieldId", key: "advertisingFieldId" },
    {
      title: "Name",
      dataIndex: "advertisingFieldName",
      key: "advertisingFieldName",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IAdvertisingField) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>
            <EditOutlined className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa lĩnh vực quảng cáo này?"
            onConfirm={() => handleDelete(record.advertisingFieldId)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingFieldId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: IAdvertisingField) => {
    setEditingFieldId(record.advertisingFieldId);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteAdvertisingField(id) as any);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newAd: IAdvertisingField = {
        ...values,
      };

      if (editingFieldId === null) {
        dispatch(createAdvertisingField(newAd) as any);
      } else {
        dispatch(updateAdvertisingField(newAd) as any);
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div className="p-6">
      <Row className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic title="Total Fields" value={fields.length} />
          </Card>
        </Col>
      </Row>

      <Button onClick={handleAdd} className="mb-4">
        <PlusOutlined className="w-4 h-4 mr-2" />
        Add New Field
      </Button>

      <Table
        columns={columns}
        dataSource={fields}
        rowKey="advertisingFieldId"
      />

      <Modal
        open={isModalVisible}
        title={editingFieldId === null ? "Add New Field" : "Edit Field"}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="advertisingFieldName"
            label="Field Name"
            rules={[
              { required: true, message: "Please input the field name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdvertisingFieldManagement;
