import React from 'react';
import Image from 'next/image';

import ConnectingImage from '../../../public/loadingCharacter.png';

const ConnectingPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#00000099] opacity-90">
      <Image
        src={ConnectingImage}
        alt="Connecting"
        width={138}
        height={138}
        className="mb-8"
      />
      <p className="text-18sb text-center text-white">
        오리무중체다치즈님의 <br />
        지금 바로 해먹을 수 있는 요리를
        <br /> 찾고 있어요
      </p>
    </div>
  );
};

export default ConnectingPage;
