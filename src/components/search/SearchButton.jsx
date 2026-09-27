import { Search } from 'lucide-react'

// Lupa del Header: abre el buscador
function SearchButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label="Buscar productos" aria-haspopup="dialog" className="p-2">
      <Search size={22} strokeWidth={1.25} />
    </button>
  )
}

export default SearchButton
