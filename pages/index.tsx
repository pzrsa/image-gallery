import { createClient } from '@supabase/supabase-js'
import NextImage from 'next/image'
import { useState } from 'react'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function getStaticProps() {
  const { data } = await supabaseAdmin.from('images').select('*')
  return {
    props: {
      images: data,
    },
  }
}

type Image = {
  id: number
  href: string
  imageSrc: string
  name: string
  username: string
}

export default async function Gallery({ images }: { images: Image[] }) {
  await supabaseAdmin.from('images').insert([
    {
      name: 'Pedro Duarte',
      href: 'https://twitter.com/peduarte/status/1463897468383412231',
      username: '@peduarte',
      imageSrc: 'https://pbs.twimg.com/media/FFDOtLkWYAsWjTM?format=jpg',
    },
  ])

  const { data } = await supabaseAdmin.from('images').select('*')

  function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  function BlurImage({ image }: { image: Image }) {
    const [isLoading, setLoading] = useState(true)

    return (
      <a href={image.href} className="group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
          <NextImage
            alt=""
            src={image.imageSrc}
            layout="fill"
            objectFit="cover"
            className={cn(
              'duration-700 ease-in-out group-hover:opacity-75',
              isLoading
                ? 'scale-110 blur-2xl grayscale'
                : 'scale-100 blur-0 grayscale-0'
            )}
            onLoadingComplete={() => setLoading(false)}
          />
        </div>
        <h3 className="mt-4 text-sm text-gray-700">{image.name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">
          {image.username}
        </p>
      </a>
    )
  }

  function Image() {
    return (
      <a href="#" className="group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
          <img
            alt=""
            src="https://bit.ly/placeholder-img"
            className="group-hover:opacity-75"
          />
        </div>
        <h3 className="mt-4 text-sm text-gray-700">Lee Robinson</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">@leeerob</p>
      </a>
    )
  }

  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {images.map((image) => (
          <BlurImage key={image.id} image={image} />
        ))}
      </div>
    </div>
  )
}
