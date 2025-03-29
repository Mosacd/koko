// import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";


const Header: React.FC = () => {

  return (
    <header className="bg-background-color text-black py-5 top-0 left-0 right-0 z-50 w-full overflow-x-hidden">
        <div className="py-2 w-full flex justify-between items-center px-4 md:px-10 lg:px-20 xl:px-30">
           <div>
            <Link to={'/home'}><h1 className="text-2xl tracking-widest italic font-semibold text-black">CoCo</h1></Link>
            </div>
            <div className="w-full max-w-md">
          
            </div>
            {/* <div>
            
                <Button size={'lg'} className="">
                Sign In
                </Button>

            </div> */}
        </div>

    </header>
  );
};

export default Header;
