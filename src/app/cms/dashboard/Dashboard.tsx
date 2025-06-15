"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Typography, Progress } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ExceptionOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { userSelectors } from "@/service/store/user/user.reducers";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "@/service/store/user/user.api";
import { advertisementSelectors } from "@/service/store/advertiment/advertiment.reducer";
import { getAdvertiments } from "@/service/store/advertiment/advertiment.api";
import { IAdvertisement, Status } from "@/model/advertisement.model";
import axiosInstance from "@/service/config/axios-interceptor";
import { IRevenue } from "@/model/revenue.model";

const { Title } = Typography;

export function calculateTotalRevenue(data: any) {
  if (!data || !Array.isArray(data)) {
    return "Dữ liệu không hợp lệ";
  }

  const totalRevenue = data.reduce((sum: any, item: any) => {
    return sum + Number(item.amount);
  }, 0);

  const roundedTotal = Number(totalRevenue.toFixed(2));

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedTotal);
}

const columns = [
  {
    title: "Sản phẩm",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Vị trí",
    dataIndex: "sales",
    key: "sales",
  },
  {
    title: "Giá quảng cáo",
    dataIndex: "revenue",
    key: "revenue",
    render: (text: number) => `${text} VNĐ`,
  },
];

const convertChart = (advertiments: IAdvertisement[]) => {
  const data = advertiments.map((item, index) => {
    return {
      name: item.advertisementName,
      value: item.price,
    };
  });
  return data;
};

const convertData = (advertiments: IAdvertisement[]) => {
  const data = advertiments?.slice(0, 4)?.map((item, index) => {
    return {
      key: index,
      product: item.advertisementName,
      sales: item.advertisementPosition,
      revenue: item.price,
    };
  });
  return data;
};
const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector(userSelectors.selectAll);
  const advertiments = useSelector(advertisementSelectors.selectAll);
  const [revenues, setRevenues] = useState<IRevenue[]>([]);
  const [error, setError] = useState<string | null>(null);
  console.log(advertiments);

  useEffect(() => {
    dispatch(getUsers() as any);
    dispatch(getAdvertiments() as any);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/revenue");
        setRevenues(response.data?.data);
        setError(null);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          setError("Bạn cần đăng nhập để xem thông tin doanh thu");
        } else {
          setError("Có lỗi xảy ra khi tải dữ liệu doanh thu");
        }
        console.error("Error fetching revenue:", err);
      }
    })();
  }, []);
  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Tổng quan</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Người dùng mới"
              value={users.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Quảng cáo chưa phê duyệt"
              value={
                advertiments?.filter((item) => item.status === Status.PENDING)
                  .length
              }
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            {error ? (
              <div style={{ color: "#cf1322" }}>{error}</div>
            ) : (
              <Statistic
                title="Doanh thu"
                value={calculateTotalRevenue(revenues)}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            )}
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Quảng cáo đã phê duyệt"
              value={
                advertiments?.filter((item) => item.status === Status.APPROVED)
                  .length
              }
              prefix={<ExceptionOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "24px" }}>
        <Col span={12}>
          <Card title="Doanh thu theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={convertChart(advertiments)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Quảng cáo gần nhất">
            <Table
              dataSource={convertData(advertiments)}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "24px" }}>
        <Col span={8}>
          <Card title="Mục tiêu doanh thu">
            <Progress
              type="circle"
              percent={75}
              format={(percent) => `${percent}%`}
            />
            <p style={{ marginTop: "16px" }}>
              Đã đạt 75% mục tiêu doanh thu quý này
            </p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="So sánh với tháng trước">
            <Statistic
              title="Tăng trưởng"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tỷ lệ hủy">
            <Statistic
              title="Giảm"
              value={3.3}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
