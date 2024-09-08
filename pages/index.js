import Image from "next/image";
import dynamic from "next/dynamic";

const LayoutComponent = dynamic(() => import("@/layout"), {
  loading: () => <p> Loading... </p>,
});

export default function Home() {
  return (
    <>
      <LayoutComponent
        metaTitle="Home"
        metaDescription="Ini merupakan halaman Home"
      >
        <p className="text-lg p-4 font-bold"> Mini Project Quiz Pekan 3 </p>{" "}
        <p className="text-md px-4 py-2 font-regular">
          {" "}
          by Bagus Dermawan Mulya{" "}
        </p>{" "}
      </LayoutComponent>{" "}
    </>
  );
}
