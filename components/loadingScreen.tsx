import { animate } from "motion/react";
import { useEffect } from 'react';
type loadingScreenProps = {
  id: string,
  loadMessage: string
}
export default function LoadingScreen({ id, loadMessage } : loadingScreenProps) {
  useEffect(() => {
    animate(".img", { rotate: 360 }, {duration: 5, repeat: Infinity, ease: "linear"})
  }, []);

  return (
    <div id={id} className ="bg-black absolute h-screen w-screen flex justify-center items-center pointer-events-none">
      <div className="align-middle">
        <img id="LoadingIcon" className="img relative object-fit w-64 -48 mx-auto" src="https://i.natgeofe.com/n/82fddbcc-4cbb-4373-bf72-dbc30068be60/drill-monkey-01.jpg" />
        <div className="relative z-10 text-center text-2xl my-4 ">
          {`${loadMessage}`}
        </div>
      </div>
    </div>
  );
}
