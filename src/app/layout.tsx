import './globals.css';

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import ReactQueryProvider from '@/providers/ReactQueryProvider';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
