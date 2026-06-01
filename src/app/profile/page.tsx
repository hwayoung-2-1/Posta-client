import Image from "next/image";
import SavedCard from "@/components/bookmark/SavedCard";

// Figma 524-4561 (빈) / 532-5855 (채워진) · 유저 프로필 페이지
interface ProfileData {
  name: string;
  email: string;
  intro: string;
  job: string;
  skills: string;
  phone: string;
  github: string;
  published: number;
  saved: number;
  likes: number;
  portfolios: { id: number; ratio: string }[];
}

// 채워진 상태 (532-5855). 빈 값이면 524-4561 의 안내 문구로 대체됨.
const PROFILE: ProfileData = {
  name: "Jin_Venus0801",
  email: "highspeed1633@gmail.com",
  intro: "UX/UI 디자이너 Jin_Venus입니다. 웹, 앱 다른거 모두 가능하고, B2B 실서비스 경험 있습니다.",
  job: "UX/UI Designer",
  skills: "Figma, Adobe Photoshop, Adobe Illustrator, React Native",
  phone: "010-9928-0902",
  github: "https://github.com/jin_venus",
  published: 5,
  saved: 5,
  likes: 24,
  portfolios: [
    { id: 1, ratio: "16 / 9" },
    { id: 2, ratio: "4 / 3" },
    { id: 3, ratio: "4 / 3" },
    { id: 4, ratio: "16 / 9" },
    { id: 5, ratio: "16 / 9" },
  ],
};

const fallback = (value: string, empty: string) => value.trim() || empty;

export default function ProfilePage() {
  const p = PROFILE;

  return (
    <div className="mx-auto min-h-screen max-w-[1100px] px-5 py-8 sm:px-12 sm:py-12">
      {/* 헤더: 아바타 + 이름 + 이메일 */}
      <div className="mb-8 flex items-center gap-4 sm:gap-6">
        <div className="size-16 shrink-0 overflow-hidden rounded-full sm:size-[88px]">
          <Image
            src="/dummyProfile.png"
            alt={p.name}
            width={88}
            height={88}
            className="size-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate text-[22px] font-semibold tracking-[-1px] text-white sm:text-[30px]">{p.name}</h1>
          <p className="text-[14px] text-[var(--color-muted)]">{p.email}</p>
        </div>
      </div>

      {/* 소개 카드 */}
      <div className="mb-12 flex flex-col gap-5 rounded-[12px] border border-[var(--color-border)] p-6">
        <Field label="내 소개" value={fallback(p.intro, "소개가 입력되지 않았습니다.")} />
        <Field label="직군" value={fallback(p.job, "직군이 입력되지 않았습니다.")} />
        <Field label="스킬" value={fallback(p.skills, "스킬이 입력되지 않았습니다.")} />

        {/* 연락처 내부 박스 */}
        <div className="flex flex-col gap-4 rounded-[8px] border border-[var(--color-border)] p-5">
          <Field label="Mail" value={fallback(p.email, "메일이 입력되지 않았습니다.")} small />
          <Field label="Phone" value={fallback(p.phone, "전화번호가 입력되지 않았습니다.")} small />
          <Field label="Github" value={fallback(p.github, "깃허브 주소가 입력되지 않았습니다.")} small />
        </div>
      </div>

      {/* 통계 */}
      <h2 className="mb-4 text-[20px] font-semibold text-white">통계</h2>
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="공개한 포트폴리오" value={`${p.published}개`} icon="upload" />
        <StatCard label="저장된 포트폴리오" value={`${p.saved}개`} icon="bookmark" />
        <StatCard label="좋아요 수" value={`${p.likes}회`} icon="like" />
      </div>

      {/* 포트폴리오 */}
      <h2 className="mb-4 text-[20px] font-semibold text-white">포트폴리오</h2>
      {p.portfolios.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-[12px] border border-[var(--color-border)]">
          <p className="text-[16px] text-[var(--color-muted)]">
            업로드된 포트폴리오가 없습니다.
          </p>
        </div>
      ) : (
        <div className="columns-1 gap-6 xl:columns-2">
          {p.portfolios.map((pf) => (
            <SavedCard
              key={pf.id}
              username="USER_NAME_01"
              ratio={pf.ratio}
              href={`/profile/${pf.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[13px] text-[var(--color-muted)]">{label}</p>
      <p className={`${small ? "text-[14px]" : "text-[16px]"} text-[var(--color-fg)]`}>
        {value}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: "upload" | "bookmark" | "like";
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[var(--color-border)] p-6">
      <div className="flex flex-col gap-1">
        <p className="text-[14px] text-[var(--color-muted)]">{label}</p>
        <p className="text-[24px] font-semibold text-white">{value}</p>
      </div>
      <StatIcon name={icon} />
    </div>
  );
}

function StatIcon({ name }: { name: "upload" | "bookmark" | "like" }) {
  const common = {
    width: 40,
    height: 40,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-border-strong)",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "upload") {
    return (
      <svg {...common}>
        <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
      </svg>
    );
  }
  if (name === "bookmark") {
    return (
      <svg {...common}>
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}
