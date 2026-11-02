<script setup lang="ts">
import type { ThemeBlogPostItem } from 'vuepress-theme-plume/shared'
import { computed } from 'vue'
import OriginalPostItem from 'vuepress-theme-plume/components/Blog/VPPostItem.vue'

declare const __YP7_RECOMMENDATION_UPDATED__: string

const props = defineProps<{ post: ThemeBlogPostItem, index: number }>()
const displayPost = computed(() => props.post.path === '/posts/jichang/' && __YP7_RECOMMENDATION_UPDATED__
  ? { ...props.post, createTime: __YP7_RECOMMENDATION_UPDATED__ }
  : props.post)
</script>

<template>
  <OriginalPostItem :post="displayPost" :index="index" />
</template>
