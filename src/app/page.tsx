import RouteCheckSide from '@/components/RouteCheckSide'
import Image from 'next/image'
import Link from 'next/link'
import { HiArrowTopRightOnSquare } from 'react-icons/hi2'

export default function Home() {
  return (
    <aside className='relative bg-base-50 rounded-b-3xl sm:rounded-bl-none sm:rounded-r-3xl sm:w-1/3 min-w-[320px] sm:h-screen w-screen shadow-md flex flex-col'>
      <span className='flex flex-row justify-center items-center p-4 gap-2'>
        <div className='relative w-12 h-12 sm:w-24 sm:h-24'><Image src={"/images/icon.png"} fill={true} alt='icon'/></div>
        <h1>Map Demo</h1>
      </span>
      <RouteCheckSide />
      <div className='grow'></div>
      <div className='flex flex-row justify-end p-2'><Link href="https://tommyis.me" target="_blank">tommyis.me<HiArrowTopRightOnSquare className="w-icon h-icon inline-block"/></Link></div>
    </aside>
  )
}
