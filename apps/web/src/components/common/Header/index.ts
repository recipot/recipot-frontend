import { Header as HeaderRoot } from './Header';
import { HeaderAction } from './HeaderAction';
import { HeaderBack } from './HeaderBack';
import { HeaderSpacer } from './HeaderSpacer';
import { HeaderTitle } from './HeaderTitle';

/**
 * Compound Component 패턴을 사용한 범용 Fixed Header
 *
 * @example
 * // 패턴 1: Back + Refresh
 * <Header>
 *   <Header.Back onClick={handleBack} />
 *   <Header.Action onClick={handleRefresh} ariaLabel="새로고침">
 *     <RefreshIcon size={24} />
 *   </Header.Action>
 * </Header>
 * <Header.Spacer />
 *
 * @example
 * // 패턴 2: Back + Title
 * <Header>
 *   <Header.Back onClick={handleBack} />
 *   <Header.Title>마이페이지</Header.Title>
 * </Header>
 * <Header.Spacer />
 *
 * @example
 * // 패턴 3: Conditional Back + Refresh
 * <Header>
 *   <Header.Back show={currentStep > 1} onClick={handleBack} />
 *   <Header.Action onClick={handleRefresh} ariaLabel="새로고침">
 *     <RefreshIcon size={24} />
 *   </Header.Action>
 * </Header>
 * <Header.Spacer />
 *
 * @example
 * // 패턴 4: Back + Multiple Actions
 * <Header>
 *   <Header.Back onClick={handleBack} />
 *   <Header.Action onClick={handleShare} ariaLabel="공유">
 *     <ShareIcon size={24} />
 *   </Header.Action>
 *   <Header.Action onClick={handleRefresh} ariaLabel="새로고침">
 *     <RefreshIcon size={24} />
 *   </Header.Action>
 * </Header>
 * <Header.Spacer />
 */
export const Header = Object.assign(HeaderRoot, {
  Action: HeaderAction,
  Back: HeaderBack,
  Spacer: HeaderSpacer,
  Title: HeaderTitle,
});
