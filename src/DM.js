const LOCAL_STORAGE_KEY = 'SOX_ICE_CREAM_HAPPY_HOUR'

export default class DM {
  constructor() {
    this.data = new Set(this.getItemsFromLocalStorage())
  }

  isUserLogged(cardId) {
    return this.data.has(cardId)
  }

  logUser(cardId) {
    if (!this.isUserLogged(cardId)) {
      this.data.add(cardId)
      this.addToLocalStorage(Array.from(this.data))
    }
  }

  getData() {
    return this.data
  }

  emptyData() {
    this.removeFromLocalStorage()
    this.data.clear()
  }

  addToLocalStorage(value) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value))
    console.log(`Added:`, value)
  }

  getItemsFromLocalStorage() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
  }

  removeFromLocalStorage() {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    console.log(`Cleanup local storage`)
  }
}
