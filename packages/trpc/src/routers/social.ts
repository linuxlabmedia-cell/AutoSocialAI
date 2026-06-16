import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createProfile, generateConnectUrl, getProfileDetails, deleteProfile } from "../lib/ayrshare";

const PROD_DOMAIN =
  process.env.AYRSHARE_DOMAIN ??
  (process.env.NEXT_PUBLIC_PROD_URL ?? "").replace(/^https?:\/\//, "") ??
  "autosocialai-production.up.railway.app";

export const socialRouter = createTRPCRouter({
  // Get (or create) the Ayrshare JWT connect URL for a client
  getConnectUrl: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      let profileKey = client.ayrshareProfileKey;

      if (!profileKey) {
        const profile = await createProfile(client.businessName);
        console.log("[Ayrshare] createProfile response:", JSON.stringify(profile));
        if (!profile.profileKey) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Ayrshare profile creation failed: ${JSON.stringify(profile)}`,
          });
        }
        profileKey = profile.profileKey;
        await ctx.db.client.update({
          where: { id: input.clientId },
          data: { ayrshareProfileKey: profileKey },
        });
      }

      const result = await generateConnectUrl(profileKey, PROD_DOMAIN);
      console.log("[Ayrshare] generateConnectUrl response:", JSON.stringify(result));
      if (!result.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Ayrshare URL generation failed: ${JSON.stringify(result)}`,
        });
      }
      return { url: result.url };
    }),

  // Get connected social platforms for a client (from Ayrshare)
  getConnectedAccounts: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
        select: { ayrshareProfileKey: true },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });
      if (!client.ayrshareProfileKey) return { platforms: [], profileKey: null };

      try {
        const profile = await getProfileDetails(client.ayrshareProfileKey);
        return {
          platforms: profile.activeSocialAccounts ?? [],
          displayNames: profile.displayNames ?? {},
          profileKey: client.ayrshareProfileKey,
        };
      } catch {
        return { platforms: [], displayNames: {}, profileKey: client.ayrshareProfileKey };
      }
    }),

  // Disconnect all social accounts and remove the Ayrshare profile
  disconnectAll: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
        select: { ayrshareProfileKey: true },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });
      if (!client.ayrshareProfileKey) return;

      await deleteProfile(client.ayrshareProfileKey);
      await ctx.db.client.update({
        where: { id: input.clientId },
        data: { ayrshareProfileKey: null },
      });
    }),
});
