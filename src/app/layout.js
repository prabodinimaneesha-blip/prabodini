import "./globals.css";

export const metadata = {
  title: "Viola Gifts - Home",
  description: "Discover the perfect gift at Viola Gifts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
