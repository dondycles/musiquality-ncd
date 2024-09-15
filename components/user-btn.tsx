import { UserButton } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import { BookUser, Music } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserBtn({ user }: { user: UserResource }) {
  const router = useRouter();
  return (
    <UserButton
      userProfileProps={{
        appearance: {
          elements: {},
        },
      }}
    >
      <UserButton.MenuItems>
        {user.publicMetadata.is_arranger ? (
          <UserButton.Action
            label="Arranger Center"
            labelIcon={<Music size={16} />}
            onClick={() => router.push("/arranger-center")}
          />
        ) : (
          <UserButton.Action
            label="Apply as Arranger"
            labelIcon={<Music size={16} />}
            onClick={() => router.push("/apply-as-arranger")}
          />
        )}

        <UserButton.Action
          label="Library"
          labelIcon={<BookUser size={16} />}
          onClick={() => router.push("/library")}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
