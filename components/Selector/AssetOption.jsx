import S from './selector.module.css'
import Image from 'next/image'
import usePeepsStore from '_stores/peep.store'

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

export default OptionAsset