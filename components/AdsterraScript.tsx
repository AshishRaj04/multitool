import Script from "next/script";

export default function AdsterraScript() {
  const adsterraUrl =
    process.env.NEXT_PUBLIC_ADSTERRA_URL ||
    "//pl12345678.highcpmgate.com/ab/cd/ef/abcdef123456.js";

  return (
    <>
      {/* Adsterra "Social Bar" or "Popunder" script */}
      <Script
        id="adsterra-script"
        strategy="lazyOnload" // Loads slightly later so it doesn't slow down your site
        src={adsterraUrl}
      />
    </>
  );
}
