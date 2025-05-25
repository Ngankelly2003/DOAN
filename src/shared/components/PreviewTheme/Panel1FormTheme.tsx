import React, { useEffect, useState } from "react";
import { Form, Radio, Space, RadioChangeEvent } from "antd";
import { Theme_Option, Theme_arrary } from "@/shared/utils/theme/theme";
import {
  THEME_DATA_DEFAULT,
  THEME_DATA_THREE,
  THEME_DATA_TWO,
} from "@/shared/utils/theme/themeOption";
import { Theme } from "@/shared/utils/theme/type";
import { useTheme } from "@/app/(provider)/ThemeProvider";

export const Themes: { [key in Theme_Option]: Theme } = {
  [Theme_Option.THEME1]: THEME_DATA_DEFAULT,
  [Theme_Option.THEME2]: THEME_DATA_TWO,
  [Theme_Option.THEME3]: THEME_DATA_THREE,
};
const Panel1FormTheme = () => {
  const { themeData, setCurrentTheme } = useTheme();

  const [selectedLayout, setSelectedLayout] = useState(Theme_Option.THEME1);

  const handleLayoutChange = (e: RadioChangeEvent) => {
    setSelectedLayout(e.target.value);
  };

  useEffect(() => {
    setCurrentTheme(() => Themes[selectedLayout]);
  }, [selectedLayout]);

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
      color: "rgba(0, 0, 0, 0.88)",
    };
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Danh sách chủ đề">
        <Radio.Group
          style={{ display: "flex", flexDirection: "column" }}
          value={selectedLayout}
          onChange={handleLayoutChange}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {Theme_arrary.map((layout) => (
              <Radio
                key={layout}
                value={layout}
                checked={themeData === Themes[selectedLayout]}
                style={getRadioStyle(layout)}
              >
                {`Chủ đề ${layout.slice(-1)}`}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export default Panel1FormTheme;
