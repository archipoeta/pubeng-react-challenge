import React from 'react'

export default props => <input type="checkbox" value={true} onChange={e => {e.target.value = (e.target.checked === true); props.onChange(e)}} defaultChecked={true} />
