<template>
    <div :class="[
        'rounded-lg transform transition-all duration-500',
        'hover:scale-105 group',
        variant === 'feature' ? 'bg-gray-700/50 hover:bg-gray-700 p-6' : 'bg-gray-700/30 hover:bg-gray-700/50 p-6'
    ]">
        <slot></slot>
    </div>
</template>

<script setup>
defineProps({
    variant: {
        type: String,
        default: 'feature',
        validator: (value) => ['feature', 'benefit'].includes(value)
    }
})
</script>