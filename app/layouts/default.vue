<script lang="ts" setup></script>

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