import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import JsonViewer from './tools/JsonViewer'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/json-viewer" element={<JsonViewer />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App