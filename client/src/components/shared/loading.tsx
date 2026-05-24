import { Loader2 } from 'lucide-react'
const Loading = ({size=20}:{size?:number}) => {
  return (
    <Loader2 className='animate-spin text-primary' size={size}/>
  )
}

export default Loading