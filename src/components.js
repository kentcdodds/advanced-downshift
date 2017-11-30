import React from 'react'
import {css} from 'glamor'

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
    const {children, onRemove} = this.props
    return (
      <div
        onClick={this.focusButton}
        className={css({
          backgroundColor: '#f5f5f5',
          fontSize: '0.9em',
          border: '1px solid #d9d9d9',
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

export {ComposeMail, Recipient}
