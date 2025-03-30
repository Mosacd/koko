import logo from "@/assets/Group 21.svg"

const AboutUs = () => {

    return (
        <div className="w-full mt-20 max-w-6xl flex-col md:flex-row px-4 flex items-center m-auto justify-center gap-20">
            {/* <svg className="fill-main-hover" height="400px" width="400px" version="1.1" id="Layer_1"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path className="fill-black"
                          d="M134.208,201.124v-16.568c26.968-15.272,36.448-49.52,21.176-76.488s-49.52-36.448-76.488-21.176 s-36.448,49.52-21.176,76.488c5.008,8.848,12.328,16.168,21.176,21.176v16.568C26.592,203.572,0,238.932,0,262.7v19.52h213.104 V262.7C213.104,238.932,186.504,203.572,134.208,201.124z"></path>
                    <path
                        d="M253.512,253.044V231.86c34.48-19.528,46.6-63.304,27.08-97.784s-63.304-46.6-97.784-27.08s-46.6,63.304-27.08,97.784 c6.408,11.312,15.768,20.672,27.08,27.08v21.184c-66.864,3.128-100.856,48.336-100.856,78.72v24.952H354.4v-24.952 C354.4,301.372,320.368,256.172,253.512,253.044z"></path>
                    <path className="fill-main-color"
                          d="M391.152,308.188v-25.376c41.312-23.392,55.832-75.848,32.44-117.16s-75.848-55.832-117.16-32.44 s-55.832,75.848-32.44,117.16c7.672,13.552,18.888,24.76,32.44,32.44v25.376C226.328,311.932,185.6,366.1,185.6,402.508v29.896H512 v-29.896C512,366.1,471.264,311.932,391.152,308.188z"></path>
                </g>
            </svg> */}

            <img src={logo} alt="" className="w-full max-w-md" />

            <div className="flex justify-center items-center gap-10 flex-col w-full max-w-2xl">
                <h1 className="font-semibold text-4xl i">About <span className="italic">K<span
                    className="text-main-color">o</span>K<span className="text-main-color">o</span></span></h1>
                <p className="text-lg">Koko transforms sign language learning into an exciting adventure through our
                    gamified platform developed by university students passionate about accessibility and education.</p>
                <p className="text-lg">Led by our gorilla mascot, users earn points, unlock achievements, and level up
                    as they master new signs while completing exercise challenges designed to build the strength and
                    dexterity essential for fluid signing.</p>
                <p className="text-lg">Our unique approach combines linguistics research with game design principles,
                    creating engaging daily challenges, competitive leaderboards, and reward systems that keep learners
                    motivated through their sign language journey.</p>
                <p className="text-lg">Join our growing community where learning meets play, and watch as your signing
                    skills evolve through consistent, enjoyable practice sessions that feel less like studying and more
                    like gaming.</p>
            </div>
        </div>
    )
}
export default AboutUs;
