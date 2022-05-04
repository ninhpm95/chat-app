import { createElement } from 'react'
import { render } from 'react-dom'

import Application from './application'
import store from './store'

import './styles'

render(
  createElement(Application, { store }),
  document.getElementById('root'),
)
