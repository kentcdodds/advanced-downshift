// windowing part 1
import React, {Component} from 'react'
import Downshift from 'downshift'
import {List} from 'react-virtualized'
import * as styles from './styles'
import {getContacts} from './utils'

function RecipientInput({onChange}) {
  return (
    <Downshift
      itemToString={i => (i ? i.email : '')}
      onChange={onChange}
      defaultHighlightedIndex={0}
      render={({
        getLabelProps,
        getInputProps,
        getItemProps,
        isOpen,
        highlightedIndex,
        inputValue,
        selectedItem,
      }) => (
        <div>
          <label {...getLabelProps({style: {display: 'none'}})}>
            Select your recipients
          </label>
          <div className={styles.input.container}>
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
                  omitContacts: [selectedItem],
                })}
              />
            </div>
          )}
        </div>
      )}
    />
  )
}

function ContactList({highlightedIndex, getItemProps, contacts}) {
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
