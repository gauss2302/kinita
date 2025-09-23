export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <html> */}
      {/* <body className="min-h-screen bg-gray-100"> */}
      <main>{children}</main>
      {/* </body> */}
      {/* </html> */}
    </>
  );
}
