<script lang="ts" setup>
const loadingPhrases: string[] = [
  "Тасуем колоду Таро",
  "Сверяем положение звезд",
  "Составляем натальную карту",
  "Расшифровываем руны",
  "Гадаем на кофейной гуще",
  "Читаем линии судьбы",
  "Настраиваем кристальные сферы",
  "Подключаемся к вселенскому разуму",
  "Расчищаем энергетические каналы",
  "Анализируем кармический долг",
  "Ищем ответы в хрустальном шаре",
  "Синхронизируем чакры",
  "Расшифровываем послание духов",
  "Изучаем лунные фазы",
  "Подготавливаем магический ритуал",
  "Настраиваем астральный компас",
  "Читаем знаки вселенной",
  "Подключаемся к матрице судьбы",
  "Активируем третий глаз",
  "Готовим предсказание будущего",
  "Заряжаем энергией кристаллы",
  "Расставляем карты Ленорман",
  "Слушаем голос интуиции",
  "Открываем портал в будущее",
  "Настраиваем вибрации вселенной",
  "Ищем скрытые знаки судьбы",
  "Подготавливаем магический артефакт",
  "Читаем послание из параллельного мира"
];

const text = ref<string>('')

const showRandomPhrase = (): void =>  {
  const index = Math.floor(Math.random() * loadingPhrases.length)
  if (loadingPhrases[index]) text.value = loadingPhrases[index]
}

onMounted(() => {
  showRandomPhrase()
  const interval = setInterval(showRandomPhrase, 5000)

  onUnmounted(() => clearInterval(interval))
})

</script>

<template>
  <div class="loader">
    <div class="loader-content">
      <span>{{ text }}...</span>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.loader
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  display: flex
  align-items: center
  justify-content: center
  z-index: 999
  background: rgba(255,255,255, .9)
.loader-content
  height: fit-content
  overflow: hidden
  span
    display: block
    animation: translate 5s infinite

@keyframes translate
  0% 
    opacity: 0
    transform: translateY(-100%)
  20%,
  80%
    opacity: 1
    transform: translateY(0%)
  100%
    opacity: 0
    transform: translateY(100%)
</style>