import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: '恒大文旅城邻里拼车 - 业主公益通勤互助平台',
  description: '专为西安恒大文化旅游城业主量身打造的公益邻里通勤拼车撮合与预约管理小程序，支持车找人、人找车、高精度路线匹配、路线规划与行程预约管理。',
  openGraph: {
    title: '恒大文旅城邻里拼车 - 业主公益通勤互助平台',
    description: '专为西安恒大文化旅游城业主量身打造的公益邻里通勤拼车撮合与预约管理小程序。',
    type: 'website',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
