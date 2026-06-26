export default function Loading() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-3 border-white/[0.08] border-t-accent-500 animate-spin" />
        <p className="text-sm text-surface-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}
