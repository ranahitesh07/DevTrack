export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">
      <h2 className="text-2xl font-semibold">
        Dashboard
      </h2>

      <div className="text-sm text-slate-500">
        Welcome back User
      </div>
    </header>
  );
}