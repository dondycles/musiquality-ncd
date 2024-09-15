"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  ArrangersPublicData,
  Library,
  Sheets,
  SheetsFileURL,
  Transactions,
} from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

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

  revalidatePath("/");
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

export async function getUserTransactions() {
  const user = await currentUser();
  if (!user) return { error: "No user!" };
  const res = await db
    .select()
    .from(Transactions)
    .innerJoin(
      Library,
      eq(Transactions.payment_intent_id, Library.payment_intent)
    )
    .innerJoin(Sheets, eq(Library.sheet, Sheets.id))
    .innerJoin(
      ArrangersPublicData,
      eq(Sheets.arranger_id, ArrangersPublicData.id)
    )
    .innerJoin(SheetsFileURL, eq(Sheets.id, SheetsFileURL.sheet_id))
    .where(eq(Transactions.user_id, user!.id));
  if (!res[0]) return { error: "No transaction data returned!" };
  return { success: res };
}
