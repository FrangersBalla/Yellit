import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-7xl font-black text-amber-300 mb-4">404</h1>
        <p className="text-xl mb-8">Oops! This page doesn’t exist. Go back and yellit!</p>
        <button
          onClick={() => navigate('/')}
          className="px-3 py-2 bg-amber-300 text-black rounded-full font-medium transition"
        >
          Home
        </button>
      </div>
    </div>
  )
}