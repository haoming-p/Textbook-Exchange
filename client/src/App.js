import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Main from './pages/Main';

function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <div className="App">
          <Header />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main />} />
            </Routes>
          </BrowserRouter>
        </div>
    </GoogleOAuthProvider>
      
    </div>
  );
}

export default App;
