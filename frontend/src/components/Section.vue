<template>
    <section :class="[
        'py-16 md:py-24 w-full',
        variant === 'cta' ? 'bg-gradient-to-r from-blue-600/10 via-blue-500/10 to-blue-600/10 bg-animate' : '',
        className
    ]">
        <div :class="[
            containerClass ? containerClass : 'container mx-auto px-6',
            'w-full'
        ]">
            <h2 v-if="title" class="text-3xl md:text-4xl font-bold text-center mb-12 animate-fadeIn">
                {{ title }}
            </h2>
            <slot></slot>
        </div>
    </section>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: ''
    },
    variant: {
        type: String,
        default: 'default',
        validator: (value) => ['default', 'primary', 'cta'].includes(value)
    },
    className: {
        type: String,
        default: ''
    },
    containerClass: {
        type: String,
        default: ''
    }
})</script>