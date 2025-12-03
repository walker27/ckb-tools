export const hexToBase64 = (hexstring: string) => {
  const str = hexstring
    .match(/\w{2}/g)
    ?.map((a) => {
      return String.fromCharCode(parseInt(a, 16));
    })
    .join("");
  if (!str) return "";
  return btoa(str);
};
