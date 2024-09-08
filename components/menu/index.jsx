import Link from "next/link";

export default function Menu() {
  return (
    <div className="flex gap-3 text-white">
      <Link href="/" className="hover:font-bold">
        Home
      </Link>
      <Link href="/notes" className="hover:font-bold">
        Notes
      </Link>
    </div>
  );
}
