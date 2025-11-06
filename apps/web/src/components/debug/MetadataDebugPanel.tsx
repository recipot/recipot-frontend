'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { isDevelopment } from '@/lib/env';

interface MetadataInfo {
  title: string;
  description: string;
  imageUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
}

interface ServerDebugInfo {
  apiCall: {
    url: string;
    status: number | null;
    hasData: boolean;
    hasNestedData: boolean;
    responseStructure: string[];
  } | null;
  recipeData: {
    hasTitle: boolean;
    hasDescription: boolean;
    hasImages: boolean;
    title: string | null;
    description: string | null;
    imageUrl: string | null;
    imageCount: number;
  } | null;
  metadata: {
    title: string;
    description: string;
    imageUrl: string;
    recipeUrl: string;
  } | null;
  error: string | null;
}

interface MetadataDebugPanelProps {
  recipeId: string;
}

/**
 * 개발 환경에서만 표시되는 메타태그 디버그 패널
 */
const MetadataDebugPanel: React.FC<MetadataDebugPanelProps> = ({
  recipeId,
}) => {
  const [metadataInfo, setMetadataInfo] = useState<MetadataInfo | null>(null);
  const [serverDebugInfo, setServerDebugInfo] =
    useState<ServerDebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 서버 사이드 디버그 정보 가져오기 (클라이언트에서 API 직접 호출)
  const fetchServerDebugInfo = useCallback(async () => {
    if (!isDevelopment) {
      return;
    }

    setIsLoading(true);
    try {
      const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';
      const shouldUseMock = APP_ENV === 'local';
      const baseURL = shouldUseMock
        ? ''
        : (process.env.NEXT_PUBLIC_BACKEND_URL ??
          'https://api.hankkibuteo.com');
      const url = `${baseURL}/v1/recipes/${recipeId}`;

      try {
        const response = await axios.get(url, {
          headers: {
            'Cache-Control': 'no-cache',
          },
          timeout: 15000,
        });

        const recipeData = response.data?.data;

        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL ??
          (process.env.NEXT_PUBLIC_APP_ENV === 'production'
            ? 'https://hankkibuteo.com'
            : 'https://dev.hankkibuteo.com');
        const recipeUrl = `${baseUrl}/recipe/${recipeId}`;

        const title = recipeData?.title?.trim() ?? '맛있는 레시피';
        const description =
          recipeData?.description?.trim() ??
          '냉장고 속 재료로 만드는 유연채식 집밥 레시피';

        let imageUrl = `${baseUrl}/recipeImage.png`;
        if (recipeData?.images?.length) {
          const recipeImage = recipeData.images[0]?.imageUrl;
          if (recipeImage?.trim()) {
            if (
              recipeImage.startsWith('http://') ||
              recipeImage.startsWith('https://')
            ) {
              imageUrl = recipeImage.trim();
            } else {
              const normalizedPath = recipeImage.startsWith('/')
                ? recipeImage.trim()
                : `/${recipeImage.trim()}`;
              imageUrl = `${baseUrl}${normalizedPath}`;
            }
          }
        }

        setServerDebugInfo({
          apiCall: {
            hasData: !!response.data,
            hasNestedData: !!response.data?.data,
            responseStructure: Object.keys(response.data ?? {}),
            status: response.status,
            url,
          },
          error: null,
          metadata: {
            description,
            imageUrl,
            recipeUrl,
            title,
          },
          recipeData: recipeData
            ? {
                description: recipeData.description,
                hasDescription: !!recipeData.description,
                hasImages: !!recipeData.images?.length,
                hasTitle: !!recipeData.title,
                imageCount: recipeData.images?.length ?? 0,
                imageUrl: recipeData.images?.[0]?.imageUrl ?? null,
                title: recipeData.title,
              }
            : null,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setServerDebugInfo({
            apiCall: {
              hasData: false,
              hasNestedData: false,
              responseStructure: [],
              status: error.response?.status ?? null,
              url,
            },
            error: `${error.message} (${error.response?.status ?? 'N/A'})`,
            metadata: null,
            recipeData: null,
          });
        } else {
          setServerDebugInfo({
            apiCall: null,
            error: String(error),
            metadata: null,
            recipeData: null,
          });
        }
      }
    } catch (error) {
      setServerDebugInfo({
        apiCall: null,
        error: String(error),
        metadata: null,
        recipeData: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    if (!isDevelopment) {
      return;
    }

    // 현재 페이지의 메타태그 정보 수집
    const collectMetadataInfo = () => {
      const ogTitle =
        document
          .querySelector('meta[property="og:title"]')
          ?.getAttribute('content') ?? '';
      const ogDescription =
        document
          .querySelector('meta[property="og:description"]')
          ?.getAttribute('content') ?? '';
      const ogImage =
        document
          .querySelector('meta[property="og:image"]')
          ?.getAttribute('content') ?? '';
      const ogUrl =
        document
          .querySelector('meta[property="og:url"]')
          ?.getAttribute('content') ?? '';
      const title = document.title ?? '';
      const description =
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute('content') ?? '';

      setMetadataInfo({
        description,
        imageUrl: ogImage,
        ogDescription,
        ogImage,
        ogTitle,
        ogUrl,
        title,
      });
    };

    // 초기 수집
    collectMetadataInfo();

    // 서버 디버그 정보 가져오기
    fetchServerDebugInfo();

    // 메타태그 변경 감지를 위한 MutationObserver
    const observer = new MutationObserver(() => {
      collectMetadataInfo();
    });

    observer.observe(document.head, {
      attributeFilter: ['content'],
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [recipeId, fetchServerDebugInfo]);

  if (!isDevelopment) {
    return null;
  }

  const buttonStyle = { fontSize: '12px' } as const;

  return (
    <>
      {/* 토글 버튼 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed right-4 bottom-4 z-50 rounded-full bg-red-500 px-4 py-2 text-white shadow-lg"
        style={buttonStyle}
      >
        {isVisible ? '디버그 닫기' : '디버그'}
      </button>

      {/* 디버그 패널 */}
      {isVisible && (
        <div className="fixed right-4 bottom-16 z-50 max-h-[80vh] w-[90vw] max-w-lg overflow-auto rounded-lg bg-white p-4 shadow-2xl">
          <div className="mb-2 border-b pb-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-red-600">
                  메타태그 디버그 정보
                </h3>
                <p className="text-xs text-gray-500">레시피 ID: {recipeId}</p>
              </div>
              <button
                onClick={fetchServerDebugInfo}
                disabled={isLoading}
                className="rounded bg-blue-500 px-2 py-1 text-xs text-white disabled:opacity-50"
              >
                {isLoading ? '로딩...' : '새로고침'}
              </button>
            </div>
          </div>

          {/* 서버 사이드 디버그 정보 */}
          {serverDebugInfo && (
            <div className="mb-4 space-y-2 rounded bg-blue-50 p-3 text-xs">
              <h4 className="font-bold text-blue-800">
                서버 사이드 디버그 정보 (page.tsx console.log와 동일)
              </h4>
              <p className="text-[10px] text-blue-600">
                * 이 정보는 서버 사이드에서 실행되는 console.info/warn/error와
                동일한 정보입니다
              </p>

              {serverDebugInfo.error && (
                <div className="rounded bg-red-100 p-2">
                  <p className="font-semibold text-red-800">❌ API 에러:</p>
                  <p className="text-red-700">{serverDebugInfo.error}</p>
                </div>
              )}

              {serverDebugInfo.apiCall && (
                <div className="space-y-1">
                  <p className="font-semibold text-blue-700">
                    [getRecipeData] API 호출 시작 / API 응답 받음:
                  </p>
                  <div className="rounded bg-blue-100 p-2">
                    <p className="text-blue-900">
                      <span className="font-semibold">URL:</span>{' '}
                      {serverDebugInfo.apiCall.url}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">Status:</span>{' '}
                      {serverDebugInfo.apiCall.status ?? 'N/A'}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">hasData:</span>{' '}
                      {serverDebugInfo.apiCall.hasData ? '✅ true' : '❌ false'}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">hasNestedData:</span>{' '}
                      {serverDebugInfo.apiCall.hasNestedData
                        ? '✅ true'
                        : '❌ false'}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">responseStructure:</span>{' '}
                      {serverDebugInfo.apiCall.responseStructure.join(', ') ||
                        '없음'}
                    </p>
                  </div>
                </div>
              )}

              {serverDebugInfo.recipeData && (
                <div className="space-y-1">
                  <p className="font-semibold text-blue-700">
                    [getRecipeData] 레시피 데이터 추출 성공 / 최종 성공:
                  </p>
                  <div className="rounded bg-blue-100 p-2">
                    <p className="text-blue-900">
                      <span className="font-semibold">hasTitle:</span>{' '}
                      {serverDebugInfo.recipeData.hasTitle
                        ? '✅ true'
                        : '❌ false'}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">hasDescription:</span>{' '}
                      {serverDebugInfo.recipeData.hasDescription
                        ? '✅ true'
                        : '❌ false'}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">hasImages:</span>{' '}
                      {serverDebugInfo.recipeData.hasImages
                        ? '✅ true'
                        : '❌ false'}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">title:</span>{' '}
                      {serverDebugInfo.recipeData.title ?? '(없음)'}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">description:</span>{' '}
                      {serverDebugInfo.recipeData.description?.substring(
                        0,
                        50
                      ) ?? '(없음)'}
                      {serverDebugInfo.recipeData.description &&
                        serverDebugInfo.recipeData.description.length > 50 &&
                        '...'}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">imageUrl:</span>{' '}
                      {serverDebugInfo.recipeData.imageUrl ?? '(없음)'}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">imageCount:</span>{' '}
                      {serverDebugInfo.recipeData.imageCount}개
                    </p>
                  </div>
                </div>
              )}

              {serverDebugInfo.metadata && (
                <div className="space-y-1">
                  <p className="font-semibold text-blue-700">
                    [generateMetadata] 메타태그 생성 완료:
                  </p>
                  <div className="rounded bg-blue-100 p-2">
                    <p className="text-blue-900">
                      <span className="font-semibold">recipeId:</span>{' '}
                      {recipeId}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">title:</span>{' '}
                      {serverDebugInfo.metadata.title}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">description:</span>{' '}
                      {serverDebugInfo.metadata.description.substring(0, 50)}...
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">imageUrl:</span>{' '}
                      {serverDebugInfo.metadata.imageUrl}
                    </p>
                    <p className="text-blue-900">
                      <span className="font-semibold">recipeUrl:</span>{' '}
                      {serverDebugInfo.metadata.recipeUrl}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 클라이언트 메타태그 정보 */}
          {metadataInfo ? (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-gray-700">
                클라이언트 메타태그 (현재 페이지):
              </h4>

              <div>
                <p className="font-semibold text-gray-700">Title:</p>
                <p className="break-words text-gray-900">
                  {metadataInfo.title}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Description:</p>
                <p className="break-words text-gray-900">
                  {metadataInfo.description}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">OG Title:</p>
                <p className="break-words text-gray-900">
                  {metadataInfo.ogTitle}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">OG Description:</p>
                <p className="break-words text-gray-900">
                  {metadataInfo.ogDescription}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">OG Image:</p>
                <p className="break-words text-gray-900">
                  {metadataInfo.ogImage}
                </p>
                {metadataInfo.ogImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    alt="OG 미리보기"
                    className="mt-2 max-h-32 w-full object-contain"
                    src={metadataInfo.ogImage}
                  />
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-700">OG URL:</p>
                <p className="break-words text-gray-900">
                  {metadataInfo.ogUrl}
                </p>
              </div>

              {/* 기본값 사용 여부 경고 */}
              {(metadataInfo.title === '맛있는 레시피' ||
                metadataInfo.description ===
                  '냉장고 속 재료로 만드는 유연채식 집밥 레시피') && (
                <div className="rounded bg-yellow-100 p-2">
                  <p className="font-semibold text-yellow-800">
                    ⚠️ 기본값 사용 중
                  </p>
                  <p className="text-yellow-700">
                    레시피 데이터가 제대로 적용되지 않았습니다.
                  </p>
                </div>
              )}

              {/* 서버와 클라이언트 비교 */}
              {serverDebugInfo?.metadata && (
                <div className="rounded bg-gray-100 p-2">
                  <p className="font-semibold text-gray-700">비교:</p>
                  <p className="text-gray-900">
                    서버 Title === 클라이언트 OG Title:{' '}
                    {serverDebugInfo.metadata.title === metadataInfo.ogTitle
                      ? '✅'
                      : '❌'}
                  </p>
                  <p className="text-gray-900">
                    서버 Image === 클라이언트 OG Image:{' '}
                    {serverDebugInfo.metadata.imageUrl === metadataInfo.ogImage
                      ? '✅'
                      : '❌'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">메타태그 정보를 수집 중...</p>
          )}
        </div>
      )}
    </>
  );
};

export default MetadataDebugPanel;
