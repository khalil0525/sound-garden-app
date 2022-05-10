import React, { useEffect, useRef, useState } from "react";

import Marquee from "react-fast-marquee";

const AudioPlayerMarquee = ({ className, children }) => {
  // const [scrollPlaying, setScrollPlaying] = useState(true);
  // const scrollPlayingRef = useRef(scrollPlaying);
  // scrollPlayingRef.current = scrollPlaying;
  // const [songTitleText, setSongTitleText] = useState(() => children);

  // useEffect(() => {
  //   let scrollPauseTimer;
  //   // scrollPlayingRef.current = scrollPlaying;

  //   console.log("current: ", scrollPlayingRef.current);
  //   if (!scrollPlayingRef.current) {
  //     console.log("here");
  //     scrollPauseTimer = setTimeout(
  //       () => setScrollPlaying(!scrollPlaying),
  //       6000
  //     );
  //   } else {
  //     clearTimeout(scrollPauseTimer);
  //   }
  //   // console.log(scrollPlaying);
  //   // console.log(scrollPlaying);

  //   return () => clearTimeout(scrollPauseTimer);
  // }, [scrollPlaying]);
  // const handleCycleComplete = () => {
  //   setScrollPlaying(false);
  // };
  // useEffect(() => {
  //   let id;
  //   if (!scrollPlaying) {
  //     id = setTimeout(() => setScrollPlaying(true), 2000);
  //   } else {
  //     clearTimeout(id);
  //   }

  //   return () => clearTimeout(id);
  // }, [scrollPlaying]);
  return (
    <>
      {children && children.length > 24 ? (
        <Marquee
          className={className}
          gradient={false}
          delay={0}
          speed={10}
          play={true}
          pauseOnHover={true}
        >
          {children}&emsp;&emsp;
        </Marquee>
      ) : (
        <p className={className}>{children}</p>
      )}
    </>
  );
};
export default AudioPlayerMarquee;
