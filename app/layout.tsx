import "./globals.css";
import './colors.css'; // путь может отличаться

import { UserProvider } from "./components/UserContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}