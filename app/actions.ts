"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  ArrangerFollowers,
  ArrangersPublicData,
  Library,
  Sales,
  Sheets,
  SheetsFileURL,
  Transactions,
} from "../utils/db/schema";
import { db } from "../utils/db";
import { and, eq } from "drizzle-orm";
import Stripe from "stripe";
import { CurrentUserWholeData, InferResultType } from "@/utils/db/infer-types";

const stripe = new Stripe(process.env.STRIPE_SECRET!);

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

  revalidatePath("/arranger-center");
  return { success: { sheetRes, sheetUrlRes } };
}

export async function editSheet(
  sheet: typeof Sheets.$inferSelect,
  sheetFileUrl: string
) {
  const sheetRes = await db
    .update(Sheets)
    .set({
      title: sheet.title,
      price: sheet.price,
      difficulty: sheet.difficulty,
      genres: sheet.genres,
      instruments_used: sheet.instruments_used,
      og_artists: sheet.og_artists,
      thumbnail_url: sheet.thumbnail_url,
    })
    .where(eq(Sheets.id, sheet.id))
    .returning();
  if (!sheetRes[0]) return { error: "No sheet data returned!" };
  const sheetUrlRes = await db
    .update(SheetsFileURL)
    .set({
      url: sheetFileUrl,
    })
    .where(eq(SheetsFileURL.sheet_id, sheet.id))
    .returning();
  if (!sheetUrlRes[0]) return { error: "No sheet file url data returned!" };

  revalidatePath("/arranger-center");
  return { success: { sheetRes, sheetUrlRes } };
}

export async function updateArranger(
  arranger: typeof ArrangersPublicData.$inferInsert
) {
  const user = await currentUser();
  if (!user) return { error: "No user!" };

  if (!user.publicMetadata.is_arranger) {
    return { error: "You are not an arranger!" };
  }

  if (user.publicMetadata.slug !== arranger.slug) {
    const res = await db.query.ArrangersPublicData.findFirst({
      where: eq(ArrangersPublicData.slug, arranger.slug),
    });

    if (res) return { error: "Slug already exists!", field: "slug" };
  }

  const arrangerRes = await db
    .update(ArrangersPublicData)
    .set({
      ...arranger,
      social_links: arranger.social_links,
    })
    .where(eq(ArrangersPublicData.id, user.id))
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

export async function createPaymentIntent(
  amount: number,
  sheets: Pick<typeof Sheets.$inferSelect, "id" | "price">[]
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      sheets: JSON.stringify(sheets),
    },
  });

  await saveTransaction(paymentIntent.id, sheets, amount);

  return paymentIntent;
}

export async function saveTransaction(
  paymentIntent: string,
  sheets: Pick<typeof Sheets.$inferSelect, "id" | "price">[],
  price: number
) {
  const user = await currentUser();
  if (!user) return { error: "No user!" };

  const res = await db
    .insert(Transactions)
    .values({
      payment_intent_id: paymentIntent,
      metadata: sheets,
      price,
      user_id: user.id,
      status: "pending",
    })
    .returning();
  if (!res[0]) return { error: "No transaction data returned!" };
  return { success: res };
}

export async function saveSheetToLibrary(id: number, payment_intent: string) {
  const user = await currentUser();
  if (!user) return { error: "No user!" };
  const res = await db
    .insert(Library)
    .values({
      sheet: id,
      payment_intent,
      user_id: user.id,
    })
    .returning();
  if (!res[0]) return { error: "No library data returned!" };
  return { success: res };
}

export async function updateTransaction(
  paymentIntent: string,
  status: "pending" | "succeeded" | "failed"
) {
  const user = await currentUser();
  if (!user) return { error: "No user!" };
  const res = await db
    .update(Transactions)
    .set({ status })
    .where(eq(Transactions.payment_intent_id, paymentIntent))
    .returning();
  if (!res[0]) return { error: "No transaction data returned!" };
  return { success: res };
}

