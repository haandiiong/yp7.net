export default {
  mounted() {
    const fixAlt = () => {
      document.querySelectorAll('img').forEach(img => {
        if (!img.getAttribute('alt')) {
          img.setAttribute('alt', 'yp7机场推荐图片')
        }
      })
    }

    fixAlt()
    // SPA页面切换时也执行
    window.addEventListener('popstate', fixAlt)
  }
}