import { Col, Divider, Row } from "antd";
import Panel1Form from "./PreviewHome/Panel1Form";
import { Tab } from "./tab";
import Panel1FormTheme from "./PreviewTheme/Panel1FormTheme";
import { useTheme } from "@/app/(provider)/ThemeProvider";

interface IPreview {
  tab: Tab;
}

export const Preview = (prop: IPreview) => {
  const { tab } = prop;
  const { themeData } = useTheme();
  return (
    <>
      <Row>
        <Col span={5}>
          {tab === Tab.PREVIEW_HOME && <Panel1Form />}
          {tab === Tab.THEME && <Panel1FormTheme />}
        </Col>
        <Col span={0.8}>
          <Divider type="vertical" style={{ height: "100%" }} />
        </Col>
        <Col span={18} className="w-full p-0">
          <div
            style={{
              height: "calc(100vh - 180px)",
              overflow: "hidden",
            }}
          >
            <iframe
              key={JSON.stringify(themeData)}
              width="100%"
              height="100%"
              src="/"
              frameBorder="0"
              style={{ display: "block" }}
            ></iframe>
          </div>
        </Col>
      </Row>
    </>
  );
};
