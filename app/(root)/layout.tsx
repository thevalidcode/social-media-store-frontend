import Nav from "@/components/nav";
import Wrapper from "@/components/wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wrapper>
      <Nav />
      {children}
    </Wrapper>
  );
}
