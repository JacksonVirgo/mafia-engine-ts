import { db } from "../app/database/database";
import { ServerFlag } from "../database/servers";

export async function matchServerFeatureFlags(serverId: string, featureFlags: ServerFlag[]) {
    if (featureFlags.length <= 0) return true;

    const existingFlags = await db.query.serverFeatureFlags.findMany({
        where: (fields, { eq }) => eq(fields.id, serverId),
    });

    const existingFlagSet = new Set(existingFlags.map(f => f.featureFlag));
    const hasAllFlags = featureFlags.every(flag => existingFlagSet.has(flag));


    console.log(existingFlags, existingFlagSet, hasAllFlags);

    return hasAllFlags;
}
