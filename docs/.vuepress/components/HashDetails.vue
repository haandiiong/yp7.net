<script setup>
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vuepress/client'
import { useScrollPromise } from 'vuepress-theme-plume/composables'

const route = useRoute()
let pending = 0

const revealHash = async () => {
  const ticket = ++pending
  await nextTick()
  await useScrollPromise().wait()
  await nextTick()
  if (ticket !== pending || !window.location.hash) return
  let id
  try { id = decodeURIComponent(window.location.hash.slice(1)) }
  catch { return }
  const target = document.getElementById(id)
  if (!target) return
  let opened = false
  for (let parent = target.parentElement; parent; parent = parent.parentElement) {
    if (parent instanceof HTMLDetailsElement && !parent.open) {
      parent.open = true
      opened = true
    }
  }
  // Match Plume's 64px anchor offset, only when unfolding changed layout.
  if (opened) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 64, behavior: 'instant' })
}

const onClick = (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null
  if (!link || link.target === '_blank') return
  const url = new URL(link.href, window.location.href)
  if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash) {
    requestAnimationFrame(revealHash)
  }
}

onMounted(() => {
  revealHash()
  window.addEventListener('hashchange', revealHash)
  document.addEventListener('click', onClick, true)
})
watch(() => route.fullPath, revealHash, { flush: 'post' })
onBeforeUnmount(() => {
  pending++
  window.removeEventListener('hashchange', revealHash)
  document.removeEventListener('click', onClick, true)
})
</script>

<template><span aria-hidden="true" hidden /></template>
