import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

import S from './select.module.css'


export function Option({ value, label }) {
    return (
        <SelectPrimitive.Item key={value} value={String(value)} className={`flex items-center ${S.item}`}>
            <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator className={S.indicator}>
                <CheckIcon />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    )
}


function Select({ options, paceholder, defaultValue, onValueChange, className }) {
    return (
        <SelectPrimitive.Root defaultValue={String(defaultValue)} onValueChange={onValueChange}>
            <SelectPrimitive.Trigger className={`${S.trigger} ${className}`}>
                <SelectPrimitive.Value placeholder={paceholder} />
                <ChevronDownIcon />
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
                <SelectPrimitive.Content className={S.content}>
                    <SelectPrimitive.ScrollUpButton className={S.scrollBtn}>
                        <ChevronUpIcon />
                    </SelectPrimitive.ScrollUpButton>
                    <SelectPrimitive.Viewport className={S.viewport}>
                        {options.map(({ value, label }) => (
                            <Option key={value} value={value} label={label} />
                        ))}
                        <SelectPrimitive.Separator />
                    </SelectPrimitive.Viewport>
                    <SelectPrimitive.ScrollDownButton className={S.scrollBtn}>
                        <ChevronDownIcon />
                    </SelectPrimitive.ScrollDownButton>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    )
}

export default Select