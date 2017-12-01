import React, {Component} from 'react'
import {render} from 'react-dom'
import {ComposeMail} from './components'
import RecipientInput from './final'

class App extends React.Component {
  render() {
    return <ComposeMail autocomplete={<RecipientInput />} />
  }
}

render(<App />, document.getElementById('root'))
