import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/assets/scss/index.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "./(provider)/ThemeProvider";
import { Providers } from "./(provider)/Provider";
import { AuthProvider } from "./(provider)/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import ChatBot from "@/components/chat/ChatBot";

const inter = Inter({ subsets: ["latin"] });
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Tin mới",
  description: "Website tin mới tổng hợp rss",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <ErrorBoundary>
              <ThemeProvider>
                <AntdRegistry>{children}</AntdRegistry>
                <ChatBot />
              </ThemeProvider>
              <ToastContainer />
            </ErrorBoundary>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
