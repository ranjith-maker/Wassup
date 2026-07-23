import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/appStore.js'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'

export const BASEURL = 'https://api.wassupchat.online'


createRoot(document.getElementById('root')).render(

<Provider store={store}>
<BrowserRouter>    
    <App />
</BrowserRouter>
</Provider>

)


