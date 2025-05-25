"use client";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Radio,
  Tooltip,
  Popconfirm,
} from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/service/store/user/user.api";
import { resetEntity, userSelectors } from "@/service/store/user/user.reducers";
import { IUser } from "@/model/user.model";
import { RootState } from "@/service/store/reducers";
import { toast } from "react-toastify";
import { getRoles } from "@/service/store/role/role.api";
import { roleSelectors } from "@/service/store/role/role.reducer";

const UserManagement = () => {
  const dispatch = useDispatch();
  const roles = useSelector(roleSelectors.selectAll);
  const users = useSelector(userSelectors.selectAll);
  const { updateStatusUser, deleteStatusUser } = useSelector(
    (state: RootState) => state.user.initialState
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getUsers() as any);
    dispatch(getRoles() as any);
  }, []);

  useEffect(() => {
    if (updateStatusUser) {
      toast.success(
        `${
          editingUser
            ? "Cập nhật tài khoản thành công"
            : "Tạo mới tài khoản thành công"
        }`
      );
      dispatch(getUsers() as any);
      dispatch(resetEntity());
      return;
    }
    if (deleteStatusUser) {
      toast.success(`Xóa tài khoản thành công`);
      dispatch(getUsers() as any);
      dispatch(resetEntity());
    }
  }, [updateStatusUser, deleteStatusUser]);

  const showModal = (user: any = null) => {
    setEditingUser(user);
    form.setFieldsValue(
      user
        ? { ...user, roleId: user.roleEntity.roleId, password: "" }
        : {
            userName: "",
            email: "",
            phoneNumber: "",
            address: "",
            userPassword: "",
            roleId: roles.find(
              (role) => role.roleCode.toLowerCase() === "admin"
            )?.roleId,
          }
    );
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);

        setIsModalVisible(false);
        if (editingUser) {
          const updateData = values.password
            ? values
            : { ...values, password: undefined };
          dispatch(
            updateUser({ ...updateData, userId: editingUser.userId }) as any
          );
        } else {
          dispatch(createUser(values) as any);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: "ID", dataIndex: "userId", key: "userId" },
    { title: "Name", dataIndex: "userName", key: "userName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Role",
      dataIndex: ["roleEntity", "roleCode"],
      key: "role",
      render: (roleCode: string) => roleCode?.toUpperCase(),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: IUser) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tài khoản này?"
            onConfirm={() => {
              dispatch(deleteUser(Number(record.userId)) as any);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button type="link" danger>
                Delete
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: "16px" }}
      >
        Add User
      </Button>
      <Table columns={columns} dataSource={users} rowKey="userId" />
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="user_form">
          <Form.Item
            name="userName"
            label="User Name"
            rules={[{ required: true, message: "Please input the user name!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="userPassword"
              label="Password"
              rules={[
                {
                  required: !editingUser,
                  message: "Please input the password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long",
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
          )}
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Radio.Group>
              {roles.map((role) => (
                <Radio key={role.roleId} value={role.roleId}>
                  {role.roleCode.toUpperCase()}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
