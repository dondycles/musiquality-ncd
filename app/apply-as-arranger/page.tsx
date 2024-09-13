import ApplyAsArrangerBtn from "@/components/apply-arranger-btn";
import { currentUser } from "@clerk/nextjs/server";
import { DollarSign, Music, UserCog, Users } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ApplyAsArrangerPage() {
  const user = await currentUser();

  if (user?.publicMetadata.is_arranger) return redirect("/arranger-center");
  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding ">
      <div className="text-center">
        <h1 className="font-semibold text-6xl  leading-normal">
          Be an Arranger and earn like a Millionaire!
        </h1>
        <p>Earn up to $1,000 a month with just 10 piano arrangements.</p>
      </div>
      <ApplyAsArrangerBtn />
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 mx-auto text-center max-w-[500px]">
        <div className="border rounded-md p-4 aspect-square flex items-center justify-center flex-col gap-4 font-black text-yellow-600">
          <UserCog size={32} />
          <p>200 Artists</p>
        </div>
        <div className="border rounded-md p-4 aspect-square flex items-center justify-center flex-col gap-4 font-black text-blue-600">
          <Music size={32} />
          <p>200,000 Arrangements</p>
        </div>
        <div className="border rounded-md p-4 aspect-square flex items-center justify-center flex-col gap-4 font-black text-orange-600">
          <Users size={32} />
          <p>100,000 Customers</p>
        </div>
        <div className="border rounded-md p-4 aspect-square flex items-center justify-center flex-col gap-4 font-black text-green-600">
          <DollarSign size={32} />
          <p>$24 Avg. Spend</p>
        </div>
      </div>
    </div>
  );
}
