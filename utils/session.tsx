// a function which get's the session from the cookies and returns it

import { cookies } from "next/headers";

export const getSession = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  return session?.value;
};
