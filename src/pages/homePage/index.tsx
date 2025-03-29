import gorilla from "@/assets/1550536471.svg"
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {

    return (
       
        <div className="w-full max-w-6xl flex items-center m-auto  justify-between">
         
         <img src={gorilla} alt="" className="size-96" />
      
       <div className="flex justify-center items-center gap-10 flex-col w-full max-w-2xl">
           <span>
             Lorem ipsum dolor sit amet consectetur adipisicing elit
             . Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, 
             . Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, 
             . Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, 
             . Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, 
             . Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, 
           </span>
          <Link to={'/catalog'} className="w-full max-w-96"><Button className="w-full py-5">Practice</Button></Link>
       </div>
     </div>
    );
   }

export default HomePage;