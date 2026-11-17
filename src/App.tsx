import { BrowserRouter, Route, Routes } from 'react-router'
import AppLayout from '@/components/layout/AppLayout'
import HomePage from '@/pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}