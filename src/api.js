import matchSorter from 'match-sorter'
import starWarsNames from 'starwars-names'

const allContacts = starWarsNames.all.map(s => ({
  name: s,
  email: `${s.toLowerCase().replace(/[ ']/g, '.')}@smail.com`,
  id: s.toLowerCase(),
}))

function fetchContacts(searchValue, {omitContacts, limit, requestId}) {
  return new Promise(resolve => {
    setTimeout(() => {
      const remainingContacts = allContacts.filter(
        c => !omitContacts.some(sc => sc.id === c.id),
      )
      const sortedContacts = searchValue
        ? matchSorter(remainingContacts, searchValue, {
            keys: ['name'],
          })
        : remainingContacts
      const limitedContacts = limit
        ? sortedContacts.slice(0, limit)
        : sortedContacts
      resolve({
        response: {
          data: limitedContacts,
          requestId,
        },
      })
    }, Math.random() * 1000)
  })
}

export {fetchContacts}
