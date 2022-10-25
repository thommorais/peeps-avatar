async function stats() {
    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    const { default: Stats } = await import('three/addons/libs/stats.module.js')
    const prevStats = document.querySelector('.stats')

    if (prevStats) {
        document.querySelector('#__next').removeChild(prevStats)
    }

    const stats = new Stats()
    stats.dom.classList.add('stats')

    const container = document.getElementById('__next')
    container.appendChild(stats.dom)

    function animate() {
        stats.update()
        requestAnimationFrame(animate)
    }

    animate()

}

export default stats
