import { useEffect, useRef } from 'react'

import scene from './scene'

function Scene() {
    const webgl = useRef(null)

    useEffect(() => {
        let clear = null

        async function mount() {
            clear = await scene(webgl.current)
        }

        const mout = requestIdleCallback(mount)

        return () => {
            cancelIdleCallback(mout)
            clear?.()
        }
    }, [])

    return <canvas ref={webgl} className='webgl' />
}

export default Scene
