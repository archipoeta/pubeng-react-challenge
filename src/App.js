// Config
import React from 'react'
import { Checkbox, Number, Repeatable, Select, Text, Textarea } from './components'
import api from './mockApi'

// React Component Class
class App extends React.Component {
  // Instantiate
  constructor(props) {
    super(props)
    // Initialize State
    this.state = {
      notify: {
        class: "",
        msg: "",
      },
      data: {
        id: props.id || 0,
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
    this.Notify = this.Notify.bind(this)
  }

  // Do this async so we can await
  // the api.get call
  async componentDidMount() {
    // Load initial data if props.id
    // was set in the state
    if (this.state.data.id > 0) {
      // Loading ... Notification
      this.setState({notify:{msg: 'Loading ...', class: ''}})
      // Await the results (async)
      const data = await api.get(this.state.data.id)
      // Reset Notification
      this.setState({notify:{msg: '', class: ''}})
      // Update UI with loaded data
      this.handleChange(data)
    }
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

    // Saving ... Notification
    this.setState({notify:{msg: 'Saving ...', class: ''}})
    try {
      // Await the results (async)
      const results = await api.post({ ...data, publish })

      // Content Updated Notification
      this.setState({notify:{msg: 'Content updated!', class: 'Success'}})

      // Return resolved or rejected promise
      return results
    } catch(e) {
      // API Error Notification
      this.setState({notify:{msg: 'Uh-Oh! API Error!', class: 'Fail'}})
    }
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
    // CHANGED
    // ** we want type=number values to be actual integers! **
    // ** we want type=checkbox values to be actual booleans! **
    // trying to do this inside the child component
    // seemed to trigger a race condition on updating the state
    const handleChange = (value, type) => {
      if (type !== null) {
        if (type === 'number') {
          value = parseInt(value,10) || 0
        } else if (type === 'checkbox') {
          value = value === 'true' ? true : false
        }
      }
      // END CHANGED
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
        onChange: e => handleChange(e.target.value, e.target.type),
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

  /**
   * @func Notify
   * @dsec Our Notify Component
   */
  Notify() {
     return (
      <div className={this.state.notify.class}>
          {this.state.notify.msg}
      </div>
    )
  }

  render() {
    const { Input, Notify } = this
    return (
      <div className="Form">
        <Notify />
        <Input label="Title" id="title">
          {props => <Text {...props} />}
        </Input>
        <Input label="Year" id="year">
          {props => <Select {...props} />}
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
        <Input label="Rating" id="rating">
          {props => <Number {...props} />}
        </Input>
        <button onClick={() => this.handleUpdate(true)}>
          {'Publish'}
        </button>
      </div>
    )
  }
}

export default App
