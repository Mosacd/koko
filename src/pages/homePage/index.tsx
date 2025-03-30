import gorilla from "@/assets/1550536471.svg"
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";

const HomePage = () => {
    return (
        <div className="w-full mt-20 max-w-6xl flex items-center m-auto  justify-between">
            <img src={gorilla} alt="Mascot" className="size-96"/>
            <div className="flex justify-center items-center gap-10 flex-col w-full max-w-2xl">
                <span> At <span className="text-xl font-semibold text-main-color">KoKo</span>, we believe in the power of movement. Our specialized exercises strengthen the muscles used in sign language, helping you sign with greater clarity and confidence. Inspired by our gorilla mascot, we blend fitness with language skills—because stronger hands tell stronger stories. Join the Coco community today.           </span>
                <div className="flex w-full justify-center gap-10">
                    <Link to={'/catalog'} className="w-full max-w-72">
                        <Button className="w-full py-5">Practice</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default HomePage;