export async function getUserFollowings(userId: string) {
  return await db.query.ArrangerFollowers.findMany({
    where: eq(ArrangerFollowers.follower_id, userId),
  });
}

export async function getUserTransactions(userId: string) {
  return await db.query.Transactions.findMany({
    with: {
      library: {
        with: {
          sheet: {
            with: {
              fileUrl: true,
              arranger: true,
            },
          },
        },
      },
    },
    where: eq(Transactions.user_id, userId),
  });
}

export async function getArrangerData(userId: string) {
  return await db.query.ArrangersPublicData.findFirst({
    with: {
      sheet: {
        with: {
          fileUrl: true,
          arranger: true,
          sale: {
            with: {
              sheet: true,
            },
          },
        },
      },
      sale: {
        with: {
          sheet: {
            with: {
              fileUrl: true,
              arranger: true,
            },
          },
        },
      },
    },
    where: eq(ArrangersPublicData.id, userId),
  });
}

export async function getUserWholeData(userId: string | null) {
  if (!userId)
    return {
      error: "No user!",
      userTransactions: null,
      arrangerData: null,
      userFollowings: null,
    };

  const res = await Promise.all([
    getUserTransactions(userId),
    getArrangerData(userId),
    getUserFollowings(userId),
  ]);
  return {
    userTransactions: res[0],
    arrangerData: res[1] ?? null,
    userFollowings: res[2] ?? null,
    error: null,
  };
}

export async function saveSale(
  sheet: Pick<typeof Sheets.$inferSelect, "id" | "price" | "arranger_id">,
  payment_intent: string
) {
  const user = await currentUser();
  if (!user) return { error: "No user!" };
  const res = await db
    .insert(Sales)
    .values({
      arranger_id: sheet.arranger_id,
      buyer_id: user.id,
      payment_intent,
      sheet: sheet.id,
    })
    .returning();
  if (!res[0]) return { error: "No sale data returned!" };
  return { success: "Sale created!" };
}

export async function followArranger(
  arranger: InferResultType<
    "ArrangersPublicData",
    {
      sheet: true;
      followers: true;
    }
  >
) {
  const user = await currentUser();
  if (!user) return { error: "No user!" };

  const isFollowed = await db.query.ArrangerFollowers.findFirst({
    where: and(
      eq(ArrangerFollowers.arranger_id, arranger.id),
      eq(ArrangerFollowers.follower_id, user.id)
    ),
  });

  if (isFollowed) return await unfollowArranger(arranger);

  const res = await db
    .insert(ArrangerFollowers)
    .values({
      arranger_id: arranger.id,
      follower_id: user.id,
    })
    .returning();
  if (!res[0]) return { error: "No sale data returned!" };
  revalidatePath("/arranger/" + arranger.slug);
  return { success: "Sale created!" };
}

export async function unfollowArranger(
  arranger: InferResultType<
    "ArrangersPublicData",
    {
      sheet: true;
      followers: true;
    }
  >
) {
  const user = await currentUser();
  if (!user) return { error: "No user!" };
  const res = await db
    .delete(ArrangerFollowers)
    .where(
      and(
        eq(ArrangerFollowers.arranger_id, arranger.id),
        eq(ArrangerFollowers.follower_id, user.id)
      )
    )
    .returning();
  if (!res[0]) return { error: "No sale data returned!" };
  revalidatePath("/arranger/" + arranger.slug);
  return { success: "Sale created!" };
}

export async function getArrangerFollowers(
  arranger: InferResultType<
    "ArrangersPublicData",
    {
      sheet: true;
      followers: true;
    }
  >
) {
  const res = await db.query.ArrangerFollowers.findMany({
    where: eq(ArrangerFollowers.arranger_id, arranger.id),
  });
  if (!res[0]) return { error: "No  data returned!" };
  return { success: res };
}
