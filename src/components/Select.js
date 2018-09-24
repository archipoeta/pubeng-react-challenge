import React from 'react'

export default props => <select {...props} value={props.value || ''} onChange={e => props.onChange(e)} >
    { Array.from(Array(11).keys()).map(
        value => <option key={value} value={2010 + value}>{2010 + value}</option>
    ) }
</select>
