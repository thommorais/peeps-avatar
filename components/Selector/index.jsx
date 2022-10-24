import Select from '_atoms/Select'
import S from './selector.module.css'

import usePeepsStore from '_stores/peep.store'
import Hairs from './Hairs'


function Selector() {

    const setBodyPart = usePeepsStore((store) => store.setBodyPart)
    const bodyPart = usePeepsStore((store) => store.bodyPart)
    const bodyParts = usePeepsStore((store) => store.bodyParts)

    const pageSizeOptions = bodyParts.map((opt) => ({
        value: opt,
        label: opt.charAt(0).toUpperCase() + opt.slice(1),
    }))

    function onValueChange(value) {
        setBodyPart(value)
    }

    return (
        <div className={S.selector}>
            <Select onValueChange={onValueChange} options={pageSizeOptions} defaultValue={bodyParts[0]} />
            {bodyPart === 'hair' ? <Hairs /> : null}
        </div>
    )
}

export default Selector
