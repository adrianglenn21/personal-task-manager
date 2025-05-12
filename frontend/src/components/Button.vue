<template>
    <button :class="[
        'font-semibold py-3 px-8 rounded-full transition-all duration-300 transform',
        'hover:scale-105',
        variant === 'primary' ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-glow' : '',
        variant === 'secondary' ? 'bg-white text-blue-600 hover:bg-gray-100 hover:shadow-lg' : '',
        animation ? `animate-${animation}` : ''
    ]" @click="$emit('click')">
        <slot></slot>
    </button>
</template>

<script setup>
defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary'].includes(value)
    },
    animation: {
        type: String,
        default: ''
    }
})

defineEmits(['click'])
</script>