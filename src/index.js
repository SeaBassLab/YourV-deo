import React from 'react'
import ReactDom from 'react-dom'
import HelloWorld from './components/HelloWorld'

const container = document.getElementById('app')

ReactDom.render(<HelloWorld />, container)