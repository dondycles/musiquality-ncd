"use client";

import { followArranger, unfollowArranger } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { UserMinus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { InferResultType } from "@/utils/db/infer-types";

export default function FollowBtn({
  arranger,
  isFollowed,
}: {
  arranger: InferResultType<
    "ArrangersPublicData",
    {
      sheet: true;
      followers: true;
    }
  >;
  isFollowed: boolean;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const handleFollow = async () => {
      await followArranger(arranger);
    };
    handleFollow();
    setTimeout(() => setLoading(false), 2000);
  }, [arranger, isFollowed, loading]);

  return (
    <Button
      disabled={loading}
      variant={isFollowed ? "ghost" : "default"}
      onClick={() => setLoading(true)}
    >
      {isFollowed ? "Unfollow" : "Follow"}
      {isFollowed ? (
        <UserMinus size={16} className="ml-1" />
      ) : (
        <UserPlus size={16} className="ml-1" />
      )}
    </Button>
  );
}
