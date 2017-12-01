import React, {Component} from 'react'
import {render} from 'react-dom'
import {css} from 'glamor'
import Downshift from 'downshift'
import {List} from 'react-virtualized'
import {ComposeMail, Recipient} from './components'
import debounce from 'debounce-fn'
import {getContacts} from './utils'

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
              <div
                className={css({
                  position: 'absolute',
                  backgroundColor: 'white',
                  width: 300,
                  maxHeight: 280,
                  overflowY: 'scroll',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(0,0,0,.2)',
                })}
              >
                {getContacts(inputValue, {
                  omitContacts: selectedContacts,
                }).map((contact, index) => (
                  <div
                    key={contact.id}
                    {...getItemProps({
                      item: contact,
                      index,
                      className: css({
                        cursor: 'pointer',
                        paddingLeft: 10,
                        paddingRight: 10,
                        backgroundColor:
                          highlightedIndex === index ? '#eee' : 'white',
                      }),
                    })}
                  >
                    <div>{contact.name}</div>
                    <div className={css({fontSize: '0.8em', marginLeft: 2})}>
                      {contact.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      />
    )
  }
}

export default RecipientInput
