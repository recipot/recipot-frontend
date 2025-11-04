import CookWareTransparentIcon from '@/components/Icons/CookWareTransparentIcon';
import EtcIcon from '@/components/Icons/seasonings/EtcIcon';
import OilIcon from '@/components/Icons/seasonings/OilIcon';
// 양념류 아이콘들
import PowderIcon from '@/components/Icons/seasonings/PowderIcon';
import SauceIcon from '@/components/Icons/seasonings/SauceIcon';
import WaterIcon from '@/components/Icons/seasonings/WaterIcon';
import AirFryerIcon from '@/components/Icons/tools/AirFryerIcon';
import CutIcon from '@/components/Icons/tools/CutIcon';
import MicroWaveIcon from '@/components/Icons/tools/MicroWaveIcon';
import MultiPanIcon from '@/components/Icons/tools/MultiPanIcon';
import MultipotIcon from '@/components/Icons/tools/MultipotIcon';
// 조리도구 아이콘들
import OnepanIcon from '@/components/Icons/tools/OnepanIcon';
import OnepotIcon from '@/components/Icons/tools/OnepotIcon';
import RiceCookerIcon from '@/components/Icons/tools/RiceCookerIcon';
import ScissorIcon from '@/components/Icons/tools/ScissorIcon';

import type React from 'react';

/**
 * 조리도구 이름에 따라 적절한 아이콘 컴포넌트를 반환합니다.
 * 실제 데이터 기반으로 매칭합니다.
 * @param toolName 조리도구 이름
 * @returns 아이콘 컴포넌트
 */
export function getToolIcon(
  toolName: string
): React.ComponentType<{ color?: string; size?: number }> {
  const normalizedName = toolName.toLowerCase().trim();

  // 원팬 (실제 데이터에서 확인: "원팬", "원팬,가위", "원팬,칼", "원팬,원팟,칼")
  if (normalizedName.includes('원팬') || normalizedName.includes('원 팬')) {
    return OnepanIcon;
  }

  // 원팟/원포트 (실제 데이터에서 확인: "원팟", "원팟, 원팬", "원팟,칼")
  if (
    normalizedName.includes('원팟') ||
    normalizedName.includes('원포트') ||
    normalizedName.includes('원 팟') ||
    normalizedName.includes('원 포트')
  ) {
    return OnepotIcon;
  }

  // 멀티팬
  if (normalizedName.includes('멀티팬') || normalizedName.includes('멀티 팬')) {
    return MultiPanIcon;
  }

  // 멀티팟/멀티포트
  if (
    normalizedName.includes('멀티팟') ||
    normalizedName.includes('멀티포트') ||
    normalizedName.includes('멀티 팟') ||
    normalizedName.includes('멀티 포트')
  ) {
    return MultipotIcon;
  }

  // 전자레인지 (실제 데이터에서 확인: "전자레인지", "전자레인지,칼")
  if (
    normalizedName.includes('전자레인지') ||
    normalizedName.includes('레인지') ||
    normalizedName.includes('전자 레인지')
  ) {
    return MicroWaveIcon;
  }

  // 에어프라이어 (실제 데이터에서 확인: "에어프라이어,칼,원팟", "원팬, 에어프라이어")
  if (
    normalizedName.includes('에어프라이어') ||
    normalizedName.includes('에어 프라이어')
  ) {
    return AirFryerIcon;
  }

  // 칼 (실제 데이터에서 확인: "칼", "칼, 원팟", "칼, 원팬", "칼, 도마")
  if (normalizedName.includes('칼') || normalizedName.includes('knife')) {
    return CutIcon;
  }

  // 가위 (실제 데이터에서 확인: "원팬,가위")
  if (
    normalizedName.includes('가위') ||
    normalizedName.includes('scissor') ||
    normalizedName.includes('scissors')
  ) {
    return ScissorIcon;
  }

  if (
    normalizedName.includes('밥솥') ||
    normalizedName.includes('밥 솥') ||
    normalizedName.includes('전기밥솥') ||
    normalizedName.includes('전기 밥솥')
  ) {
    return RiceCookerIcon;
  }

  // 프라이팬 (실제 데이터에서 확인: "프라이팬", "냄비, 프라이팬")
  if (
    normalizedName.includes('프라이팬') ||
    normalizedName.includes('프라이 팬')
  ) {
    return OnepanIcon; // 프라이팬은 원팬과 유사하므로 OnepanIcon 사용
  }

  // 냄비 (실제 데이터에서 확인: "냄비", "냄비, 프라이팬")
  if (normalizedName.includes('냄비') || normalizedName.includes('pot')) {
    return OnepotIcon; // 냄비는 원팟과 유사하므로 OnepotIcon 사용
  }

  // 도마 (실제 데이터에서 확인: "도마, 칼", "칼, 도마")
  // 도마는 별도 아이콘이 없으므로 기본값 사용

  // 기본값
  return CookWareTransparentIcon;
}

