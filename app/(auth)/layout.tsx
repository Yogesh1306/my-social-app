import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} bg-dark-1`}>
      <div className="w-full flex justify-center items-center min-h-screen">
        {children}
      </div>
    </div>
  );
}
