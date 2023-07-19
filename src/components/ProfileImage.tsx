import Image from "next/image"

type ProfileImageProps = {
    src?: string | null
    className?: string
}

export default function ProfileImage({src, className=""}: ProfileImageProps) {
  return (
    <div className={`relative w-12 h-12 overflow-hidden rounded-full mt-4 ${className}`}>
        {src == null ? null : <Image src={src} alt="Profile Image" quality={100} fill />}
    </div>
  )
}
