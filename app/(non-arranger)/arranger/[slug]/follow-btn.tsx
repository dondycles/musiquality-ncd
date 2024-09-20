"use client";

import { followArranger, unfollowArranger } from "@/app/actions";
import { UserDataContext } from "@/components/providers/user-data-provider";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { UserMinus, UserPlus } from "lucide-react";
import { useCallback, useContext, useState } from "react";
import { debounce } from "lodash-es";
import { InferResultType } from "@/utils/db/infer-types";

export default function FollowBtn({
  arranger,
}: {
  arranger: InferResultType<
    "ArrangersPublicData",
    {
      sheet: true;
      followers: true;
    }
  >;
}) {
  const { userFollowings, resource, isLoading } = useContext(UserDataContext);
  const queryClient = useQueryClient();
  const isFollowed = Boolean(
    userFollowings?.find((a) => a.arranger_id === arranger.id)
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFollow = useCallback(
    debounce(async () => {
      if (!resource) return;
      isFollowed
        ? await unfollowArranger(arranger)
        : await followArranger(arranger);
      queryClient.invalidateQueries({
        queryKey: ["user-data", resource?.id],
      });
    }, 500),
    [isFollowed, resource, userFollowings]
  );

  return (
    <Button
      disabled={isLoading}
      variant={isFollowed ? "ghost" : "default"}
      onClick={handleFollow}
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
