export interface CardProps {
    suit?: string
    face?: string
    disabled?: boolean
    onClick?: CardCallback
    onMouseOver?: CardCallback
}
export interface CardWrapperProps extends CardProps {
    children?: any
    className?: string
    onClick?: (event:any) => void
    onMouseOver?: (event:any) => void
}
export type CardCallback = (event?:any, card?:{suit:string, face:string}) => void;
