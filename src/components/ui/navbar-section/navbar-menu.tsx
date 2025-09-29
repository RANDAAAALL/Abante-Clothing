import { useMounted } from "@/hooks/useMounted";
import { useMenuBarStore } from "@/lib/store/menu-bar";

export default function MenuBar() {
  const { isOpen, setIsOpen } = useMenuBarStore();
  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <>
      {isOpen ? (
        // close icon
        <svg
          className="cursor-pointer w-7 absolute z-[10000] top-8 right-3 text-black dark:text-white md:hidden"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          fill="currentColor"
          onClick={() => setIsOpen(!isOpen)}>
          <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
        </svg>
      ) : (
        // menu icon
        <svg
          className="cursor-pointer w-7 absolute z-[10000] top-8 right-3 text-black dark:text-white md:hidden"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          fill="currentColor"
          onClick={() => setIsOpen(!isOpen)}>
          <path d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z" />
        </svg>
      )}
    </>
  );
}
