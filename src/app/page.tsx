import { poppins } from "./fonts";
import ImageInput from "./ui/image-input";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-row items-center justify-between p-2 lg:p-10">
        <h2
          className={`font-semibold text-2xl text-black ${poppins.className}`}
        >
          ImageToOCR Utility
        </h2>
        <p className="text-gray-600 hidden lg:block">
          Built with teamwork, not tyranny
        </p>
      </div>

      <ImageInput />
    </main>
  );
}
