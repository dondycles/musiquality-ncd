"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ArrangersPublicData, Sheets, SheetsFileURL } from "./db/schema";
import { db } from "./db";

export async function applyAsArranger() {
  const user = await currentUser();
  if (!user) return { error: "No user!" };

  const res = await db
    .insert(ArrangersPublicData)
    .values({
      name:
        user.fullName ??
        user.firstName ??
        user.lastName ??
        user.username ??
        user.emailAddresses[0].emailAddress,
      id: user.id,
      created_at: new Date(),
      instruments: [],
      avatar_url: user.imageUrl,
      social_links: [],
      genres: [],
      slug: user.id,
    })
    .returning();

  if (!res[0]) {
    return { error: "No data returned!" };
  }

  const clerk = clerkClient();

  await clerk.users.updateUserMetadata(user.id, {
    publicMetadata: {
      is_arranger: true,
      arranger_created_at: Date.now(),
      ...res[0],
    },
  });

  revalidatePath("/apply-as-arranger");

  return { success: true };
}

export async function uploadSheet(
  sheet: typeof Sheets.$inferInsert & { arranger_id: string },
  sheetFileUrl: string
) {
  const sheetRes = await db.insert(Sheets).values(sheet).returning();
  if (!sheetRes[0]) return { error: "No sheet data returned!" };
  const sheetUrlRes = await db
    .insert(SheetsFileURL)
    .values({
      url: sheetFileUrl,
      sheet_id: sheetRes[0].id,
    })
    .returning();
  if (!sheetUrlRes[0]) return { error: "No sheet file url data returned!" };

  revalidatePath("/");
  return { success: { sheetRes, sheetUrlRes } };
}

export async function updateArranger(
  arranger: typeof ArrangersPublicData.$inferInsert
) {
  const arrangerRes = await db
    .update(ArrangersPublicData)
    .set({
      ...arranger,
      social_links: arranger.social_links,
    })
    .returning();
  if (!arrangerRes[0]) return { error: "No arranger data returned!" };

  await clerkClient.users.updateUserMetadata(arranger.id, {
    publicMetadata: {
      ...arranger,
    },
  });

  revalidatePath("/arranger-center");

  return { success: arrangerRes };
}
