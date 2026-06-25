export default function Loading() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-surface-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-3 border-surface-200 border-t-date-purple animate-spin" />
        <p className="text-sm text-surface-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}
