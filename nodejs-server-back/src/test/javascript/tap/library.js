const applicationName = 'test'
const library = require('../../../main/javascript/library')
const libraryName = 'sqwerl-catalog'
const path = 'src/test/resources/sqwerl-catalog'
const test = require('tap').test

test('Can create catalog library', t => {
  let appName = 'test'
  let name = 'catalog'
  let path = 'src/test/resources/sqwerl-catalog'
  let expectedTypeNames
  let id
  let typePaths
  let child
  library.newInstance(appName, name, null, path, '.', catalog => {
    t.equal(catalog.name, name)
    t.equal(catalog.home, path)
    t.notEqual(catalog.fileServer, null)
    t.notEqual(catalog.query, undefined)
    t.notEqual(catalog.types, null)
    expectedTypeNames = [
      '/types',
      '/types/accounts',
      '/types/capabilities',
      '/types/groups',
      '/types/libraries',
      '/types/roles',
      '/types/users'
    ]
    typePaths = {}
    expectedTypeNames.forEach(typeName => {
      typePaths[`</${appName}/${catalog.name}${typeName}>`] = ''
    })
    for (child in catalog.types) {
      id = `</${appName}/${catalog.name}${child.slice(1, child.length)}`
      t.ok(typePaths.hasOwnProperty(id))
      delete typePaths[id]
    }
    t.equal(Object.keys(typePaths).length, 0)
    t.end()
  })
})

test('Can determine object is a type', t => {
  let appName = 'test'
  let name = 'catalog'
  library.newInstance(
    appName,
    name,
    null,
    'src/test/resources/sqwerl-catalog',
    '.',
    library1 => {
      library.newInstance(
        appName,
        'default',
        library1,
        'src/test/resources/default',
        '.',
        library2 => {
          let thing = {}
          library2.addIsTypeAttribute(library, '/types/users', thing)
          t.equal(thing.hasOwnProperty('isType'), true)
          t.equal(thing.isType, true)
          thing = {}
          library2.addIsTypeAttribute(library, '/types/users/Administrator', thing)
          t.equal(thing.hasOwnProperty('isType'), false)
          library2.addIsTypeAttribute(library2, '/types/users', thing)
        }
      )
    }
  )
  t.end()
})

test('Cannot create library with null application name', t => {
  t.throws(() => {
    library.newInstance(null, libraryName, null, path, path, () => {})
  })
  t.end()
})

test('Cannot create library with empty application name', t => {
  t.throws(() => {
    library.newInstance('', libraryName, null, path, path, () => {})
  })
  t.end()
})

test('Cannot create library with null name', t => {
  t.throws(() => {
    library.newInstance(applicationName, null, null, path, path, () => {})
  })
  t.end()
})

test('Cannot create library with empty name', t => {
  t.throws(() => {
    library.newInstance(applicationName, '', null, path, path, () => {})
  })
  t.end()
})

test('Cannot create library with null home path', t => {
  t.throws(() => {
    library.newInstance(applicationName, libraryName, null, null, path, () => {})
  })
  t.end()
})

test('Cannot create library with empty home path', t => {
  t.throws(() => {
    library.newInstance(applicationName, libraryName, null, '', path, () => {})
  })
  t.end()
})

test('Cannot create library with null repository path', t => {
  t.throws(() => {
    library.newInstance(applicationName, libraryName, null, path, null, () => {})
  })
  t.end()
})

test('Cannot create library with empty repository path', t => {
  t.throws(() => {
    library.newInstance(applicationName, libraryName, null, path, '', () => {})
  })
  t.end()
})

test('Can inherit property definitions from super-types', t => {
  const applicationName = 'test'
  const name = 'catalog'
  const path = 'src/test/resources/sqwerl-catalog'
  library.newInstance(applicationName, name, null, path, '.', catalog => {
    t.ok(catalog.types)
    let accountType = catalog.types['</types/accounts>']
    t.ok(accountType)
    /* TODO
    let expectedProperties = [
      'addedBy',
      'addedOn',
      'canRead',
      'canWrite',
      'hasAttended',
      'hasListenedTo',
      'owner',
      'shortDescription',
      'tags',
      'version',
      'foobar'
    ];
    expectedProperties.forEach(property => {
      console.log('accountType.properties[property]: ' + JSON.stringify(accountType.properties[property]));
      t.equal(accountType.properties.hasOwnProperty(property), true);
    });
    */
    t.end()
  })
})
