export function useUserName() {
  const userName = useState<string>('user-name', () => '')
  const loaded = useState<boolean>('user-name-loaded', () => false)

  if (import.meta.client && !loaded.value) {
    const saved = localStorage.getItem('finance-helper-username')
    if (saved) {
      userName.value = saved
    }
    loaded.value = true

    watch(userName, (val) => {
      localStorage.setItem('finance-helper-username', val)
    })
  }

  return userName
}