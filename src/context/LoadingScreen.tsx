export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Circle */}
        <div className="relative h-20 w-20">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>

          {/* Middle pulse glow */}
          <div className="absolute inset-2 animate-pulse rounded-full bg-primary/20 blur-md"></div>

          {/* Inner gradient circle */}
          <div className="absolute inset-4 animate-[scaleInOut_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600"></div>
        </div>

        {/* Animated Text */}
        <p className="animate-pulse text-sm font-semibold text-gray-700 dark:text-gray-300">
          Please wait...
        </p>
      </div>

      {/* Custom animation */}
      <style>
        {`
          @keyframes scaleInOut {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
        `}
      </style>
    </div>
  );
}
