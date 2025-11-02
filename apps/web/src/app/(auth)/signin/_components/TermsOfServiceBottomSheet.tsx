'use client';

import React from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { CloseIcon } from '@/components/Icons';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfServiceBottomSheet({
  isOpen,
  onClose,
}: TermsOfServiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden">
        <VisuallyHidden asChild>
          <DialogTitle>서비스 이용약관</DialogTitle>
        </VisuallyHidden>

        {/* 고정 헤더 */}
        <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b bg-white px-6 pt-2 pb-4">
          <h1 className="text-2xl font-bold">서비스 이용약관</h1>
          <DialogClose
            className="rounded-full p-1.5 transition-opacity hover:opacity-70"
            aria-label="이용약관 모달 닫기"
          >
            <CloseIcon size={24} color="#626A7A" />
            <span className="sr-only">닫기</span>
          </DialogClose>
        </header>

        {/* 스크롤 가능한 메인 컨텐츠 영역 */}
        <main className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">제1장 총 칙</h2>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">제1조 (목적)</h3>
                <p className="leading-relaxed text-gray-700">
                  이 약관은 팀 레시팟 (이하 &ldquo;회사&rdquo;)이 웹으로
                  제공하는 [한끼부터] (이하 &ldquo;서비스&rdquo;)의 이용과
                  관련하여 가입조건 및 이용에 관한 제반 사항, 기타 필요한 사항을
                  규정함을 목적으로 합니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제2조 (이용약관의 효력과 변경)
                </h3>
                <p className="mb-2 leading-relaxed text-gray-700">
                  본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그
                  효력을 발생합니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  본 약관은 서비스 웹페이지에 온라인으로 공시됨으로써 효력이
                  발생되고, 합리적인 사유가 발생할 경우 회사는 관계법령에
                  위배되지 않는 범위에서 본 약관을 변경할 수 있습니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  개정약관은 서비스 웹페이지 내부에 온라인으로 공시됨으로써
                  효력이 발생됩니다. 회사는 약관을 변경할 경우 지체 없이 이를
                  공시하여야 하고, 회원의 권리나 의무 등에 관한 중요사항을
                  개정할 경우에는 사전에 공시하여야 합니다.
                </p>
                <p className="leading-relaxed text-gray-700">
                  본 약관에 동의하는 것은 정기적으로 서비스 웹페이지 내 약관을
                  확인, 그 변경사항에 동의함을 의미합니다. 변경된 약관을
                  인지하지 못해 발생하는 이용자의 피해에 대해 회사는 책임지지
                  않습니다. 변경된 약관에 동의하지 않는 회원은 탈퇴(해지)를
                  요청할 수 있으며, 약관에 공시된 날로부터 30일 이내 별도의 이의
                  제기 및 거부의사를 표시하지 아니하고 서비스를 계속 사용할
                  경우는 약관에 동의한 것으로 간주합니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제3조(약관과 기타 준칙)
                </h3>
                <p className="leading-relaxed text-gray-700">
                  본 약관은 회사가 제공하는 개별 서비스에 관한 이용안내와 함께
                  적용됩니다. 본 약관에 명시하지 않은 사항은 관계법령 및
                  서비스별 안내로 갈음합니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제4조 (용어의 정의)
                </h3>
                <ol className="list-inside list-decimal space-y-2 leading-relaxed text-gray-700">
                  <li>
                    &ldquo;회원&rdquo;이란 본 약관에 동의하고
                    &ldquo;회사&rdquo;가 요청하는 정보를 제공하여 이용 계약
                    체결을 완료한, 서비스 웹페이지 내에서 회사가 제공하는
                    서비스를 이용하는 자를 말합니다.
                  </li>
                  <li>
                    &ldquo;서비스&rdquo;라 함은 [한끼부터]라는 브랜드명으로
                    &ldquo;회사&rdquo;에서 &ldquo;회원&rdquo;에게 제공하는
                    &ldquo;서비스 웹페이지&rdquo; 내 회사가 제공하는 레시피 추천
                    기능, 레시피 콘텐츠 등 일체의 &ldquo;기능&rdquo;과
                    &ldquo;콘텐츠&rdquo;를 의미합니다.
                  </li>
                  <li>
                    &ldquo;서비스 웹페이지&rdquo;란 &ldquo;회사&rdquo;가
                    &ldquo;회원&rdquo;에게 제공하는 [한끼부터] 서비스의 모든
                    내용을 이용할 수 있는 당사의 인터넷 사이트를 의미합니다.
                  </li>
                  <li>
                    &ldquo;기능&rdquo;은 &ldquo;서비스 웹페이지&rdquo; 내
                    &ldquo;서비스&rdquo;를 구성하는 요소로서, 크게
                    &ldquo;추천&rdquo;, &ldquo;검색&rdquo; 등의 요소를 통합하여
                    이르는 명칭입니다.
                  </li>
                  <li>
                    &ldquo;콘텐츠&rdquo;는 &ldquo;서비스 웹페이지&rdquo; 내
                    &ldquo;서비스&rdquo;를 구성하는 요소로서, &ldquo;레시피
                    콘텐츠&rdquo; 등 서비스 내에서 이용할 수 있는 정보 요소를
                    통합하여 이르는 명칭입니다.
                  </li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">제2장 이용 계약</h2>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제5조 (이용 계약의 성립)
                </h3>
                <ol className="list-inside list-decimal space-y-2 leading-relaxed text-gray-700">
                  <li>
                    이용계약은 회원이 카카오 간편 회원가입 절차를 통해 본 약관에
                    대한 동의와 회원가입 절차를 완료함으로써 성립합니다.
                  </li>
                  <li>
                    회원은 가입 시 회사에서 요청하는 정보(카카오, 구글 계정에
                    연결된 이메일, 닉네임)를 필수로 제공해야 합니다. 제공하지
                    않을 시 서비스 이용을 포함한 일체의 권리를 주장할 수
                    없습니다. 제3의 명의 도용 및 기타 부정한 방법으로 이용함으로
                    인한 불이익은 회원 본인에게 있습니다.
                  </li>
                  <li>
                    해당 계약은 본 이용약관이 회사에 의해 변경/해지되거나 회원이
                    이용계약을 철회, 사용 제한 등 서비스를 정상적으로 이용할 수
                    없기 전까지 회사와 회원 간 유효하게 존속하는 것으로 합니다.
                  </li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제6조 (서비스의 제공 및 변경)
                </h3>
                <ol className="list-inside list-decimal space-y-2 leading-relaxed text-gray-700">
                  <li>
                    회사는 회원에게 아래와 같은 서비스를 제공합니다.
                    <ul className="mt-2 ml-4 list-inside list-disc">
                      <li>
                        회원이 기입한 컨디션, 보유 식재료에 맞춘 건강 레시피를
                        제공하는 서비스
                      </li>
                    </ul>
                  </li>
                  <li>
                    회사는 서비스의 일부 또는 전부를 변경, 중단할 수 있으며, 이
                    경우 사전 공지합니다.
                  </li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제7조 (개인정보의 보호)
                </h3>
                <ol className="list-inside list-decimal space-y-2 leading-relaxed text-gray-700">
                  <li>
                    회사는 회원의 개인정보를 보호하기 위해 노력하며, 관련 법령
                    및 개인정보처리방침에 따라 회원의 개인정보를 처리합니다.
                  </li>
                  <li>
                    카카오, 구글 간편 회원가입/로그인 시 제공되는 정보는 회원
                    동의 하에 수집·이용됩니다.
                  </li>
                  <li>
                    회사는 별도의 이벤트 및 마케팅 활동과,
                    &ldquo;회사&rdquo;에서 제공하는 서비스를 이용하기 위한
                    과정에서 수집되는 개인 정보를 활용하여 서비스 안내 및 각종
                    마케팅 활용을 할 수 있으며, 이용약관에 명시된 서비스 제공을
                    위한 목적으로만 사용합니다.
                  </li>
                  <li>
                    회사는 서비스 제공과 관련하여 취득한 고객의 신상정보를
                    본인의 승낙 없이 제3자에게 누설할 수 없으며, 기타 자세한
                    사항은 정보통신보호법에 따릅니다.
                    <div className="mt-2 ml-4">
                      다만, 아래의 경우에는 예외로 제공할 수 있습니다.
                      <ul className="mt-2 ml-4 list-inside list-disc">
                        <li>
                          회원에게 보다 전문적이고 다양한 서비스를 제공하기 위한
                          경우
                          <ul className="list-circle mt-1 ml-4 list-inside">
                            <li>
                              이 경우, 공유되는 정보는 서비스 제공 목적 외에
                              어떠한 다른 용도로도 사용되지 않습니다.
                            </li>
                            <li>
                              회원은 위 목적에 정보 제공에 있어 동의/거부 의사를
                              밝힐 수 있으며, 동의/거부 의사는 본 이용약관에
                              동의하는 것으로 갈음합니다.
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">
                제3장 계약 당사자의 의무
              </h2>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제8조 (회사의 의무)
                </h3>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회사는 특별한 사정이 없는 한 회원에게 계속적이고 안정적으로
                  서비스를 제공해야 합니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회사는 회원의 개인정보 보호를 위해 개인정보처리방침을 공시하고
                  준수합니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회사는 회원으로부터 제기되는 의견이나 불만이 정당하다고 인정될
                  경우 적절한 조치를 취해야 합니다.
                </p>
                <p className="leading-relaxed text-gray-700">
                  회사는 시스템 점검, 설비의 장애, 서비스 이용자의 폭주 등으로
                  인하여 정상적인 서비스를 제공하기 곤란한 경우 사유 및 기간
                  등을 회원에게 사전 혹은 사후에 공지합니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제9조 (회원의 의무)
                </h3>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회원은 본 약관과 관계법령 등 제반 규정 및 회사의 공지사항을
                  준수하여야 합니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회원이 아래 각 호의 행위로 서비스의 원활한 운영을 방해할 경우
                  회사는 회원의 서비스 이용을 제한 또는 중지할 수 있습니다.
                </p>
                <ul className="ml-4 list-inside list-disc space-y-1 leading-relaxed text-gray-700">
                  <li>타인의 정보를 무단 도용하여 서비스를 이용하는 행위</li>
                  <li>
                    회사에서 제공하는 서비스에 위해를 가하거나 고의로 방해하는
                    행위
                  </li>
                  <li>회사 혹은 타 회원의 저작권을 침해하는 모든 행위</li>
                  <li>
                    본 약관을 포함하여 기타 회사가 정한 제반 규정 또는 이용
                    조건을 위반하는 모든 행위
                  </li>
                  <li>기타 관계법령에 위배되는 행위</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">제 4장 기타 조항</h2>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제10조 (게시물에 대한 저작권)
                </h3>
                <p className="mb-2 leading-relaxed text-gray-700">
                  서비스 내 제공되는 모든 레시피 콘텐츠는 상업적 이용이 가능한
                  오픈소스 콘텐츠를 사용합니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  레시피 후기 등 회원이 서비스 내에 게시한 게시물의 저작권은
                  게시한 회원에게 귀속됩니다. 만일 해당 게시물이 제3자의
                  지적재산권을 침해할 경우의 모든 책임은 게시물을 게시한 회원이
                  부담합니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회사는 게시자의 동의 없이 게시물을 상업적으로 이용할 수
                  없습니다. 다만 서비스 내에 이를 게시할 권리를 갖습니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  다만, 아래의 경우에는 예외적으로 상업적 목적으로 이용할 수
                  있습니다.
                </p>
                <p className="mb-2 ml-4 leading-relaxed text-gray-700">
                  - 회원은 사측의 게시물 상업적 이용에 있어 동의/거부 의사를
                  밝힐 수 있으며, 동의/거부 의사는 본 이용약관에 동의하는 것으로
                  갈음합니다.
                </p>
                <p className="leading-relaxed text-gray-700">
                  회원은 레시피 후기 등 타 회원이 서비스 내에 게시한
                  게시물로부터 취득한 정보를 가공/판매하는 등 영리 목적으로
                  이용하거나, 제3자에게 이용하게 할 수 없습니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제11조 (면책조항 및 비보장 범위)
                </h3>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회사는 천재지변 혹은 기타 불가항력적 사유로 인한 서비스 제공의
                  중단에 대해 책임이 면제됩니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회사는 회원의 귀책사유로 인한 서비스 이용의 장애 또는 손해에
                  대해 책임을 지지 않습니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회사는 회원이 서비스 이용과정에서 기대하는 건강 효과나 결과에
                  대해 보장하지 않습니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회사는 레시피 키워드 리뷰 등 타 회원이 작성한 각종 정보의
                  신뢰도, 정확성 등 내용에 대하여 책임을 지지 않습니다.
                </p>
                <p className="leading-relaxed text-gray-700">
                  당사의 고의적이거나 중대한 과실이 있는 경우를 제외하고, 발생할
                  수 있는 회원의 모든 피해(데이터 유실 등을 포함한)에 대하여
                  회사는 일절 책임을 지지 않습니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">
                  제12조 (분쟁의 해결)
                </h3>
                <p className="leading-relaxed text-gray-700">
                  본 약관 및 서비스 이용과 관련하여 회사와 회원 간에 분쟁이
                  발생한 경우, 회사와 회원은 분쟁의 원만한 해결을 위해 성실히
                  협의합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">부칙</h2>
              <p className="leading-relaxed text-gray-700">
                본 약관은 2025년 10월 16일부터 시행합니다.
              </p>
            </section>
          </div>
        </main>
      </DialogContent>
    </Dialog>
  );
}
