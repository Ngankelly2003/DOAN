"use client";
import { useCallback, useEffect } from "react";
import { Table, Button, Popconfirm, Tag } from "antd";
import { DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { IApproval } from "@/model/Approval.model";
import { Status } from "@/model/advertisement.model";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteApproval,
  getApprovals,
} from "@/service/store/approval/approval.api";
import { ApprovalSelectors } from "@/service/store/approval/approval.reducer";
import { approvalAdvertiment } from "@/service/store/advertiment/advertiment.api";
import { RootState } from "@/service/store/reducers";
import { toast } from "react-toastify";
import { resetEntity } from "@/service/store/advertiment/advertiment.reducer";

const ApprovalManagement = () => {
  const dispatch = useDispatch();
  const approvals = useSelector(ApprovalSelectors.selectAll);
  const { approvalStatus } = useSelector(
    (state: RootState) => state.advertiment.initialState
  );
  const { deleteStatus } = useSelector(
    (state: RootState) => state.approval.initialState
  );
  const fetchApprovals = useCallback(() => {
    dispatch(getApprovals() as any);
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  useEffect(() => {
    if (approvalStatus) {
      toast.success("Phê duyệt thành công");
      dispatch(resetEntity());
      fetchApprovals();
    }
  }, [approvalStatus]);

  useEffect(() => {
    if (deleteStatus) {
      toast.success("Xóa thành công");
      dispatch(resetEntity());
      fetchApprovals();
    }
  }, [deleteStatus]);

  const handleDelete = (id: number) => {
    dispatch(deleteApproval(id) as any);
  };

  const handleApprove = (id: number) => {
    dispatch(approvalAdvertiment(id) as any);
  };

  const columns: ColumnsType<IApproval> = [
    {
      title: "ID",
      dataIndex: ["advertisement", "advertisementId"],
      key: "advertisementId",
    },
    {
      title: "Tên quảng cáo",
      dataIndex: ["advertisement", "advertisementName"],
      key: "advertisementName",
    },
    {
      title: "Vị trí",
      dataIndex: ["advertisement", "advertisementPosition"],
      key: "advertisementPosition",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: ["advertisement", "startDate"],
      key: "startDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: ["advertisement", "endDate"],
      key: "endDate",
    },
    {
      title: "Giá",
      dataIndex: ["advertisement", "price"],
      key: "price",
      render: (price: number) => `$${price?.toLocaleString()}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: Status) => (
        <Tag color={status === Status.APPROVED ? "green" : "gold"}>
          {status === "APPROVED" ? "Đã phê duyệt" : "Chờ phê duyệt"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa quảng cáo này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
          {record.status === Status.PENDING && (
            <Popconfirm
              title="Bạn có chắc chắn muốn duyệt quảng cáo này?"
              onConfirm={() =>
                handleApprove(record.advertisement?.advertisementId)
              }
              okText="Có"
              cancelText="Không"
            >
              <Button
                icon={<CheckOutlined />}
                type="primary"
                style={{ marginLeft: "8px" }}
              >
                Phê duyệt
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={approvals} rowKey="id" />;
};

export default ApprovalManagement;
