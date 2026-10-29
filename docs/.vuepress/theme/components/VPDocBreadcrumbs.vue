<script setup lang="ts">
import VPLink from '@theme/VPLink.vue'
import { computed } from 'vue'
import { usePageData } from 'vuepress/client'
import type { SiteBreadcrumb } from '../../config/page-structure'

const page = usePageData()
const breadcrumbs = computed(() => (
  (page.value as typeof page.value & { siteBreadcrumbs?: SiteBreadcrumb[] }).siteBreadcrumbs || []
))
</script>

<template>
  <nav v-if="breadcrumbs.length" class="vp-breadcrumb" aria-label="当前位置">
    <ol>
      <li v-for="(item, index) in breadcrumbs" :key="item.link">
        <span v-if="index" class="separator" aria-hidden="true">›</span>
        <span v-if="item.current" class="current" aria-current="page">{{ item.text }}</span>
        <VPLink v-else :href="item.link" :text="item.text" />
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.vp-breadcrumb {
  margin-bottom: 2rem;
  padding-left: 8px;
  border-left: 2px solid var(--vp-c-brand-1);
  font-size: 14px;
  line-height: 1.6;
}
.vp-breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.vp-breadcrumb li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  overflow-wrap: anywhere;
}
.vp-breadcrumb a { color: var(--vp-c-brand-2); }
.current, .separator { color: var(--vp-c-text-2); }
@media print { .vp-breadcrumb { display: none; } }
</style>