/**
 * 양념류 이름에 따라 적절한 아이콘 컴포넌트를 반환합니다.
 * 실제 데이터 기반으로 매칭합니다.
 * @param seasoningName 양념류 이름
 * @returns 아이콘 컴포넌트
 */
export function getSeasoningIcon(
  seasoningName: string
): React.ComponentType<{ color?: string; size?: number }> {
  const normalizedName = seasoningName.toLowerCase().trim();

  // 물 (실제 데이터에서 확인: "물 200ml", "물 1컵", "물 1L", "물 500ml", "물 400ml")
  if (
    normalizedName === '물' ||
    normalizedName.startsWith('물 ') ||
    normalizedName === 'water'
  ) {
    return WaterIcon;
  }

  // 소스류 - 간장, 된장, 고추장, 굴소스, 액젓, 맛술, 식초, 레몬즙 등 액체 양념
  const sauceKeywords = [
    '간장',
    '진간장',
    '국간장',
    '된장',
    '고추장',
    '굴소스',
    '액젓',
    '멸치액젓',
    '참치액',
    '맛술',
    '맛선생',
    '올리고당',
    '매실액',
    '물엿',
    '쯔유',
    '식초',
    '레몬즙',
    '케첩',
    '마요네즈',
    '허니머스타드',
    '머스타드',
    '칠리소스',
    '바베큐소스',
    '와인소스',
    '스테이크소스',
    '발사믹 드레싱',
    '발사믹',
    '드레싱',
    '참치',
    '땅콩버터',
  ];

  if (sauceKeywords.some(keyword => normalizedName.includes(keyword))) {
    return SauceIcon;
  }

  // 오일류 - 올리브유, 참기름, 식용유, 카놀라유, 고추기름, 버터 등
  const oilKeywords = [
    '식용유',
    '올리브유',
    '올리브오일',
    '참기름',
    '들기름',
    '카놀라유',
    '고추기름',
    '포도씨유',
    '해바라기유',
    '콩기름',
    '옥수수유',
    '버터',
  ];

  if (oilKeywords.some(keyword => normalizedName.includes(keyword))) {
    return OilIcon;
  }

  // 가루류 - 소금, 후추, 설탕, 다진마늘, 고춧가루, 깨, 전분가루, 맛소금 등 고체/가루 형태
  const powderKeywords = [
    '소금',
    '맛소금',
    '후추',
    '설탕',
    '다진마늘',
    '고춧가루',
    '매운 고춧가루',
    '마늘가루',
    '생강가루',
    '다진 생강',
    '전분가루',
    '파프리카',
    '카레',
    '베이킹파우더',
    '베이킹 소다',
    '시나몬',
    '시나몬가루',
    '오레가노',
    '바질',
    '로즈마리',
    '타임',
    '깨',
    '깨소금',
    '알룰로스',
  ];

  if (powderKeywords.some(keyword => normalizedName.includes(keyword))) {
    return PowderIcon;
  }

  // 기타 (와사비, 쪽파 등)
  const etcKeywords = ['와사비', '쪽파', 'wasabi'];

  if (etcKeywords.some(keyword => normalizedName.includes(keyword))) {
    return EtcIcon;
  }

  // 기본값
  return EtcIcon;
}
