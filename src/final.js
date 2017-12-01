import React, {Component} from 'react'
import {render} from 'react-dom'
import {css} from 'glamor'
import Downshift from 'downshift'
import {List} from 'react-virtualized'
import {ComposeMail, Recipient} from './components'
import debounce from 'debounce-fn'
import {fetchContacts} from './utils'

function ContactList({highlightedIndex, getItemProps, contacts, setItemCount}) {
  const rowHeight = 40
  const fullHeight = contacts.length * rowHeight
  return (
    <List
      width={300}
      scrollToIndex={highlightedIndex || 0}
      height={fullHeight > 280 ? 280 : fullHeight}
      rowCount={contacts.length}
      rowHeight={rowHeight}
      rowRenderer={({key, index, style}) => (
        <div
          key={contacts[index].id}
          {...getItemProps({
            item: contacts[index],
            index,
            style,
            className: css({
              cursor: 'pointer',
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: highlightedIndex === index ? '#eee' : 'white',
            }),
          })}
        >
          <div>{contacts[index].name}</div>
          <div className={css({fontSize: '0.8em', marginLeft: 2})}>
            {contacts[index].email}
          </div>
        </div>
      )}
    />
  )
}

class FetchContacts extends React.Component {
  static initialState = {loading: false, error: null, contacts: []}
  requestId = 0
  state = FetchContacts.initialState
  mounted = false
  reset(overrides) {
    this.setState({...FetchContacts.initialState, ...overrides})
  }
  fetch = debounce(
    () => {
      console.log('here')
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
    },
    {wait: 300},
  )
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

class RecipientInput extends React.Component {
  state = {selectedContacts: []}
  handleSelect = (selectedContact, downshift) => {
    this.setState(
      ({selectedContacts}) => ({
        selectedContacts: [...selectedContacts, selectedContact],
      }),
      () => downshift.reset(),
    )
  }
  handleInputKeyDown = ({
    event,
    isOpen,
    selectHighlightedItem,
    highlightedIndex,
    reset,
    inputValue,
  }) => {
    if (event.key === 'Backspace' && !event.target.value) {
      // remove the last input
      this.setState(
        ({selectedContacts}) => ({
          selectedContacts: selectedContacts.length
            ? selectedContacts.slice(0, selectedContacts.length - 1)
            : [],
        }),
        () => reset(),
      )
    } else if (isOpen && ['Tab', ',', ';'].includes(event.key)) {
      event.preventDefault()
      if (highlightedIndex != null) {
        selectHighlightedItem()
      } else {
        this.setState(
          ({selectedContacts}) => ({
            selectedContacts: [
              ...selectedContacts,
              {
                id: inputValue.toLowerCase(),
                email: inputValue,
                name: inputValue,
              },
            ],
          }),
          () => reset(),
        )
      }
    }
  }
  removeContact(contact) {
    this.setState(
      ({selectedContacts}) => ({
        selectedContacts: selectedContacts.filter(c => c !== contact),
      }),
      () => this.input.focus(),
    )
  }
  itemToString = i => {
    return i ? (i.name === i.email ? i.name : `${i.name} (${i.email})`) : ''
  }
  render() {
    const {selectedContacts} = this.state
    return (
      <Downshift
        itemToString={this.itemToString}
        selectedItem={null}
        onSelect={this.handleSelect}
        defaultHighlightedIndex={0}
        render={({
          getLabelProps,
          getInputProps,
          getItemProps,
          isOpen,
          toggleMenu,
          clearSelection,
          highlightedIndex,
          selectHighlightedItem,
          setHighlightedIndex,
          reset,
          inputValue,
          clearItems,
          setItemCount,
        }) => (
          <div>
            <label {...getLabelProps({style: {display: 'none'}})}>
              Select your recipients
            </label>
            <div
              className={css({
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              })}
            >
              {selectedContacts.map(c => (
                <Recipient
                  key={c.id}
                  isValid={c.email.includes('@')}
                  onRemove={() => this.removeContact(c)}
                >
                  {this.itemToString(c)}
                </Recipient>
              ))}
              <input
                {...getInputProps({
                  ref: n => (this.input = n),
                  onKeyDown: event =>
                    this.handleInputKeyDown({
                      event,
                      selectHighlightedItem,
                      highlightedIndex,
                      isOpen,
                      reset,
                      inputValue,
                    }),
                  placeholder: 'Enter recipients',
                  className: css({
                    flex: 1,
                    border: 'none',
                    paddingTop: 10,
                    paddingBottom: 10,
                    outline: 'none',
                    width: '100%',
                    minWidth: '100',
                  }),
                })}
              />
            </div>
            {!isOpen ? null : (
              <FetchContacts
                searchValue={inputValue}
                omitContacts={selectedContacts}
                onLoaded={({contacts}) => {
                  clearItems()
                  if (contacts) {
                    setHighlightedIndex(contacts.length ? 0 : null)
                    setItemCount(contacts.length)
                  }
                }}
                render={({loading, contacts, error}) => (
                  <div
                    className={css({
                      position: 'absolute',
                      backgroundColor: 'white',
                      width: 300,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      border: '1px solid rgba(0,0,0,.2)',
                    })}
                  >
                    {loading ? (
                      <div className={css({padding: 10})}>loading...</div>
                    ) : error ? (
                      <div className={css({padding: 10})}>error...</div>
                    ) : contacts.length ? (
                      <ContactList
                        highlightedIndex={highlightedIndex}
                        getItemProps={getItemProps}
                        contacts={contacts}
                      />
                    ) : (
                      <div className={css({padding: 10})}>no results...</div>
                    )}
                  </div>
                )}
              />
            )}
          </div>
        )}
      />
    )
  }
}

export default RecipientInput
