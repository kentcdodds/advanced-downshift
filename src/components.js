import React from 'react'
import {css} from 'glamor'
import {fetchContacts} from './api'

function ComposeMail({autocomplete}) {
  return (
    <div className={css({border: '1px solid gray'})}>
      <div
        className={css({
          backgroundColor: '#404040',
          color: 'white',
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          display: 'flex',
          justifyContent: 'space-between',
        })}
      >
        <div>New Message</div>
        <div
          className={css({
            display: 'flex',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            textAlign: 'right',
          })}
        >
          <div className={css({width: 20, cursor: 'pointer'})}>_</div>
          <div className={css({width: 20, cursor: 'pointer'})}>X</div>
        </div>
      </div>
      <div className={css({padding: 10})}>
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            paddingBottom: 10,
          })}
        >
          <div className={css({marginRight: 10})}>To</div>
          <div className={css({flex: '1'})}>{autocomplete}</div>
        </div>
        <div
          className={css({
            borderTop: '1px solid #cfcfcf',
            borderBottom: '1px solid  #cfcfcf',
            marginLeft: -10,
            marginRight: -10,
          })}
        >
          <input
            placeholder="Subject"
            className={css({
              paddingTop: 10,
              paddingBottom: 10,
              width: '100%',
              paddingLeft: 10,
              paddingRight: 10,
              border: 'none',
              outline: 'none',
            })}
          />
        </div>
        <div className={css({paddingTop: 10})}>
          <textarea
            className={css({
              border: 'none',
              width: '100%',
              height: '100%',
              minHeight: 200,
              outline: 'none',
              resize: 'none',
            })}
          />
        </div>
      </div>
    </div>
  )
}

class Recipient extends React.Component {
  focusButton = () => this.button.focus()
  render() {
    const {children, onRemove, isValid} = this.props
    return (
      <div
        onClick={this.focusButton}
        className={css({
          backgroundColor: '#f5f5f5',
          fontSize: '0.9em',
          border: '1px solid',
          borderColor: isValid ? '#d9d9d9' : '#d61111',
          borderRadius: 4,
          paddingTop: 2,
          paddingBottom: 2,
          paddingRight: 6,
          paddingLeft: 6,
          marginLeft: 4,
          marginRight: 4,
          display: 'flex',
          cursor: 'pointer',
        })}
      >
        {children}
        <button
          ref={n => (this.button = n)}
          className={css({
            WebkitAppearance: 'none',
            marginLeft: 6,
            color: '#868686',
            backgroundColor: '#f5f5f5',
            border: 'none',
            cursor: 'pointer',
            padding: 2,
          })}
          onClick={onRemove}
        >
          x
        </button>
      </div>
    )
  }
}

function debounce(fn, time) {
  let timeoutId
  return wrapper
  function wrapper(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, time)
  }
}

class FetchContacts extends React.Component {
  static initialState = {loading: false, error: null, contacts: []}
  requestId = 0
  state = FetchContacts.initialState
  mounted = false
  reset(overrides) {
    this.setState({...FetchContacts.initialState, ...overrides})
  }
  fetch = debounce(() => {
    if (!this.mounted) {
      return
    }
    const {omitContacts, limit} = this.props
    this.requestId++
    fetchContacts(this.props.searchValue, {
      omitContacts,
      limit,
      requestId: this.requestId,
    }).then(
      ({response: {data: contacts, requestId}}) => {
        if (this.mounted && requestId === this.requestId) {
          this.props.onLoaded({contacts})
          this.setState({loading: false, contacts})
        }
      },
      ({response: {error, requestId}}) => {
        if (this.mounted && requestId === this.requestId) {
          this.props.onLoaded({error})
          this.setState({loading: false, error})
        }
      },
    )
  }, 300)
  prepareFetch() {
    this.reset({loading: true})
  }
  componentDidMount() {
    this.mounted = true
    this.prepareFetch()
    this.fetch()
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.searchValue !== this.props.searchValue ||
      prevProps.omitContacts !== this.props.omitContacts
    ) {
      this.prepareFetch()
      this.fetch()
    }
  }
  componentWillUnmount() {
    this.mounted = false
  }
  render() {
    return this.props.render(this.state)
  }
}

export {ComposeMail, Recipient, FetchContacts}