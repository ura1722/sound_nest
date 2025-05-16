import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import AuthCallback from "./pages/auth/AuthCallback"
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react"
import GeneralLayout from "./layout/GeneralLayout"
import AlbumPage from "./pages/album/AlbumPage"
import AdminPage from "./pages/admin/AdminPage"
import PlaylistPage from "./pages/playlist/PlaylistPage"

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/admin" element={<AdminPage/>} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signInForceRedirectUrl={"/auth-callback"}  signUpForceRedirectUrl={"/auth-callback"}/>} />
        <Route path="/auth-callback" element={<AuthCallback/>} />

        <Route element={<GeneralLayout/>} >
          <Route path="/" element={<HomePage/>} />
          <Route path="/albums/:id" element={<AlbumPage/>} />
          <Route path="/playlists/:id" element={<PlaylistPage/>} />
          
        </Route>
      </Routes>
    </>
  )
}

export default App
