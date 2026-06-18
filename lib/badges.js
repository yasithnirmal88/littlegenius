/**
 * Badge Awarding Utility
 * Evaluates earned badges criteria and inserts new awards into user_badges table.
 */
export async function checkAndAwardBadges(supabase, userId, customStats = {}) {
  try {
    // 1. Fetch all badges
    const { data: badges, error: badgesErr } = await supabase
      .from('badges')
      .select('*')

    if (badgesErr || !badges || badges.length === 0) {
      return []
    }

    // 2. Fetch already earned badges
    const { data: earnedBadges, error: earnedErr } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId)

    if (earnedErr) {
      return []
    }

    const earnedIds = new Set((earnedBadges || []).map((b) => Number(b.badge_id)))

    // 3. Fetch user info
    const { data: user } = await supabase
      .from('users')
      .select('streak, modules_completed')
      .eq('id', userId)
      .single()

    if (!user) return []

    // 4. Fetch user progress
    const { data: progressList } = await supabase
      .from('user_progress')
      .select('stars, quiz_scores')
      .eq('user_id', userId)

    // Calculate dynamic stats
    const modulesCompletedCount = user.modules_completed || 0
    const streakCount = user.streak || 0
    const perfectModulesCount = (progressList || []).filter((p) => p.stars === 3).length

    let perfectQuizCount = 0
    if (progressList) {
      progressList.forEach((p) => {
        const scores = p.quiz_scores || []
        if (Array.isArray(scores)) {
          scores.forEach((s) => {
            if (s && s.score === 100) {
              perfectQuizCount++
            }
          })
        }
      })
    }

    // Shorts watched
    let shortsWatchedCount = customStats.shorts_watched || 0
    if (typeof window !== 'undefined') {
      try {
        const watchedList = JSON.parse(localStorage.getItem('shorts_watched') || '[]')
        shortsWatchedCount = Math.max(shortsWatchedCount, watchedList.length)
      } catch (e) {
        // ignore
      }
    }

    const newlyEarnedBadges = []

    for (const badge of badges) {
      const badgeId = Number(badge.id)
      if (earnedIds.has(badgeId)) {
        continue // Already earned
      }

      const crit = badge.criteria
      if (!crit || !crit.type) continue

      let isQualified = false
      const requiredCount = Number(crit.count || 1)

      switch (crit.type) {
        case 'modules_completed':
          isQualified = modulesCompletedCount >= requiredCount
          break
        case 'perfect_module':
          isQualified = perfectModulesCount >= requiredCount
          break
        case 'perfect_quiz':
          isQualified = perfectQuizCount >= requiredCount
          break
        case 'streak':
          isQualified = streakCount >= requiredCount
          break
        case 'shorts_watched':
          isQualified = shortsWatchedCount >= requiredCount
          break
        default:
          break
      }

      if (isQualified) {
        // Insert into database
        const { error: insertErr } = await supabase
          .from('user_badges')
          .insert({ user_id: userId, badge_id: badgeId })
          .select()

        if (!insertErr) {
          newlyEarnedBadges.push(badge)
        }
      }
    }

    return newlyEarnedBadges
  } catch (err) {
    console.error('Error in badge check:', err)
  }
  return []
}
