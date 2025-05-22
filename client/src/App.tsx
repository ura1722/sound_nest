import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import AuthCallback from "./pages/auth/AuthCallback"
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react"
import GeneralLayout from "./layout/GeneralLayout"
import AlbumPage from "./pages/album/AlbumPage"
import AdminPage from "./pages/admin/AdminPage"
import PlaylistPage from "./pages/playlist/PlaylistPage"
import SelectAuthorsPage from "./pages/selectauthors/SelectAuthorsPage"
import { SearchPage } from "./pages/search/SearchPage"
import AuthorPage from "./pages/author/AuthorPage"
import { LikedSongsPage } from "./pages/liked/LikedSongsPage"
import ChatPage from "./pages/chat/ChatPage"

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/admin" element={<AdminPage/>} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signInForceRedirectUrl={"/auth-callback"}  signUpForceRedirectUrl={"/auth-callback"}/>} />
        <Route path="/auth-callback" element={<AuthCallback/>} />
        <Route path="/select-artists" element={<SelectAuthorsPage/>} />

        <Route element={<GeneralLayout/>} >
          <Route path="/" element={<HomePage/>} />
          <Route path="/search" element={<SearchPage/>} />
          <Route path="/liked" element={<LikedSongsPage/>} />
          <Route path="/albums/:id" element={<AlbumPage/>} />
          <Route path="/authors/:id" element={<AuthorPage/>} />
          <Route path="/playlists/:id" element={<PlaylistPage/>} />
          <Route path="/chat" element={<ChatPage/>} />
          
        </Route>
      </Routes>
    </>
  )
}

export default App
