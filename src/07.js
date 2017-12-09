// multi-selection part 1 (stateful selection)
import React, {Component} from 'react'
import Downshift from 'downshift'
import {List} from 'react-virtualized'
import {Recipient} from './components'
import * as styles from './styles'
import {getContacts} from './utils'

class RecipientInput extends React.Component {
  state = {selectedContacts: []}
  handleChange = (selectedContact, downshift) => {
    this.setState(
      ({selectedContacts}) => ({
        selectedContacts: [...selectedContacts, selectedContact],
      }),
      () => {
        this.props.onChange(this.state.selectedContacts)
        downshift.reset()
      },
    )
  }
  itemToString = i => {
    return i ? `${i.name} (${i.email})` : ''
  }
  render() {
    const {onChange} = this.props
    const {selectedContacts} = this.state
    return (
      <Downshift
        itemToString={this.itemToString}
        onChange={this.handleChange}
        defaultHighlightedIndex={0}
        selectedItem={null}
        render={({
          getLabelProps,
          getInputProps,
          getItemProps,
          isOpen,
          highlightedIndex,
          inputValue,
          selectedItem,
          setItemCount,
        }) => (
          <div>
            <label {...getLabelProps({style: {display: 'none'}})}>
              Select your recipients
            </label>
            <div className={styles.input.container}>
              {selectedContacts.map(c => (
                <Recipient key={c.id}>{this.itemToString(c)}</Recipient>
              ))}
              <input
                {...getInputProps({
                  placeholder: 'Enter recipient',
                  className: styles.input.input,
                })}
              />
            </div>
            {!isOpen ? null : (
              <div className={styles.menu.container({windowed: true})}>
                <ContactList
                  highlightedIndex={highlightedIndex}
                  getItemProps={getItemProps}
                  contacts={getContacts(inputValue, {
                    omitContacts: selectedContacts,
                  })}
                  setItemCount={setItemCount}
                />
              </div>
            )}
          </div>
        )}
      />
    )
  }
}

function ContactList({highlightedIndex, getItemProps, contacts, setItemCount}) {
  const rowHeight = 40
  const fullHeight = contacts.length * rowHeight
  setItemCount(contacts.length)
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
            className: styles.contact.container({
              isHighlighted: highlightedIndex === index,
            }),
          })}
        >
          <div>{contacts[index].name}</div>
          <div className={styles.contact.email}>{contacts[index].email}</div>
        </div>
      )}
    />
  )
}

export default RecipientInput
