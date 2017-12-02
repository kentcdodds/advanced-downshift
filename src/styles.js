/*
 * Normally I'd just inline all this stuff, but
 * I want to remove as much distraction as possible
 * so I pulled all styles into this file.
 */
import {css} from 'glamor'

const contact = {
  container: ({isHighlighted}) =>
    css({
      cursor: 'pointer',
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: isHighlighted ? '#eee' : 'white',
    }),
  email: css({fontSize: '0.8em', marginLeft: 2}),
}

const input = {
  container: css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  }),
  input: css({
    flex: 1,
    border: 'none',
    paddingTop: 10,
    paddingBottom: 10,
    outline: 'none',
    width: '100%',
    minWidth: '100',
  }),
}

const menu = {
  container: ({final} = {}) =>
    css({
      position: 'absolute',
      backgroundColor: 'white',
      width: 300,
      maxHeight: final ? null : 280,
      overflow: final ? null : 'scroll',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      border: '1px solid rgba(0,0,0,.2)',
    }),
  status: css({padding: 10}),
}

const recipient = {
  container: ({isValid}) =>
    css({
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
    }),
  button: css({
    WebkitAppearance: 'none',
    marginLeft: 6,
    color: '#868686',
    backgroundColor: '#f5f5f5',
    border: 'none',
    cursor: 'pointer',
    padding: 2,
  }),
}

export {contact, input, menu, recipient}
