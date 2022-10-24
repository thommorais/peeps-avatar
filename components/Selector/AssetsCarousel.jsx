import S from './selector.module.css'

import useEmblaCarousel from 'embla-carousel-react'
import AssetOption from './AssetOption'

function AssetsCarousel({ type, imagesCount, handleClick }) {

    const [viewportRef] = useEmblaCarousel({
        dragFree: true,
        containScroll: 'trimSnaps',
    })

    function onClick(index) {
        handleClick(index)
    }

    const images = Array.from(Array(imagesCount).keys()).map((e) => e + 1)

    return <div className={`embla ${S.carousel}`} ref={viewportRef}>
        <div className='embla__container'>
            {
                images.map((image) => (
                    <AssetOption
                        key={`${type}-${image}`}
                        url={`/${type}/${image}.png`}
                        index={image}
                        type={type}
                        handleClick={onClick}
                    />))
            }
        </div>
    </div>
}


export default AssetsCarousel
