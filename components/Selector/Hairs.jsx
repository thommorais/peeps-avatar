
import usePeepsStore from '_stores/peep.store'
import AssetsCarousel from './AssetsCarousel'

function Hairs() {
    const setHair = usePeepsStore((store) => store.setHair)

    function onClick(index) {
        setHair(index)
    }

    return <AssetsCarousel type={'hair'} imagesCount={16} handleClick={onClick} />
}


export default Hairs
