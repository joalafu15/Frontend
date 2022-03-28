const storage = localStorage

const setItem = (name, item) => {
  let value = item
  if (typeof item == 'object') {
    value = JSON.stringify(item)
  }
  return storage.setItem(name, value)
}

const getItem = async (name) => {
  const value = await storage.getItem(name)
  try {
    return JSON.parse(value)
  } catch (_error) {
    return value
  }
}

const removeItem = (name) => {
  return storage.removeItem(name)
}

export const Storage = {
  getItem,
  setItem,
  removeItem,
}
