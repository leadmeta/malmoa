import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ProgramPage } from './pages/ProgramPage'
import { MethodPage } from './pages/MethodPage'
import { HangulDemoPage } from './pages/HangulDemoPage'
import { HanjaDemoPage } from './pages/HanjaDemoPage'
import { WaitlistPage } from './pages/WaitlistPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="program" element={<ProgramPage />} />
          <Route path="method" element={<MethodPage />} />
          <Route path="lesson/hangul-demo" element={<HangulDemoPage />} />
          <Route path="lesson/hanja-demo" element={<HanjaDemoPage />} />
          <Route path="waitlist" element={<WaitlistPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
