<script setup lang="ts">
import MarkdownIt from 'markdown-it'

interface IInterpretationProps {
  content: string
}
const props = defineProps<IInterpretationProps>()

const md = new MarkdownIt()
const html = md.render(props.content)
</script>

<template>
    <div v-html="html" class="interpretation"></div>
</template>

<style lang="sass">
.interpretation
    hr
        height: 12px ip !important
        color: transparent
    p,
    ul,
    ol
        margin-bottom: 12px
    h3, h4 
        margin-bottom: 15px
</style>
