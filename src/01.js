// raw
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
        inputValue,
        selectedItem,
      }) => (
        <div>
          <div>
            <input {...getInputProps()} />
          </div>
          {!isOpen ? null : (
            <div>
              {getContacts(inputValue, {
                limit: 10,
                omitContacts: [selectedItem],
              }).map((contact, index) => (
                <div
                  key={contact.id}
                  {...getItemProps({
                    item: contact,
                    index,
                  })}
                >
                  <div>{contact.name}</div>
                  <div>{contact.email}</div>
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
