export const getBookImage = (book) => {
  let imgs = book.images;
  if (typeof imgs === 'string') {
    try {
      imgs = JSON.parse(imgs);
    } catch (e) {
      if (imgs.startsWith('/') || imgs.startsWith('http')) {
        return imgs;
      }
      imgs = [];
    }
  }
  return Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '/placeholder-book.png';
};
