<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePageData } from 'vuepress/client'

interface AirportBrand {
  name: string
  path: string
}

const page = usePageData()
const query = ref('')
const airports = computed(() => (
  (page.value as typeof page.value & { airportBrandIndex?: AirportBrand[] }).airportBrandIndex || []
))
const matches = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase()
  return keyword
    ? airports.value.filter((airport) => airport.name.toLocaleLowerCase().includes(keyword))
    : airports.value
})
</script>

<template>
  <div class="airport-brand-index">
    <p>按名称查找并进入独立资料页，名称顺序不代表推荐排名。</p>
    <label for="airport-brand-search">机场名称</label>
    <input
      id="airport-brand-search"
      v-model="query"
      type="search"
      placeholder="例如：Flybit、九云"
      autocomplete="off"
    >
    <p class="brand-count" role="status" aria-live="polite">显示 {{ matches.length }} / {{ airports.length }} 家</p>
    <ul v-if="matches.length" class="brand-list">
      <li v-for="airport in matches" :key="airport.path">
        <a :href="airport.path">{{ airport.name }}</a>
      </li>
    </ul>
    <p v-else>没有匹配的名称，可清空输入后查看全部资料。</p>
  </div>
</template>

<style scoped>
.airport-brand-index label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}
.airport-brand-index input {
  width: 100%;
  max-width: 28rem;
  padding: 9px 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font: inherit;
}
.airport-brand-index input:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.brand-count {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}
.brand-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px 16px;
  padding: 0;
  list-style: none;
}
.brand-list li {
  margin: 0;
  overflow-wrap: anywhere;
}
</style>
