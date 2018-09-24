// Config
import React from 'react'
import { Checkbox, Repeatable, Text, Textarea } from './components'
import api from './mockApi'

// React Component Class
class App extends React.Component {
  // Instantiate
  constructor(props) {
    super(props)
    // Initialize State
    this.state = {
      data: {
        title: '',
        rating: 0,
        year: null,
        description: '',
        upcoming: true, 
        cast: [],
      }
    }

    // Bind Events
    this.handleChange = this.handleChange.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.Input = this.Input.bind(this)
  }

  /**
   * @func handleChange
   * @desc Handle Form Element Change Event
   * @param {object} delta - changed value data
   */
  handleChange(delta) {
    // Update this.state.data
    this.setState(({ data }) => ({ data: { ...data, ...delta }}))
  }

  /**
   * @func handleUpdate
   * @desc Handle Form Element Update Event
   * @async
   * @param {bool} publish - boolean toggle on saving data
   */
  async handleUpdate(publish = false) {
    // Assign this.state.data to data
    const { data } = this.state

    // Await the results (async)
    const results = await api.post({ ...data, publish })
    console.log('Content updated!')

    // Return resolved or rejected promise
    return results
  }

  /**
   * @func Input
   * @dsec Our Input Component
   * @param {object} {} - anon object
   *     @param {function} children - children as a function
   *     @param {bool} iterable - element is repeatable
   *     @param {string} label - Label for element
   *     @param {string} id - id for element
   */
  Input({ children, iterable, label, id }) {
    // handleChange Overload
    // (so we can map change to element id iteratively)
    const handleChange = value => {
      this.handleChange({ [id]: value })
    }

    // Assign state attr to value
    const value = this.state.data[id]
    let props = {}

    if(iterable) {
      props = {
        id,
        value,
        onCreate: (item) => handleChange([...value, {
          ...item,
          id: Math.floor(Math.random() * 100000),
        }]),
        onUpdate: (item) => handleChange(value.map(prev => {
          if(item.id === prev.id) {
            return item
          }
          return prev
        })),
        onDelete: (id) => handleChange(value.filter(prev => prev.id !== id))
      }
    } else {
      props = {
        id,
        value,
        onBlur: () => this.handleUpdate(false),
        onChange: e => handleChange(e.target.value),
      }
    }

    // Pass props to function-as-child-component
    return (
      <div className="Form-Group">
        <div className="Form-Label">{label}</div>
        {children(props)}
      </div>
    )
  }

  render() {
    const { Input } = this
    return (
      <div className="Form">
        <Input label="Title" id="title">
          {props => <Text {...props} />}
        </Input>
        <Input label="Upcoming" id="upcoming">
          {props => <Checkbox {...props} />}
        </Input>
        <Input label="Description" id="description">
          {props => <Textarea {...props} />}
        </Input>
        <Input label="Cast" iterable id="cast">
          {props => <Repeatable {...props} />}
        </Input>
        <button onClick={() => this.handleUpdate(true)}>
          {'Publish'}
        </button>
      </div>
    )
  }
}

export default App
