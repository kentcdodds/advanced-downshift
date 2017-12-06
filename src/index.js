import React, {Component} from 'react'
import {render} from 'react-dom'
import {ComposeMail} from './components'
import RecipientInput from './final'

class App extends React.Component {
  state = {selection: null}
  render() {
    return (
      <div>
        <ComposeMail
          autocomplete={
            <RecipientInput
              onChange={selection => this.setState({selection})}
            />
          }
        />
        <hr />
        Selection: <pre>{JSON.stringify(this.state.selection, null, 2)}</pre>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
