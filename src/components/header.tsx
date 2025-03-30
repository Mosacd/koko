import {Link} from "react-router-dom";
import {Button} from "./ui/button";
import React from "react";


const Header: React.FC = () => {
    return (
        <header className="bg-background-color text-black py-5 top-0 left-0 right-0 z-50 w-full overflow-x-hidden">
            <div className="py-2 w-full flex justify-between items-center px-4 md:px-10 lg:px-20 xl:px-30">
                <div className="felx items-center">
                    <Link to={'/home'} className="flex gap-2 fill-main-color items-end">
                        <svg className="w-10 h-10" fill="" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 256 256"
                             enable-background="new 0 0 256 256">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M157.971,187.403l29.566,38.77L182.465,254h-39.327c-4.048,0-7.33-3.282-7.33-7.33c0-2.777,1.568-5.314,4.052-6.556 l3.814-1.906l-5.598-33.587C145.541,199.897,152.251,194.086,157.971,187.403z M68.623,215.179L58.15,232.344l10.798,21.595h39.33 c0-6.19-2.914-12.018-7.866-15.732l13.545-23.016c-7.238,1.937-14.838,2.977-22.68,2.977 C83.588,218.168,75.968,217.146,68.623,215.179z M202.075,97.004L202.075,97.004c5.924,2.878,19.603,7.154,33.486,3.66 c2.98-0.75,10.289-3.962,14.807-10.26c5.685-7.924,4.221-19.228-3.453-25.248l-8.849-15.732V33.691l-5.899-2.95L199.881,6.661 c-7.063-5.664-13.732-6.379-20.044-0.964l-24.387,22.886c-1.464-0.184-2.941-0.299-4.43-0.299c-4.267,0-8.603,0.767-12.822,2.389 c-6.155,2.36-11.534,6.371-15.545,11.583L80.746,96.619c0,0-14.782,0-15.797,0c-30.146,0-54.584,24.438-54.584,54.584 c0,12.447,4.175,23.911,11.19,33.09L4.829,214.088c-2.989,5.319-3.471,11.681-1.337,17.384l8.446,22.526h41.306v-0.059 c-0.02-6.194-2.94-12.015-7.896-15.732l19.724-32.31c9.22,3.181,29.313,7.897,51.619,0.28c22.905-7.821,34.909-22.663,41.278-31.744 l48.632,63.774l-3.835,1.917c-2.468,1.239-4.031,3.766-4.031,6.529c0,4.021,3.264,7.286,7.286,7.296l43.263,0.049l4.022-21.179 c0.6-3.156,0.285-6.401-0.914-9.38L202.075,97.004z"></path>
                            </g>
                        </svg>
                        <h1 className="text-3xl tracking-widest italic font-semibold text-black">K<span
                            className="text-main-color">o</span>K<span className="text-main-color">o</span></h1></Link>
                </div>
                <div className="w-full flex justify-between max-w-md">
                    <Link to={'/aboutUs'}><Button className="text-xl tracking-widest  font-semibold text-background-color">About
                        Us</Button></Link>
                    <Link to={'https://www.youtube.com/watch?v=Q7avDe-yKDQ'}  target="_blank"
  rel="noopener noreferrer" ><Button className="text-xl tracking-widest  font-semibold text-background-color italic">Our Inspiration</Button></Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
