import type { Database } from '..'
import { and, count, eq, gt, ilike, isNull, or } from 'drizzle-orm'
import { strikes } from '../schema'

export class StrikesRepository {
  constructor(private readonly db: Database) {}

  /**
   * Get all strikes for a user
   * @param params - Parameters
   * @param params.userId User to get strikes for
   * @param params.guildId Guild to get strikes for
   * @param params.includeDeleted Whether to include deleted strikes
   * @param params.includeExpired Whether to include expired strikes
   * @param params.reasons Reasons to filter strikes by
   * @returns All strikes for the user
   */
  async getForUser({
    userId,
    guildId,
    includeDeleted = false,
    includeExpired = false,
    reasons,
  }: {
    userId: string
    guildId: string
    includeDeleted?: boolean
    includeExpired?: boolean
    reasons?: string[]
  }) {
    const userStrikes = await this.db.query.strikes.findMany({
      where: (strikes, { and, eq, gt }) =>
        and(
          eq(strikes.userId, userId),
          eq(strikes.guildId, guildId),
          includeExpired ? undefined : gt(strikes.expiresAt, new Date()),
          includeDeleted ? undefined : isNull(strikes.deletedAt),
          reasons?.length ? or(...reasons.map(reason => ilike(strikes.reason, `%${reason}%`))) : undefined,
        ),
      orderBy: (strikes, { desc }) => [desc(strikes.createdAt)],
    })

    return userStrikes
  }

  async countForUser({
    userId,
    guildId,
    includeDeleted = false,
    includeExpired = false,
    reasons,
  }: {
    userId: string
    guildId: string
    includeDeleted?: boolean
    includeExpired?: boolean
    reasons?: string[]
  }) {
    const query = this.db
      .select({ count: count() })
      .from(strikes)
      .where(
        and(
          eq(strikes.userId, userId),
          eq(strikes.guildId, guildId),
          includeDeleted ? undefined : isNull(strikes.deletedAt),
          includeExpired ? undefined : gt(strikes.expiresAt, new Date()),
          reasons?.length ? or(...reasons.map(reason => ilike(strikes.reason, `%${reason}%`))) : undefined,
        ),
      )

    return query.then(result => result[0]?.count ?? 0)
  }

  /**
   * Create a new strike record for a user
   * @param params - Parameters
   * @param params.userId User to strike
   * @param params.guildId Guild to strike the user in
   * @param params.reason Reason for the strike
   * @param params.ttlInMs - Time to live in milliseconds
   * @param params.strike - Strike number
   * @returns The number of deleted strikes
   */
  async strikeUser({
    userId,
    guildId,
    reason,
    ttlInMs,
    strike,
  }: {
    userId: string
    guildId: string
    reason: string
    ttlInMs: number
    strike: number
  }) {
    await this.db.insert(strikes).values({
      strike,
      userId,
      guildId,
      reason,
      expiresAt: new Date(Date.now() + ttlInMs),
    })

    return await this.countForUser({ userId, guildId, reasons: reason.split(', ') })
  }

  /**
   * Clear all strikes for a user
   * @param params - Parameters
   * @param params.userId User to clear strikes for
   * @param params.guildId Guild to clear strikes for
   * @returns The number of deleted strikes
   */
  async clearUserStrikes({ userId, guildId }: { userId: string, guildId: string }) {
    return await this.db
      .update(strikes)
      .set({ deletedAt: new Date() })
      .where(and(eq(strikes.userId, userId), eq(strikes.guildId, guildId)))
  }
}
