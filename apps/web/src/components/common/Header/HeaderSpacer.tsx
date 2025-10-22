import { HEADER_HEIGHT_CLASS } from './constants';
/**
 * Header의 높이만큼 공간을 확보하는 Spacer
 * Fixed Header 사용 시 콘텐츠가 헤더 아래 가려지지 않도록 함
 */
export function HeaderSpacer() {
  return <div className={HEADER_HEIGHT_CLASS} />;
}
