export const cleanAndSetQueryParams = (
  keepKeys: string[],
  setParams: { [key: string]: string | null | undefined },
) => {
  const url = new URL(window.location.href)
  url.searchParams.forEach((val, key) => {
    if (!keepKeys.includes(key)) {
      url.searchParams.delete(key)
    }
  })
  Object.keys(setParams).forEach((key) => {
    const val = setParams[key]
    if (val) {
      url.searchParams.set(key, val!)
    }
  })
  url.searchParams.sort()
  window.history.replaceState({}, '', url)
}

export const setQueryParams = (params: { [key: string]: string }) => {
  const url = new URL(window.location.href)
  Object.keys(params).forEach((key) => {
    const val = params[key]
    if (val) {
      url.searchParams.set(key, val!)
    }
  })
  url.searchParams.sort()
  window.history.replaceState({}, '', url)
}
