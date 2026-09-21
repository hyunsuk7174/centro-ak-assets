import { requireUser, isHq, isSuper } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { Logo } from "@/components/ui/Logo";
import { NavLinks } from "@/components/ui/NavLinks";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const nav = [
    { href: "/dashboard", label: "계약" },
    ...(isHq(user) ? [{ href: "/admin/vehicles", label: "차량·가격" }, { href: "/admin/promotions", label: "프로모션" }, { href: "/admin/fees", label: "비용·등록비" }, { href: "/admin/approvals", label: "할인 승인" }, { href: "/admin/users", label: "딜러·사용자" }, { href: "/admin/stock", label: "차량 재고" }, { href: "/admin/registration", label: "등록서류" }] : []),
    ...(isSuper(user) ? [{ href: "/admin/documents", label: "문서·약관" }, { href: "/admin/audit", label: "감사로그" }] : []),
  ];
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <Logo height={28} />
          <nav className="hidden items-center gap-5 lg:flex" aria-label="주 메뉴"><NavLinks items={nav} /></nav>
          <div className="ml-auto flex items-center gap-4 text-[13px]">
            <span className="hidden whitespace-nowrap rounded-full bg-paper px-3 py-1 text-muted lg:inline">{user.name}</span>
            <form action={logoutAction}><button className="whitespace-nowrap text-muted hover:text-ink">로그아웃</button></form>
          </div>
        </div>
        <nav className="flex gap-5 overflow-x-auto whitespace-nowrap px-5 pb-2 lg:hidden" aria-label="주 메뉴 (모바일)"><NavLinks items={nav} /></nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 pb-28 lg:pb-12">{children}</main>
      <footer className="mx-auto max-w-6xl px-5 pb-8 text-[12px] text-muted">© 주식회사 센트로에이케이 · 전자계약 시스템</footer>
    </div>
  );
}
