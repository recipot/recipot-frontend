import { useAuth } from '@recipot/contexts';

import { useCompletedRecipesCache } from '@/hooks';

import CharacterImage from './CharacterImage';
import { calculateLevel, getCharacterImage } from './characterImageSelector';
import { generateCharacterMessage } from './characterMessageGenerator';
import CharacterSpeechBubble from './CharacterSpeechBubble';

import type { MoodType } from '../index';

interface EmotionCharacterProps {
  mood: MoodType;
  onTypingComplete?: () => void;
  /** 완료한 레시피 개수 (옵셔널, 제공하지 않으면 캐시에서 가져옴) */
  completedRecipesCount?: number;
}

/**
 * 캐릭터 영역 컨테이너
 * 말풍선과 캐릭터 이미지를 조합하여 표시합니다.
 */
export default function EmotionCharacter({
  completedRecipesCount: propsCompletedRecipesCount,
  mood,
  onTypingComplete,
}: EmotionCharacterProps) {
  const { user } = useAuth();
  const { completedRecipesCount: cacheCompletedRecipesCount } =
    useCompletedRecipesCache();
  const nickname = user?.nickname ?? '당신';

  // props로 전달된 값이 있으면 우선 사용, 없으면 캐시에서 가져온 값 사용
  const completedRecipesCount =
    propsCompletedRecipesCount ?? cacheCompletedRecipesCount;

  // 레벨 계산
  const level = calculateLevel(completedRecipesCount);

  // 이미지 선택
  const characterImage = getCharacterImage(mood, level);

  // 메시지 생성
  const message = generateCharacterMessage({
    completedRecipesCount,
    mood,
    nickname,
  });

  // 디버깅 로그
  console.info('🐣 EmotionCharacter 렌더링:', {
    cacheValue: cacheCompletedRecipesCount,
    completedRecipesCount,
    level,
    mood,
    nickname,
    propsValue: propsCompletedRecipesCount,
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* 말풍선 영역 */}
      <CharacterSpeechBubble
        mood={mood}
        message={message}
        onTypingComplete={onTypingComplete}
      />

      {/* 캐릭터 이미지 영역 */}
      <CharacterImage image={characterImage} />
    </div>
  );
}
