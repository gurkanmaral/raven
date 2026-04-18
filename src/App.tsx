import { Navigate, Route, Routes } from 'react-router-dom'

import { SiteLayout } from '@/components/site/site-layout'
import HakkimizdaPage from '@/pages/hakkimizda'
import IletisimPage from '@/pages/iletisim'
import LandingPage from '@/pages/landing'
import UrunDetayPage from '@/pages/urun-detay'
import UrunlerimizPage from '@/pages/urunlerimiz'

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/hakkimizda" element={<HakkimizdaPage />} />
        <Route path="/urunlerimiz/:slug" element={<UrunDetayPage />} />
        <Route path="/urunlerimiz" element={<UrunlerimizPage />} />
        <Route path="/iletisim" element={<IletisimPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
