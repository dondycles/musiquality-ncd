import MakeAsArrangerBtn from "./apply-arranger-btn";
import { type User as UserType } from "@clerk/nextjs/server";
export default function User({
  u,
  currentUser,
}: {
  u: UserType;
  currentUser: { fullName: string; id: string };
}) {
  return (
    <div
      key={u.id}
      className="flex flex-col bg-muted text-muted-foreground gap-4 rounded-md p-4"
    >
      <div className="flex flex-row gap-2 items-center">
        <img src={u.imageUrl} className="size-8 rounded-full" />
        <p>{u.fullName}</p>
      </div>
      <p>{JSON.stringify(u.publicMetadata)}</p>
      {u.id === currentUser.id && !u.publicMetadata.is_arranger && (
        <MakeAsArrangerBtn currentUser={currentUser} />
      )}
    </div>
  );
}
