import { FC, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "@/service/store/user/user.api";
import { RootState } from "@/service/store/reducers";

const { Title } = Typography;

const UserInfoForm: FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { user } = useSelector((state: RootState) => state.user.initialState);

  useEffect(() => {
    dispatch(getUserInfo() as any);
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.userName,
        email: user.email,
        phone: user.phoneNumber,
        address: user.address,
      });
    }
  }, [user, form]);

  const onFinish = (values: any) => {
    message.success("Thông tin đã được cập nhật thành công!");
    console.log("Received values of form: ", values);
  };

  return (
    <Card>
      <Title level={4}>Thông tin cá nhân</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", message: "Email không hợp lệ!" }]}
        >
          <Input prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input prefix={<PhoneOutlined />} />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ">
          <Input prefix={<HomeOutlined />} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật thông tin
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserInfoForm;
