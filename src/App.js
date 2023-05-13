/**
 * src/App.js
 * 
 * This file contains the primary business logic and UI code for the Postboard 
 * application.
 */
import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  AppBar, Toolbar, List, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, TextField,
  Button, Fab, LinearProgress, Typography, IconButton, Card, CardContent, CardActions
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import GitHubIcon from '@mui/icons-material/GitHub'
import { makeStyles } from '@mui/styles'
import { createAction, getPublicKey } from '@babbage/sdk'
import { getPaymentAddress } from 'sendover'
import { Authrite } from 'authrite-js'
import PacketPay from '@packetpay/js'
import pushdrop from 'pushdrop'
import PaymentTokenator from 'payment-tokenator'

// These are some basic styling rules for the React application.
// This app uses React (https://reactjs.org) for its user interface.
// We are also using MUI (https://mui.com) for buttons and dialogs.
// This stylesheet uses a language called JSS.
import styles from './style'

const confederacyHost = 'https://confederacy.babbage.systems'
const peerServHost = 'https://peerserv.babbage.systems'

// This is the namespace prefix for the Postboard protocol
const POSTBOARD_PREFIX = 'postboard'

// Instantiate a payment tokenator for sending payments
const tokenator = new PaymentTokenator({
  peerServHost
})

const App = () => {
  // These are some state variables that control the app's interface.
  const [createOpen, setCreateOpen] = useState(false)
  const [postText, setPostText] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [postsLoading, setPostsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [tippingOpen, setTippingOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState({})
  const [tipAmount, setTipAmount] = useState(3301)
  const [tipLoading, setTipLoading] = useState(false)
  const classes = makeStyles(styles)

  // Creates a new Postboard token.
  // This function will run when the user clicks "OK" in the creation dialog.
  const handleCreateSubmit = async e => {
    e.preventDefault() // Stop the HTML form from reloading the page.
    try {
      // Here, we handle some basic mistakes the user might have made.
      if (!postText) {
        toast.error('Enter text to post!')
        return
      }
      // Now, we start a loading bar while the post is being sent.
      setCreateLoading(true)
    
      // Get the author's identity key
      const identityKey = await getPublicKey({ identityKey: true })

      // Here's the part where we create the new Bitcoin token.
      // This uses a library called PushDrop, which lets you attach data 
      // payloads to Bitcoin token outputs. Then, you can redeem / unlock the 
      // tokens later.
      const bitcoinOutputScript = await pushdrop.create({
        fields: [ // The "fields" are the data payload to attach to the token.
          // For more info on these fields, look at the Postboard protocol document 
          // (PROTOCOL.md). Note that the PushDrop library handles the public 
          // key, signature, and OP_DROP fields automatically.
          Buffer.from(POSTBOARD_PREFIX), // Postboard protocol namespace prefix
          Buffer.from(identityKey, 'hex'),
          Buffer.from(postText)    // Postboard post content
        ],
        // The same "postboard" protocol and key ID can be used to sign and 
        // lock this new Bitcoin PushDrop token.
        protocolID: 'postboard',
        keyID: '1',
        counterparty: 'anyone',
        ownedByCreator: true
      })

      // Now that we have the output script for our Postboard Bitcoin token, we can 
      // add it to a Bitcoin transaction (a.k.a. "Action"), and register the 
      // new token with the blockchain. On the MetaNet, Actions are anything 
      // that a user does, and all Actions take the form of Bitcoin 
      // transactions.
      const newPostboardToken = await createAction({
        // This Bitcoin transaction ("Action" with a capital A) has one output, 
        // because it has led to the creation of a new Bitcoin token. The token 
        // that gets created represents our new postboard item.
        outputs: [{
          // The output amount is how much Bitcoin (measured in "satoshis") 
          // this token is worth. We use the value that the user entered in the 
          // dialog box.
          satoshis: Number(1),
          // The output script for this token was created by PushDrop library, 
          // which you can see above.
          script: bitcoinOutputScript,
          // Lastly, we should describe this output for the user.
          description: 'New Postboard post'
        }],
        // Describe the Actions that your app facilitates, in the present 
        // tense, for the user's future reference.
        description: 'Create a Postboard post'
      })

      // Notify overlay about transaction
      // TODO: UNCOMMENT CODE BELOW -----------------------------------------------

      // await new Authrite().request(
      //   `${confederacyHost}/submit`,
      //   {
      //     method: 'POST',
      //     body: {
      //       ...newPostboardToken,
      //       topics: ['Postboard']
      //     }
      //   }
      // )

      // ---------------------------------------------------------------------

      // Now, we just let the user know the good news! Their token has been 
      // created, and added to the board.
      toast.dark('Post successfully created!')
      setPosts(originalPosts => ([
        {
          post: postText
        },
        ...originalPosts
      ]))

      setPostText('')
      setCreateOpen(false)
    } catch (e) {
      // Any errors are shown on the screen and printed in the developer console
      toast.error(e.message)
      console.error(e)
    } finally {
      setCreateLoading(false)
    }
  }

  /**
   * This function is called when a user tips a post author
   * Create a new instance of the PaymentTokenator class
   * Optionally configure a custom peerServHost
   */

  // TODO: UNCOMMENT CODE BELOW ---------------------------------------------

  const handleTipSubmit = async e => {
  //   e.preventDefault()

  //   await tokenator.sendPayment({
  //       recipient: selectedPost.identityKey,
  //       amount: tipAmount
  //   })
    
  //   toast.success('Tip sent!')
  //   setTippingOpen(false)
  }

  // ------------------------------------------------------------------------

  // This loads the existing postboard tokens from the overlay network
  // whenever the page loads. This populates their post list.
  // A topic is just a way to keep track of different kinds of Bitcoin tokens.
  useEffect(() => {
    (async () => {
      try {
        // Use Confederacy Postboard lookup service

        // TODO: UNCOMMENT CODE BELOW ---------------------------------------------
        
        // const response = await PacketPay(`${confederacyHost}/lookup`, {
        //   method: 'POST',
        //   body: {
        //     provider: 'Postboard',
        //     query: {}
        //   }
        // })
        // const lookupResult = JSON.parse(Buffer.from(response.body).toString('utf8'))
        
        // ------------------------------------------------------------------------

        // Check for any errors returned and create error to notify bugsnag.
        if (lookupResult.status && lookupResult.status === 'error') {
          const e = new Error(lookupResult.description)
          e.code = lookupResult.code || 'ERR_UNKNOWN'
          throw e
        }

        const decodedResults = []

        // Decode the Postboard token fields
          for (let i = 0; i < lookupResult.length; i++) {
            const decoded = pushdrop.decode({
              script: lookupResult[i].outputScript,
              fieldFormat: 'buffer'
            })
            // Validate key linkage
            // We need to make sure the identity key of the author can be attributed
            // to the locking key associated with the pushdrop token
            // decoded.fields[1] and decoded.lockingPublicKey
            const expected = getPaymentAddress({
              senderPrivateKey: '0000000000000000000000000000000000000000000000000000000000000001',
              recipientPublicKey: decoded.fields[1].toString('hex'),
              returnType: 'publicKey',
              invoiceNumber: '2-postboard-1'
            })
            if (expected !== decoded.lockingPublicKey) {
              continue
            }

            decodedResults.push({
              post: decoded.fields[2].toString('utf8'),
              identityKey: decoded.fields[1].toString('hex'),
            })
          }
        setPosts(decodedResults)

        // Get the list of incoming payments to process
        const payments = await tokenator.listIncomingPayments()
        
        for (const payment of payments) {
          console.log('processing', payment)
          await tokenator.acceptPayment(payment)
          toast.success(`Received a ${payment.token.amount} satoshi tip!`)
        }

      } catch (e) {
        // Any larger errors are also handled. If these steps fail, maybe the 
        // user didn't give our app the right permissions, and we couldn't use 
        // the "postboard" protocol.
        toast.error(`Failed to load posts! Does the app have permission? Error: ${e.message}`)
        console.error(e)
      } finally {
        setPostsLoading(false)
      }
    })()
  }, [])

  // The rest of this file just contains some UI code. All the juicy 
  // Bitcoin - related stuff is above.

  // ------------------------------------------------------

  // Opens the completion dialog for the selected task
  const openTippingModal = post => () => {
    setSelectedPost(post)
    setTippingOpen(true)
  }

  return (
    <>
      {/* This shows the user success messages and errors */}
      <ToastContainer />

      {/* here's the app title bar */}
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Postboard — Share thoughts!
          </Typography>
          <IconButton
            size='large'
            color='inherit'
            onClick={() => {
              window.open('https://github.com/p2ppsr/postboard-ui', '_blank')
            }}
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.app_bar_placeholder} />

      {/* Here's the plus button that hangs out at the bottom-right */}
      <div className={classes.add_fab}>
        <Fab color='secondary' onClick={() => setCreateOpen(true)}>
          <AddIcon />
        </Fab>
      </div>

      {/* This bit shows a loading bar, or the list of tasks */}
      {postsLoading
        ? <LinearProgress className={classes.loading_bar} />
        : (
          <List>
            {posts.length === 0 && (
              <div className={classes.no_items}>
                <Typography variant='h4'>No Posts</Typography>
                <Typography color='textSecondary'>
                  Use the<AddIcon color='primary' />button below to start a post
                </Typography>
              </div>
            )}
            {posts.map((x, i) => (
              <Card
                key={i}
              >
                <CardContent>
                  <Typography>{x.post}</Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={openTippingModal(x)}>Tip</Button>
                </CardActions>
              </Card>
            ))}
          </List>
        )}

      {/* This is the dialog for creating a new task */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth>
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle>
            Create a Post
          </DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              Enter the post you'd like to make:
            </DialogContentText>
            <TextField
              multiline rows={5} fullWidth autoFocus
              label='Write a post'
              onChange={e => setPostText(e.target.value)}
              value={postText}
            />
          </DialogContent>
          {createLoading
            ? <LinearProgress className={classes.loading_bar} />
            : (
            <DialogActions>
              <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type='submit'>OK</Button>
            </DialogActions>
          )}
        </form>
      </Dialog>

      {/* Finally, this is the dialog for sending a tip to a post */}
      <Dialog open={tippingOpen} onClose={() => setTippingOpen(false)}>
        <form onSubmit={handleTipSubmit}>
          <DialogTitle>
            Send a Tip
          </DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              Enter the amount of satoshis you'd like to reward the creator with:
            </DialogContentText>
            <TextField
              type='number'
              value={tipAmount}
              onChange={e => setTipAmount(e.target.value)}
              label='Amount (satoshis)'
            />
          </DialogContent>
          {tipLoading
            ? <LinearProgress className={classes.loading_bar} />
            : (
            <DialogActions>
              <Button onClick={() => setTippingOpen(false)}>Cancel</Button>
              <Button type='submit'>Send Tip</Button>
            </DialogActions>
          )}
        </form>
      </Dialog>
    </>
  )
}

export default App
