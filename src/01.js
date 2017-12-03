import React, {Component} from 'react'
import Downshift from 'downshift'
import * as styles from './styles'
import {getContacts} from './utils'

class RecipientInput extends React.Component {
  itemToString = i => {
    return i ? i.email : ''
  }
  render() {
    return (
      <Downshift
        itemToString={this.itemToString}
        defaultHighlightedIndex={0}
        onChange={this.props.onChange}
        render={({
          getLabelProps,
          getInputProps,
          getItemProps,
          isOpen,
          highlightedIndex,
          setHighlightedIndex,
          inputValue,
        }) => (
          <div>
            <label
              {...getLabelProps({
                style: {display: 'none'},
              })}
            >
              Select your recipient
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
}

export default RecipientInput
