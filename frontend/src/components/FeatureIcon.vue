<template>
    <div class="text-blue-400 text-4xl mb-4 flex justify-center group-hover:animate-bounce">
        <i :class="icon"></i>
    </div>
</template>

<script setup>
defineProps({
    icon: {
        type: String,
        required: true
    }
})</script>