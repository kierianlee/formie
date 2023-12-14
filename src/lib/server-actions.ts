"use server";

import { headers } from "next/headers";

export async function getIPAddress() {
  return headers().get("x-forwarded-for");
}
