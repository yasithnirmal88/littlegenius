/**
 * Rank Promotion Utility
 * Checks user XP against ranks table and upgrades rank if threshold is crossed.
 */
export async function checkAndUpgradeRank(supabase, userId, currentXp) {
  try {
    const { data: ranks, error } = await supabase
      .from('ranks')
      .select('*')
      .order('min_xp', { ascending: true })

    if (error || !ranks || ranks.length === 0) {
      return null
    }

    // Find the highest qualified rank
    let qualifiedRankObj = null
    for (const r of ranks) {
      if (currentXp >= r.min_xp) {
        qualifiedRankObj = r
      }
    }

    if (!qualifiedRankObj) return null

    // Get current user rank to check if it's a promotion
    const { data: user } = await supabase
      .from('users')
      .select('rank')
      .eq('id', userId)
      .single()

    if (user && user.rank !== qualifiedRankObj.title) {
      await supabase
        .from('users')
        .update({ rank: qualifiedRankObj.title })
        .eq('id', userId)
      return qualifiedRankObj.title
    }
  } catch (err) {
    console.error('Error in rank upgrade check:', err)
  }
  return null
}
