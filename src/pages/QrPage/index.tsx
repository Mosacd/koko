import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeDisplay: React.FC = () => {
  const url1 = "https://kokolang.site/home";
  const url2 = "https://git.kokolang.site/BoysNight/KoKo";

  return (
    <div className="flex justify-evenly max-w-6xl m-auto mt-20">
        <div className="shadow-[4px_4px_0_0_black] justify-center mt-20 bg-main-color w-full flex-col flex items-center self-center max-w-md rounded-lg p-4">
      <h1 className="text-2xl text-black font-bold mb-4">Scan this QR Code</h1>
      <div className="p-4 bg-background-color rounded-lg shadow-lg">
        <QRCodeCanvas value={url1} size={300} level="H" />
      </div>
      <p className="mt-4 text-background-color">{url1}</p>
      </div>



      <div className="shadow-[4px_4px_0_0_black] justify-center mt-20 bg-main-color w-full flex-col flex items-center self-center max-w-md rounded-lg p-4">
      <h1 className="text-2xl text-black font-bold mb-4">Scan this QR Code</h1>
      <div className="p-4 bg-background-color rounded-lg shadow-lg">
        <QRCodeCanvas value={url2} size={300} level="H" />
      </div>
      <p className="mt-4 text-background-color">{url2}</p>
      </div>
      </div>

  
  );
};

export default QRCodeDisplay;
