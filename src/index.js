// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Optional: normalizes CSS
import App from './App';
import { myStore } from './Redux/ReduxStore';
import { theme } from './styles';

import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById('root'));

// 2️⃣ PROVIDE the theme (pass the object)
root.render(
    <Provider store={myStore}>
        <ThemeProvider theme={theme}>
            <CssBaseline> {/* Optional: normalizes CSS */}
                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                    <App />
                </GoogleOAuthProvider>
            </CssBaseline>
        </ThemeProvider>
    </Provider>
);



// client id : 748340975971-3aa9rrt96vanvh589tedq88ecmsqo2fn.apps.googleusercontent.com
// client secret : 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