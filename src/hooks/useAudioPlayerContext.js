import { AudioPlayerContext } from "../context/AudioPlayerContext";
import { useContext } from "react";

// Custom hook that allows us to access our context AudioPlayerContext
// We use this so we don't import useConxext in every file we use the context
// It returns an object so we can use what we need from our AudioPlayerContext File
export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw Error(
      "useAudioPlayerContext must be inside an AuAudioPlayerContextProvider"
    );
  }
  return context;
};
