import Header from "@/components/header";
import {Outlet} from "react-router-dom";


const Layout = () => {
    return (
        <>
            <Header/>
            <div className="my-10 w-full">
                <Outlet/>
            </div>
        </>
    )
}


export default Layout;