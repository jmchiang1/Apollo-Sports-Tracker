import { SideNav } from "@/components/nav/SideNav";
import { BottomNav } from "@/components/nav/BottomNav";
import { MobileTopBar } from "@/components/nav/MobileTopBar";

/** Responsive app frame: left rail on desktop, top bar + bottom tabs on mobile. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <SideNav />
      <div className="md:pl-64">
        <MobileTopBar />
        <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 md:pb-16 lg:px-10">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
