import Wrapper from "@/components/wrapper";
// import FaqSection from "./components/faq";
import { HeroSection } from "./components/hero";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Wrapper className="mt-8 ax-w-[90rem]">
        <>{/* <ImageSection /> */}
        {/* <FaqSection /> */}</>
      </Wrapper>
    </>
  );
}
