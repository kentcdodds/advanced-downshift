// styling
import React, {Component} from 'react'
import Downshift from 'downshift'
import * as styles from './styles'
import {getContacts} from './utils'

function RecipientInput({onChange}) {
  return (
    <Downshift
      itemToString={i => (i ? i.email : '')}
      onChange={onChange}
      render={({
        getInputProps,
        getItemProps,
        isOpen,
        highlightedIndex,
        inputValue,
      }) => (
        <div>
          <div className={styles.input.container}>
            <input
              {...getInputProps({
                placeholder: 'Enter recipient',
                className: styles.input.input,
              })}
            />
          </div>
          {!isOpen ? null : (
            <div className={styles.menu.container()}>
              {getContacts(inputValue).map((contact, index) => (
                <div
                  key={contact.id}
                  {...getItemProps({
                    item: contact,
                    index,
                    className: styles.contact.container({
                      isHighlighted: highlightedIndex === index,
                    }),
                  })}
                >
                  <div>{contact.name}</div>
                  <div className={styles.contact.email}>{contact.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    />
  )
}

export default RecipientInput
