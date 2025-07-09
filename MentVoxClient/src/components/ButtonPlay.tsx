import React from "react";

interface ButtonPlayProps {
  audioUrl: string;
}

const ButtonPlay: React.FC<ButtonPlayProps> = () => {
  // const handleClick = () => {
  //   const audio = new Audio(audioUrl);
  //   audio.play();
  // };

// { audioUrl }

  return (

    <button
    >
      🎙️ דברי עם הרובוט
    </button>
  );
};

export default ButtonPlay;
