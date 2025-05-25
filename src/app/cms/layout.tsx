import dynamic from "next/dynamic";

const LayoutClientWrapper = dynamic(() => import("./LayoutClientWrapper"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutClientWrapper>{children}</LayoutClientWrapper>;
}
