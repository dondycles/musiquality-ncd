"use client";

export default function ListViewer({
  children,
  length,
}: {
  children: React.ReactNode;
  length: number;
}) {
  return (
    <div
      className={`${
        length > 5
          ? "grid grid-cols-1 sm:grid-cols-2 grid-rows-5 gap-4"
          : "flex flex-col gap-4"
      }   w-full h-fit`}
    >
      {children}
    </div>
  );
}
