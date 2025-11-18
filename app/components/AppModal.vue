<script setup lang="ts">
const emit = defineEmits(['close'])
const handleBackdropClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
        emit('close')
    }
}
</script>
<template>
    <Transition name="modal">
        <div class="modal-backdrop fixed inset-0 flex items-center justify-center z-50" @click="handleBackdropClick">
            <div class="overlay"></div>
            <div
                class="modal-window relative bg-[#c07d7e96] rounded-lg p-6 pt-12 max-w-md w-full mx-4 transition-[scale] z-[1]">
                <button class="absolute top-3 right-5 text-2xl ml-auto cursor-pointer" @click="$emit('close')">
                    &times;
                </button>

                <div class="overflow-x-auto max-h-[80vh]">
                    <div class="">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style lang="sass" scoped>
.overlay
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: #433a40f0
.modal-enter-active,
.modal-leave-active
  transition: opacity .2s

.modal-enter-from,
.modal-leave-to
  opacity: 0
</style>