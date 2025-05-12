<script setup>
import Card from './components/Card.vue'
import Section from './components/Section.vue'
import Button from './components/Button.vue'
import FeatureIcon from './components/FeatureIcon.vue'
import Logo from './components/Logo.vue'
import { ref, onMounted } from 'vue'
import { useScrollspy } from './composables/useScrollspy'
import TaskManager from './components/TaskManager.vue'
</script>

<template>
  <TaskManager />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.glass-effect-darker {
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(12px);
}

/* Add solid background for mobile navbar */
@media (max-width: 768px) {
  .glass-effect-darker.mobile-solid {
    background: rgb(17, 24, 39);
    backdrop-filter: none;
  }
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(251, 146, 60, 0.2);
}

/* Add smooth transition for menu icon */
.fas {
  transition: transform 0.3s ease;
}

.fa-times {
  transform: rotate(180deg);
}

/* Particle Grid Animation */
.particles-grid {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, rgba(251, 146, 60, 0.1) 1px, transparent 1px),
    radial-gradient(circle, rgba(251, 146, 60, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
  animation: particleShift 20s linear infinite;
  opacity: 0.5;
}

@keyframes particleShift {
  0% {
    transform: translateY(0) rotate(0deg);
  }

  100% {
    transform: translateY(-40px) rotate(1deg);
  }
}

/* Floating Animation Variations */
@keyframes float-reverse {

  0%,
  100% {
    transform: translate(50%, 0);
  }

  50% {
    transform: translate(50%, -20px);
  }
}

.animate-float-reverse {
  animation: float-reverse 8s ease-in-out infinite;
}

/* Particle Clusters */
.particle-cluster-1,
.particle-cluster-2,
.particle-cluster-3 {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, transparent 70%);
  border-radius: 50%;
}

.particle-cluster-1 {
  top: 20%;
  left: 30%;
  animation: clusterFloat 10s ease-in-out infinite;
}

.particle-cluster-2 {
  top: 60%;
  right: 20%;
  animation: clusterFloat 12s ease-in-out infinite reverse;
}

.particle-cluster-3 {
  bottom: 30%;
  left: 50%;
  animation: clusterFloat 9s ease-in-out infinite;
}

@keyframes clusterFloat {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }

  50% {
    transform: translate(20px, -20px) scale(1.2);
    opacity: 0.8;
  }
}

/* Tech Lines */
.tech-lines {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(0deg, transparent 24%, rgba(251, 146, 60, 0.05) 25%, rgba(251, 146, 60, 0.05) 26%, transparent 27%, transparent 74%, rgba(251, 146, 60, 0.05) 75%, rgba(251, 146, 60, 0.05) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(251, 146, 60, 0.05) 25%, rgba(251, 146, 60, 0.05) 26%, transparent 27%, transparent 74%, rgba(251, 146, 60, 0.05) 75%, rgba(251, 146, 60, 0.05) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  animation: lineShift 20s linear infinite;
}

@keyframes lineShift {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  100% {
    transform: translate(-50px, -50px) rotate(1deg);
  }
}

/* Glowing Dots */
.glow-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(251, 146, 60, 0.5);
  border-radius: 50%;
  filter: blur(3px);
  animation: glowPulse 4s ease-in-out infinite;
}

@keyframes glowPulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.5);
    opacity: 0.8;
  }
}

/* Enhance existing animations */
.animate-float-complex {
  animation: floatComplex 15s ease-in-out infinite;
}

@keyframes floatComplex {

  0%,
  100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  25% {
    transform: translate(-45%, -55%) rotate(1deg);
  }

  50% {
    transform: translate(-50%, -45%) rotate(0deg);
  }

  75% {
    transform: translate(-55%, -50%) rotate(-1deg);
  }
}

.animate-pulse-slow {
  animation: pulseSlow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulseSlow {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}
</style>
