import Image, { ImageProps }from 'next/image'

export default function Logo(props: ImageProps) {
    return (
        <Image {...props}/>
    );
}