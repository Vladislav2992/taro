<template>
  <div class="py-4 mt-25">
    <ul class="flex items-center justify-center gap-2.5 mb-3">
        <li class="footer-link">
            <NuxtLink to="/privacy-policy"> Политика <br>конфиденциальности </NuxtLink>
        </li>
        <li class="footer-link">
            <NuxtLink to="/oferta"> Оферта </NuxtLink>
        </li>
        <li class="footer-link">
            <NuxtLink to="/agreement"> Согласие <br>на&nbsp;обработку&nbsp;ПД </NuxtLink>
        </li>
    </ul>
    <div class="flex flex-col items-center text-xs">
        <span>Сидоров Владислав Владимирович (Самозанятый)</span>
        <span>ИНН 165051535815</span>
        <a href="mailto:schu1ts@yandex.ru">schu1ts@yandex.ru</a>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.footer-link 
    text-decoration: none
    border-right: 1px solid #FFFFFF
    padding-right: 10px
    font-size: 12px
    text-align: center
    height: -webkit-fill-available
    display: flex
    align-items: center
    justify-content: center
    &:last-child
        border-right: none
    &:hover
        text-decoration: underline
</style>
