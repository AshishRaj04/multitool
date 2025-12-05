"use client";

import { useEffect } from "react";

type AdBannerProps = {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
};

export default function AdBanner({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: AdBannerProps) {
  useEffect(() => {
    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||
        []).push({});
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }, []);

  const adClientId =
    process.env.NEXT_PUBLIC_ADSENSE_PID || "ca-pub-XXXXXXXXXXXXXXXX";

  return (
    <div className="my-4 w-full overflow-hidden text-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClientId}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
    </div>
  );
}
