import React from 'react'
import {css} from 'glamor'
import * as styles from './styles'

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
  static defaultProps = {
    isValid: true,
  }
  focusButton = () => this.button.focus()
  render() {
    const {children, onRemove, isValid} = this.props
    return (
      <div
        onClick={this.focusButton}
        className={styles.recipient.container({isValid})}
      >
        {children}
        {onRemove ? (
          <button
            ref={n => (this.button = n)}
            className={styles.recipient.button}
            onClick={onRemove}
          >
            x
          </button>
        ) : null}
      </div>
    )
  }
}

export {ComposeMail, Recipient}
