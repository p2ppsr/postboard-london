import React from 'react'
import ReactDOM from 'react-dom'
// import Prompt from '@babbage/react-prompt'
import App from './App'

/**
 * Render the app wrapped in a Babbage React Prompt
 */
ReactDOM.render(
  // <Prompt
  //   customPrompt
  //   supportedMetaNet='mainnet'
  //   appName='Postboard'
  //   appIcon='/favicon.ico'
  //   author='Peer-to-peer Privacy Systems Research, LLC'
  //   authorUrl='https://projectbabbage.com'
  //   description='Share your thoughts and earn!'
  // >
    <App />
  // </Prompt>
  ,
  document.getElementById('root')
)
