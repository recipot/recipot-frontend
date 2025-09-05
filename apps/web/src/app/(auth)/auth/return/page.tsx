export default function AuthReturnPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">로그인 중...</h1>
        <p className="text-gray-500">잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}
