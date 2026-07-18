import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ProgramPage } from './pages/ProgramPage'
import { MethodPage } from './pages/MethodPage'
import { HangulDemoPage } from './pages/HangulDemoPage'
import { HanjaDemoPage } from './pages/HanjaDemoPage'
import { WaitlistPage } from './pages/WaitlistPage'
import { BoardPage } from './pages/BoardPage'
import { ShopPage } from './pages/ShopPage'
import { NewsPage } from './pages/NewsPage'
import { TypingGamePage } from './pages/TypingGamePage'
import { RankPage } from './pages/RankPage'
import { CurriculumPage } from './pages/CurriculumPage'
import { DemoHubPage } from './pages/DemoHubPage'
import { PlayHubPage } from './pages/PlayHubPage'
import { AdminPage } from './pages/AdminPage'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="program" element={<ProgramPage />} />
          <Route path="method" element={<MethodPage />} />
          <Route path="curriculum" element={<CurriculumPage />} />
          <Route path="demo-hub" element={<DemoHubPage />} />
          <Route path="play-hub" element={<PlayHubPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="lesson/hangul-demo" element={<HangulDemoPage />} />
          <Route path="lesson/hanja-demo" element={<HanjaDemoPage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="typing-game" element={<TypingGamePage />} />
          <Route path="ranking" element={<RankPage />} />
          <Route path="waitlist" element={<WaitlistPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
