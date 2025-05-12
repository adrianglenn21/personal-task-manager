import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollspy(sections, offset = 100) {
    const activeSection = ref('')

    const checkActiveSection = () => {
        const scrollPosition = window.scrollY

        for (const section of sections) {
            const element = document.querySelector(section)
            if (!element) continue

            const top = element.offsetTop - offset
            const bottom = top + element.offsetHeight

            if (scrollPosition >= top && scrollPosition <= bottom) {
                activeSection.value = section
                break
            }
        }
    }

    // Throttle function to limit the rate at which checkActiveSection runs
    const throttle = (func, limit) => {
        let inThrottle
        return function () {
            const args = arguments
            const context = this
            if (!inThrottle) {
                func.apply(context, args)
                inThrottle = true
                setTimeout(() => inThrottle = false, limit)
            }
        }
    }

    const throttledCheck = throttle(checkActiveSection, 100)

    onMounted(() => {
        window.addEventListener('scroll', throttledCheck)
        // Check initial position
        checkActiveSection()
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', throttledCheck)
    })

    return {
        activeSection
    }
} 