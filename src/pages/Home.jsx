import Hero from "../components/Hero/Hero";
import Statistics from "../components/Statistics/Statistics";
// import FeaturedCourses from "../components/FeaturedCourses/FeaturedCourses";
import Categories from "../components/Categories/Categories";
import Features from "../components/Features/Features";
// import Testimonials from "../components/Testimonials/Testimonials";
// import CTA from "../components/CTA/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Statistics />
      {/* <FeaturedCourses /> */}
      <Categories />
      <Features />
      {/* <Testimonials /> */}
      {/* <CTA /> */}
    </>
  );
}