import Image from 'next/image';

import type { StaticImageData } from 'next/image';

interface CharacterImageProps {
  image: StaticImageData;
  alt?: string;
}

/**
 * 캐릭터 이미지 컴포넌트
 * 젓가락 위에 올라간 캐릭터를 표시합니다.
 */
export default function CharacterImage({
  alt = 'emotion',
  image,
}: CharacterImageProps) {
  return (
    <div className="relative flex h-[220px] w-full items-center justify-center overflow-hidden pb-10">
      {/* 캐릭터 - 젓가락 위에 올라감 */}
      <div className="relative z-10 before:absolute before:bottom-[-5px] before:-left-4 before:z-[-1] before:h-[74px] before:w-[320px] before:bg-[url('/emotion/img-chopsticks.png')] before:bg-contain before:bg-no-repeat before:content-['']">
        <Image width={180} height={180} src={image} alt={alt} quality={100} />
      </div>
    </div>
  );
}
