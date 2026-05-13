import Header from "./_components/header";
import Footer from "./_components/footer";
import FloatingCta from "./_components/floating-cta";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingCta />
    </>
  );
}
