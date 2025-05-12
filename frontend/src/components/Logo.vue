<template>
    <div class="logo-container" :class="size">
        <svg viewBox="0 0 100 100" :width="width" :height="height" xmlns="http://www.w3.org/2000/svg">
            <!-- Circuit Board Base -->
            <rect x="10" y="10" width="80" height="80" rx="10" fill="none" :stroke="color" stroke-width="4" class="logo-circuit" />

            <!-- IoT Connection Lines -->
            <path :stroke="color" stroke-width="4" fill="none" d="M30 50 L70 50 M50 30 L50 70" class="logo-lines" />

            <!-- Connection Nodes -->
            <circle cx="30" cy="50" r="6" :fill="color" class="logo-node" />
            <circle cx="70" cy="50" r="6" :fill="color" class="logo-node" />
            <circle cx="50" cy="30" r="6" :fill="color" class="logo-node" />
            <circle cx="50" cy="70" r="6" :fill="color" class="logo-node" />
            <circle cx="50" cy="50" r="8" :fill="color" class="logo-center-node" />
        </svg>
    </div>
</template>

<script setup>
defineProps({
    color: {
        type: String,
        default: '#f97316' // orange-500
    },
    size: {
        type: String,
        default: 'normal'
    },
    width: {
        type: [Number, String],
        default: 40
    },
    height: {
        type: [Number, String],
        default: 40
    }
})
</script>

<style scoped>
.logo-container {
    display: inline-flex;
    align-items: center;
}

.logo-container.small svg {
    width: 24px;
    height: 24px;
}

.logo-container.large svg {
    width: 48px;
    height: 48px;
}

/* Animations */
.logo-circuit {
    animation: pulse 3s infinite;
}

.logo-lines {
    animation: draw 3s infinite;
}

.logo-node {
    animation: glow 3s infinite;
}

.logo-center-node {
    animation: centerPulse 3s infinite;
}

@keyframes pulse {

    0%,
    100% {
        stroke-opacity: 0.8;
    }

    50% {
        stroke-opacity: 1;
    }
}

@keyframes draw {
    0% {
        stroke-dasharray: 200;
        stroke-dashoffset: 200;
    }

    50% {
        stroke-dasharray: 200;
        stroke-dashoffset: 0;
    }

    100% {
        stroke-dasharray: 200;
        stroke-dashoffset: -200;
    }
}

@keyframes glow {

    0%,
    100% {
        opacity: 0.8;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.2);
    }
}

@keyframes centerPulse {

    0%,
    100% {
        opacity: 0.8;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.3);
    }
}
</style>