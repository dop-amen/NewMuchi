'use client'
import { usePathname } from 'next/navigation'
import { FaFacebookMessenger } from 'react-icons/fa'

export default function MessengerFloat() {
  const pathname = usePathname() ?? ''
  if (pathname.startsWith('/admin')) return null

  return (
    
    <a  href="https://www.messenger.com/t/61577390296585"
      target="_blank"
      rel="noopener noreferrer"
     style={{ position: 'fixed', bottom: '80px', right: '16px' }}>
      <FaFacebookMessenger className="w-9 h-9 "  style={{ color: '#0084FF' }} size={24} />
    </a>
  )
}