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
}

/**
 * 캐릭터 영역 컨테이너
 * 말풍선과 캐릭터 이미지를 조합하여 표시합니다.
 */
export default function EmotionCharacter({
  mood,
  onTypingComplete,
}: EmotionCharacterProps) {
  const { user } = useAuth();
  const { completedRecipesCount } = useCompletedRecipesCache();
  const nickname = user?.nickname ?? '당신';

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
