<script lang="ts" setup>
useSeoMeta({
  title: 'Таро Гадание Онлайн 🎴 | Расклады на любовь, работу и будущее',
  description: 'Точные онлайн расклады на картах Таро. Получите ответ на свой вопрос. Гадание на любовь, отношения, карьеру и будущее. Профессиональные толкования.',
  ogTitle: 'Таро Гадание Онлайн - Получите Ответ Судьбы',
  ogDescription: 'Онлайн расклады на картах Таро. Узнайте что ждет вас в будущем.',
  ogImage: '/images/tarot-og-image.jpg',
  twitterCard: 'summary_large_image',
})
</script>

<template>
    <div class="container flex flex-col min-h-screen">
      <UiAppHeader />
      <main class="">
        <slot />
      </main>
      <UiAppFooter />      
    </div>
</template>

<style lang="sass">
main 
  flex: 1 1 auto
</style>