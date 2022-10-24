import Select from '_atoms/Select'
import S from './selector.module.css'

import usePeepsStore from '_stores/peep.store'

import Image from 'next/image'

import useEmblaCarousel from 'embla-carousel-react'

// const options = ['hair', 'eyebrow', 'shirt', 'legs']

function OptionAsset({ url, index, type, handleClick }) {
    const currentItem = usePeepsStore((store) => store[type])

    function onClick() {
        handleClick(index)
    }

    return (
        <div className='embla__slide'>
            <div className={`${S.optionAsset} ${currentItem === index ? S.active : null}`} onClick={onClick}>
                <Image src={url} width={160} height={160} alt={`${type}-${index}`} />
            </div>
        </div>
    )
}

function Hairs() {
    const setHair = usePeepsStore((store) => store.setHair)

    function onClick(index) {
        setHair(index)
    }

    const type = 'hair'
    const images = Array.from(Array(16).keys()).map((e) => e + 1)
    return images.map((image) => (
        <OptionAsset
            key={`${type}-${image}`}
            url={`/${type}/${image}.png`}
            index={image}
            type={type}
            handleClick={onClick}
        />
    ))
}

function Selector() {
    const [viewportRef] = useEmblaCarousel({
        dragFree: true,
        containScroll: 'trimSnaps',
    })

    // const pageSizeOptions = options.map((opt) => ({
    //     value: opt,
    //     label: opt.charAt(0).toUpperCase() + opt.slice(1),
    // }))

    return (
        <div className={S.selector}>
            {/* <Select options={pageSizeOptions} defaultValue={options[0]} /> */}
            <span />
            <div className={`embla ${S.carousel}`} ref={viewportRef}>
                <div className='embla__container'>
                    <Hairs />
                </div>
            </div>
        </div>
    )
}

export default Selector
