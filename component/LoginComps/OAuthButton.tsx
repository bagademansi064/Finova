import React from "react";

interface OAuthButtonface{
    providerName: string,
    icon: any
}

// const OAuthButton = ({ providerName, icon }: OAuthButtonface) => {
//   return (
//     <button
//       type="button"
//       aria-label={`Sign in with ${providerName}`}
//       className="flex h-12 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A6B56] focus:ring-offset-1"
//     >
//       {icon}
//     </button>
//   );
// };

const OAuthButton = ({ providerName, icon }: OAuthButtonface) => {
  return (
    <button
      type="button"
      aria-label={`Sign in with ${providerName}`}
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0D624B] focus:ring-offset-1 sm:shadow-none md:h-16 md:w-16 lg:h-16 lg:w-16"
    >
      {icon}
    </button>
  );
};

export default OAuthButton;