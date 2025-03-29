import React from "react";
import heroPic from "@/assets/pexels-pixabay-247819.jpg"
// import { Button } from "@/components/ui/button";


const HeroBanner: React.FC = () => {
  return (
    <section
      className="relative bg-white text-white h-[90vh] flex items-center"
      style={{
        backgroundImage: `url(${heroPic})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Content */}
      <div
        // initial={{ opacity: 0, y: 30 }}
        // whileInView={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.6, ease: "easeOut" }}
        // viewport={{ once: true }}
        className= "relative z-10 w-full max-w-screen-xl mx-auto px-6 text-center md:text-left"
      >
        {/* <h1 className={headingClass()}>Empower Your Fitness Journey</h1>
        <p className={paragraphClass()}>
          Premium gear for athletes who demand the best.
        </p> */}
        {/* <div className={buttonContainerClass()}>
          <Link to="/dashboard/products">
            <Button variant={"default"} className={buttonClass()}>
              Shop Now
            </Button>
          </Link>
          <Button variant={"ghost"} className={ghostButtonClass()}>
            Learn More
          </Button>
        </div> */}
      </div>
    </section>
  );
};

export default HeroBanner;
