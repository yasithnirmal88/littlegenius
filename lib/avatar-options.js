export const AVATAR_OPTIONS = [
  { id: 'alex', label: 'Alex', src: '/avatars/Alex.png' },
  { id: 'boa', label: 'Boa', src: '/avatars/Boa.png' },
  { id: 'cindy', label: 'Cindy', src: '/avatars/Cindy.png' },
  { id: 'clover', label: 'Clover', src: '/avatars/Clover.png' },
  { id: 'jade', label: 'Jade', src: '/avatars/Jade.png' },
  { id: 'mark', label: 'Mark', src: '/avatars/Mark.png' },
  { id: 'max', label: 'Max', src: '/avatars/Max.png' },
  { id: 'william', label: 'William', src: '/avatars/William.png' },
  { id: 'yumiko', label: 'Yumiko', src: '/avatars/Yumiko.png' },
]

const AVATAR_LOOKUP = Object.fromEntries(AVATAR_OPTIONS.map((avatar) => [avatar.id, avatar]))

export function avatarFromId(id) {
  if (!id) return AVATAR_OPTIONS[0]
  return AVATAR_LOOKUP[id] || AVATAR_OPTIONS[0]
}

export function avatarFromSeed(seed) {
  const source = String(seed || 'Little Genius')
  const hash = [...source].reduce((total, char) => total + char.charCodeAt(0), 0)
  return AVATAR_OPTIONS[hash % AVATAR_OPTIONS.length]
}
