"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/portfolio", icon: "/house.svg", alt: "홈", size: 17 },
  { href: "/reels", icon: "/film.svg", alt: "포폴 릴스", size: 17 },
  { href: "/bookmark", icon: "/bookmark.svg", alt: "북마크", size: 14 },
  { href: "/upload", icon: "/plus.svg", alt: "업로드", size: 14 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-16 flex-col items-center justify-between border-r py-[19px] sm:w-20"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <Link href="/" className="flex size-10 items-center justify-center">
        <Image src="/logo.svg" alt="Posta" width={26} height={25} />
      </Link>

      <nav className="flex flex-col gap-4">
        {navItems.map(({ href, icon, alt, size }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex size-10 items-center justify-center rounded-[6px] transition-colors"
              style={{
                background: isActive ? "var(--color-primary)" : "transparent",
              }}
            >
              <Image
                src={icon}
                alt={alt}
                width={size}
                height={size}
                style={{ filter: isActive ? "brightness(0)" : "brightness(0) invert(1)" }}
              />
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-4 items-center">
        <Link href="/profile" className="size-10 overflow-hidden rounded-full">
          <Image src="/dummyProfile.png" alt="프로필" width={40} height={40} className="object-cover size-full" />
        </Link>
        <Link href="/settings" className="flex size-10 items-center justify-center rounded-[6px] transition-colors hover:bg-white/10">
          <Image src="/settings.svg" alt="설정" width={18} height={19} />
        </Link>
      </div>
    </aside>
  );
}
