"use client";
import { useState, useEffect } from "react";
import { Table, Button, Modal, Popconfirm, Tooltip } from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createRole,
  updateRole,
  deleteRole,
  getRoles,
} from "@/service/store/role/role.api";
import { RootState } from "@/service/store/reducers";
import { resetEntity, roleSelectors } from "@/service/store/role/role.reducer";
import { toast } from "react-toastify";
import { IRole } from "@/model/role.model";

const RoleSchema = Yup.object().shape({
  roleCode: Yup.string().required("Required"),
  description: Yup.string(),
});

const RoleManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const dispatch = useDispatch();
  const roles = useSelector(roleSelectors.selectAll);
  const { loading, deleteStatusRole, updateStatusRole } = useSelector(
    (state: RootState) => state.role.initialState
  );

  useEffect(() => {
    dispatch(getRoles() as any);
  }, []);

  useEffect(() => {
    if (updateStatusRole) {
      toast.success(
        `${
          editingRole
            ? "Cập nhật vai trò thành công"
            : "Tạo mới vai trò thành công"
        }`
      );
      dispatch(getRoles() as any);
      dispatch(resetEntity());
    }
  }, [updateStatusRole]);

  useEffect(() => {
    if (deleteStatusRole) {
      toast.success(`Xóa vai trò thành công`);
      dispatch(getRoles() as any);
      dispatch(resetEntity());
    }
  }, [deleteStatusRole]);

  const showModal = (role: any = null) => {
    setEditingRole(role);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRole(null);
  };

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    if (editingRole) {
      dispatch(updateRole({ id: editingRole.id, ...values }) as any);
    } else {
      dispatch(createRole(values) as any);
    }
    setSubmitting(false);
    setIsModalVisible(false);
    setEditingRole(null);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteRole(Number(id)) as any);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Code",
      dataIndex: "roleCode",
      key: "roleCode",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        return date ? (
          new Date(date).toLocaleDateString()
        ) : (
          <span>Chưa cập nhập</span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IRole) => (
        <span>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tài khoản này?"
            onConfirm={() => {
              handleDelete(record.roleId);
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
        </span>
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
        Add New Role
      </Button>
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingRole ? "Edit Role" : "Add New Role"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Formik
          initialValues={{
            roleCode: editingRole?.roleCode || "",
            description: editingRole?.description || "",
          }}
          validationSchema={RoleSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: "16px" }}>
                <label htmlFor="roleCode">Code</label>
                <Field
                  name="roleCode"
                  as="input"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "2px",
                  }}
                />
                {errors.roleCode && touched.roleCode && (
                  <div style={{ color: "red" }}>{errors.roleCode as any}</div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label htmlFor="description">Description</label>
                <Field
                  name="description"
                  as="textarea"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "2px",
                  }}
                />
                {errors.description && touched.description && (
                  <div style={{ color: "red" }}>
                    {errors.description as any}
                  </div>
                )}
              </div>

              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {editingRole ? "Update" : "Create"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default RoleManagement;
