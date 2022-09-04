import firebase from './firebase.js'
import { collection, getDocs, addDoc } from 'firebase/firestore';

class App {
  constructor() {
    this.db = firebase.db
    this.types = []
    this.subTypes = []
    this.formatTypes = []
    this.entries = []
  }

  async init(onFinish) {
    const [types, subTypes, formatTypes, entries] = await Promise.all(['types', 'subTypes', 'formatTypes', 'entry'].map(item => {
      const { db } = this
      return App.fetchDocs(item, db)
    }))

    this.types = types
    this.subTypes = subTypes
    this.formatTypes = formatTypes
    this.entries = entries
    onFinish && onFinish()
  }

  static async fetchDocs(name, db) {
    const coll = collection(db, name);
    const docs = await getDocs(coll).then(resp => resp.docs)

    return docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  }
}

class Page extends App {
  constructor() {
    const hashchange = () => {
      const { hash } = window.location

      document.querySelectorAll('.app__menuItem').forEach(link => link.classList.remove('bold'));
      const activeRouteLink = document.querySelector(`.app__menuItem[href=\\${hash}]`);

      activeRouteLink.classList.add('bold')
      this.render(hash.replace('#', ''))
    }
    super()
    this.init(hashchange);
    window.addEventListener('hashchange', hashchange)
  }

  render(name) {
    const $pageEl = document.querySelector('.app__main')
    this[name]?.($pageEl)
  }

  dashboard($el) {
    const html = this.entries.map(entry => `<div class="app__entryItem" data-id="${entry.id}">
      ${entry.name} - ${entry.value}
    </div>`)
    $el.innerHTML = `<div class="app__entry">${html.join('')}</div>`
  }

  addEntry($el) {
    const { types, subTypes, formatTypes } = this
    const buildOptions = options => options.map(opt => `<option value="${opt.value}">${opt.title}</option>`).join('')

    $el.innerHTML = `<div>
      <span class="app__entryLbl">Title</span>: <input type="text" class="app__entryInput" data-name="name"/>
      <br/><br/>
      <span class="app__entryLbl">Type</span>: 
      <select class="app__entryInput" data-name="ref-[types]">${buildOptions(types)}</select>
      <br/><br/>
      <span class="app__entryLbl">Sub Type</span>:
      <select class="app__entryInput" data-name="ref-[subTypes]">${buildOptions(subTypes)}</select>
      <br/><br/>
      <span class="app__entryLbl">Value</span>: <input type="text" class="app__entryInput" data-name="value"/>
      <br/><br/>
      <span class="app__entryLbl">Format Type</span>:
      <select class="app__entryInput" data-name="ref-[formatTypes]-value">${buildOptions(formatTypes)}</select>
      <br/><br/>
      <button class="app__entrySubmit">Submit</button>
    </div>`

    const submit = document.querySelector('.app__entrySubmit');
    const inputs = document.querySelectorAll('.app__entryInput')
    submit.addEventListener('click', async () => {
      const payload = [...inputs].reduce((payload, input) => {
        const { dataset, value } = input
        payload[dataset.name] = value
        return payload
      }, {})
      
      const { db } = this
      const { id } = await addDoc(collection(db, "entry"), payload);
      this.entries.unshift({
        id,
        ...payload
      })
    })
  }

  addTypes($el) {
    const { types, subTypes, formatTypes } = this
    const buildOptions = options => options.map(opt => `<option value="${opt.value}">${opt.title}</option>`).join('')
    $el.innerHTML = `<div>
      <span class="app__entryLbl">Type</span>: <input type="text" class="app__entryInput" data-name="title"/>
      <select data-name="ref-[types]">${buildOptions(types)}</select>
      <br/><br/>
      <span class="app__entryLbl">Sub Types</span>: <input type="text" class="app__entryInput" data-name="title"/>
      <select data-name="ref-[subTypes]">${buildOptions(subTypes)}</select>
      <br/><br/>
      <span class="app__entryLbl">Format Types</span>: <input type="text" class="app__entryInput" data-name="title"/>
      <select data-name="ref-[formatTypes]">${buildOptions(formatTypes)}</select>
    </div>`
  }
}

const page = new Page;
console.log('page', page)