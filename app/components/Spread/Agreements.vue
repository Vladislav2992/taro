<script setup lang="ts">

interface IAgreementsProps {
  disasbled?: boolean
  error?: boolean
}

const props = defineProps<IAgreementsProps>()

const isPolicyOpen = ref<boolean>(false)
const isAgreementOpen = ref<boolean>(false)
const isOfertaOpen = ref<boolean>(false)

const isPolicyChecked = ref<boolean>(true)
const isAgreementChecked = ref<boolean>(true)
const isOfertaChecked = ref<boolean>(true)

const isDisabled = computed(() => {
  return props.disasbled || !isPolicyChecked.value || !isAgreementChecked.value || !isOfertaChecked.value
})

const isModalOpen = computed(
  () => isPolicyOpen.value || isAgreementOpen.value || isOfertaOpen.value
)
const closePolicyModal = () => {
  isPolicyOpen.value = false
  isAgreementOpen.value = false
  isOfertaOpen.value = false
}

const emit = defineEmits(['paySpread'])

const goToPayment = () => {
  if (
    !isPolicyChecked.value ||
    !isAgreementChecked.value ||
    !isOfertaChecked.value
  )
    return

  emit('paySpread')
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="text-center">
      Вы&nbsp;можете ознакомиться со&nbsp;значением карты, нажав на&nbsp;неё<br />
      или получить развернутое трактование от ИИ<br />
      После успешной оплаты нажмите "Вернуться на сайт"<br />
      и Вы получите детальный разбор
    </div>
    <button
      @click="goToPayment"
      class="py-2 px-4 border rounded-2xl w-fit mx-auto transition-opacity cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      :disabled="isDisabled"
    >
      Узнать подробнее за 99 ₽
    </button>
    <div v-if="error" class="text-red-500 text-center">Что-то случилось, попробуйте ещё раз</div>
    <div class="checkbox-wrapper">
      <input
        type="checkbox"
        name=""
        id="agreement"
        v-model="isAgreementChecked"
      />
      <label for="agreement">я даю согласие на </label>
      <span
        class="underline hover:no-underline cursor-pointer"
        @click="isAgreementOpen = true"
      >
        обработку персональных данных</span
      >
    </div>
    <div class="checkbox-wrapper">
      <input
        type="checkbox"
        name=""
        id="privat-policy"
        v-model="isPolicyChecked"
      />
      <label for="privat-policy">я ознакомлен с </label>
      <span
        class="underline hover:no-underline cursor-pointer"
        @click="isPolicyOpen = true"
      >
        политикой конфиденциальности</span
      >
    </div>
    <div class="checkbox-wrapper">
      <input type="checkbox" name="" id="oferta" v-model="isOfertaChecked" />
      <label for="oferta">я ознакомлен с </label>
      <span
        class="underline hover:no-underline cursor-pointer"
        @click="isOfertaOpen = true"
      >
        публичной офертой</span
      >
    </div>
  </div>

  <Transition name="modal">
    <AppModal v-if="isModalOpen" @close="closePolicyModal">
      <DocumentsPolicy v-if="isPolicyOpen" />
      <DocumentsAgreement v-else-if="isAgreementOpen" />
      <DocumentsOferta v-else-if="isOfertaOpen" />
    </AppModal>
  </Transition>
</template>

<style lang="sass" scoped>
.checkbox-wrapper
    margin-bottom: 0px
    input[type="checkbox"]
        display: none
        &:checked + label::after
            transform: scale(1)
    label
        position: relative
        padding-left: 30px
        &::before
            content: ''
            position: absolute
            left: 0
            top: 3px
            width: 20px
            height: 20px
            border: 1px solid $primary
            border-radius: 8%
        &::after
            content: ''
            background: url('/checked.svg') no-repeat center
            width: 20px
            height: 24px
            color: inherit
            position: absolute
            top: -5px
            left: 3px
            transform: scale(0)
            transition: transform .1s
</style>
