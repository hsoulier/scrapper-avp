export const uniqueArray = (a) =>
  a.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  )
