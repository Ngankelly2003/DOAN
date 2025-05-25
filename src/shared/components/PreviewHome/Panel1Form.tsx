import React, { useState, useEffect } from "react";
import { Form, Input, Select, Radio, Space, RadioChangeEvent } from "antd";
import { Theme_arrary, Theme_Option } from "@/shared/utils/theme/theme";
import { useTheme } from "@/app/(provider)/ThemeProvider";
import { Themes } from "../PreviewTheme/Panel1FormTheme";

const { Option } = Select;

const Panel1Form = () => {
  const [selectedLayout, setSelectedLayout] = useState("layout1");
  const { themeData, setCurrentTheme } = useTheme();
  const [form] = Form.useForm();

  const getCurrentThemeOption = () => {
    return Object.entries(Themes).find(
      ([, theme]) => theme === themeData
    )?.[0] as Theme_Option | undefined;
  };

  useEffect(() => {
    const currentThemeOption = getCurrentThemeOption();
    if (currentThemeOption) {
      form.setFieldsValue({ page: currentThemeOption });
    }
  }, [themeData, form]);

  const handleLayoutChange = (e: RadioChangeEvent) => {
    setSelectedLayout(e.target.value);
  };

  const handleThemeChange = (value: Theme_Option) => {
    setCurrentTheme(() => Themes[value]);
  };

  const getRadioStyle = (value: string) => {
    const baseStyle = {
      borderRadius: "8px",
      padding: "10px",
      width: "100%",
      marginBottom: "6px",
    };

    if (value === selectedLayout) {
      return {
        ...baseStyle,
        backgroundColor: "#6c757d",
        color: "#fff",
      };
    }

    return {
      ...baseStyle,
      backgroundColor: "#f0f0f0",
      color: "rgba(0, 0, 0, 0.88)", // Default text color in Ant Design
    };
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        className="!mb-[8px]"
        name="name"
        label={<span>Tên giao diện</span>}
        rules={[{ required: true, message: "Vui lòng nhập tên giao diện" }]}
        initialValue="Trang chủ"
      >
        <Input />
      </Form.Item>

      <Form.Item
        className="!mb-[8px]"
        name="page"
        label={<span>Chủ đề</span>}
        rules={[{ required: true, message: "Vui lòng chọn trang" }]}
      >
        <Select placeholder="Chọn chủ đề..." onChange={handleThemeChange}>
          {Theme_arrary.map((theme: Theme_Option) => (
            <Option key={theme} value={theme}>
              {theme}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Danh sách khung layout">
        <Radio.Group
          style={{ display: "flex", flexDirection: "column" }}
          value={selectedLayout}
          onChange={handleLayoutChange}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {["layout1", "layout2", "layout3", "layout4"].map((layout) => (
              <Radio key={layout} value={layout} style={getRadioStyle(layout)}>
                {`Layout ${layout.slice(-1)}`}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export default Panel1Form;
