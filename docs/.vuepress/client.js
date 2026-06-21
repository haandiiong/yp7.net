export default {
  mounted() {
    const getImageAlt = (img) => {
      const src = img.getAttribute('src') || ''
      const filename = src.split('/').pop()?.split(/[?#]/)[0]?.replace(/\.[^.]+$/, '')

      return filename ? `yp7 ${filename} 图片` : 'yp7机场推荐图片'
    }
    const fixAlt = () => {
      document.querySelectorAll('img').forEach(img => {
        if (!img.getAttribute('alt')) {
          img.setAttribute('alt', getImageAlt(img))
        }
      })
    }

    fixAlt()
    const observer = new MutationObserver(fixAlt)
    observer.observe(document.body, { childList: true, subtree: true })
  }
}
