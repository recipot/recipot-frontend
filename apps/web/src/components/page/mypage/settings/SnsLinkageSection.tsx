// --- 임시 아이콘 컴포넌트 (실제 프로젝트의 아이콘으로 대체하세요) ---
const KakaoIcon = () => (
  <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current text-black">
    <path d="M16 4.64c-6.96 0-12.64 4.48-12.64 10.08 0 3.52 2.32 6.64 5.76 8.48l-1.84 6.72 7.44-3.84c.48.08 1.04.08 1.52.08 6.96 0 12.64-4.48 12.64-10.08s-5.68-10.08-12.64-10.08z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-6 w-6">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.8C34.661 8.966 29.698 6 24 6 12.955 6 4 14.955 4 26s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.843-5.843A19.933 19.933 0 0024 6c-5.698 0-10.661 2.966-13.896 7.196l-3.8-2.505z"
    />
    <path
      fill="#4CAF50"
      d="M24 46c5.952 0 11.233-2.636 14.905-6.986l-6.52-5.016c-2.193 1.436-4.952 2.292-8.385 2.292-5.222 0-9.62-3.344-11.236-7.918l-6.521 5.023A19.91 19.91 0 0024 46z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.522 5.016c3.566-3.266 6.246-7.816 6.246-13.587 0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);
// --- 임시 아이콘 컴포넌트 끝 ---

const SnsLinkageSection = () => {
  return (
    <section>
      <h2 className="text-md font-semibold text-gray-800">SNS 연동</h2>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-gray-500">간편 로그인 수단 추가</span>
        <div className="flex items-center gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 shadow-sm">
            <KakaoIcon />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 shadow-sm">
            <GoogleIcon />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SnsLinkageSection;
