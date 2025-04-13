import gorilla from "@/assets/1550536471.svg"
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";

const HomePage = () => {
    return (
        <div className="w-full text-center mt-5 md:mt-20 max-w-6xl flex items-center flex-col px-4 md:px-5 lg:px-10 m-auto gap-5 sm:gap-15">
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-main-color leading-[130%] font-semibold [-webkit-text-stroke:_1px_oklch(0.555_0.163_52.998)]">Start Your Journey in Sign Language Today</h1>
           
          
                {/* <span> At <span className="text-xl font-semibold italic">K<span className="text-main-color">o</span>K<span className="text-main-color">o</span></span>, we believe in the power of movement. Our specialized exercises strengthen the muscles used in sign language, helping you sign with greater clarity and confidence. Inspired by our gorilla mascot, we blend fitness with language skills—because stronger hands tell stronger stories. Join the Koko community today.           </span> */}
              
          
                    <div className="relative w-full ms:max-w-lg md:max-w-72 h-60 flex justify-center items-end max-w-xs">
                <img src={gorilla} alt="Mascot" className="absolute -top-2 group-hover:translate-y-2 left-1/2 -translate-x-1/2 size-60 z-40"/>
                    <Link to={'/catalog'} className="w-full group z-50">
                        <Button className="w-full h-13 text-3xl py-5 flex tracking-widest gap-2">Practice</Button>
                    </Link>
                    </div>
                </div>
       

    );
}
export default HomePage;