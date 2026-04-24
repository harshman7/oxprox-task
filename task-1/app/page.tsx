import HomeContent from "@/app/components/HomeContent";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HomeContent />
      </main>
      <SiteFooter />
    </>
  );
}
