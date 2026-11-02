<script setup>
import VPBlog from '@theme/Blog/VPBlog.vue'
import VPLink from '@theme/VPLink.vue'
</script>

<template>
  <main class="home-blog" aria-labelledby="home-blog-title">
    <header class="blog-intro">
      <p class="site-label">yp7.net 博客</p>
      <h1 id="home-blog-title">机场推荐与科学上网教程</h1>
      <p class="intro-description">整理机场套餐、节点记录与购买限制，分享客户端安装和连接排错教程。</p>
      <nav class="quick-links" aria-label="首页快捷入口">
        <VPLink href="/posts/jichang/">机场推荐 <span aria-hidden="true">→</span></VPLink>
        <VPLink href="/posts/jichang/#机场价格总表">机场价格总表</VPLink>
        <VPLink href="/posts/airport-tools/">客户端下载</VPLink>
        <VPLink href="/guides/">使用教程</VPLink>
      </nav>
    </header>
    <VPBlog home-blog>
      <template #blog-post-list-before>
        <h2 class="posts-heading">文章列表</h2>
      </template>
    </VPBlog>
  </main>
</template>

<style scoped>
.home-blog {
  background: var(--vp-c-bg-alt);
}

.blog-intro {
  max-width: 1136px;
  padding: 36px 16px 0;
  margin: 0 auto;
}

.home-blog :deep(.blog-container) {
  max-width: 1104px;
}

.home-blog :deep(.excerpt) {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.site-label {
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: clamp(26px, 3.5vw, 36px);
  font-weight: 700;
  line-height: 1.4;
}

.intro-description {
  margin: 12px 0 20px;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.8;
}

.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-links a {
  padding: 8px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}

.quick-links a:first-child {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.quick-links a:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.quick-links a:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.posts-heading {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

@media (max-width: 767px) {
  .blog-intro {
    padding: 28px 16px 0;
  }
}
</style>
